<template>
  <!-- eslint-disable vue/no-v-html -->
  <svg
    v-if="svgElSource"
    ref="svgElem"
    width="1em"
    height="1em"
    v-bind="{
      ...getSvgAttrs(svgElSource),
      ...filterAttrs($attrs),
    }"
    :style="`font-size: ${size}`"
    v-html="getSvgContent(svgElSource)"
  ></svg>
  <!-- eslint-enable vue/no-v-html -->
</template>

<!-- // inheritAttrs: false -->
<script lang="ts" setup>
  import { nextTick, onMounted, ref, watch, computed } from 'vue'
  import type { PropType } from 'vue'

  import { injectStrict } from '../helpers/inject-strict'

  const cache: Record<string, Promise<SVGElement>> = {}
  const svgElSource = ref<SVGElement>()
  const svgElem = ref<SVGElement>()

  const getMazIconPath = () => {
    try {
      return injectStrict<string>('mazIconPath')
    } catch {
      return undefined
    }
  }

  const props = defineProps({
    src: { type: String, default: undefined },
    path: { type: String, default: undefined },
    name: { type: String, default: undefined },
    size: { type: String, default: '1.5rem' },
    title: { type: String, default: undefined },
    transformSource: {
      type: Function as PropType<(param: SVGElement) => typeof param>,
      default: (svg: SVGElement) => svg,
    },
  })

  const emits = defineEmits(['loaded', 'unloaded', 'error'])

  const iconPath = computed(() => props.path ?? getMazIconPath())
  const fullSrc = computed(() =>
    props.src
      ? props.src
      : iconPath.value
      ? `${iconPath.value}/${props.name}.svg`
      : `/${props.name}.svg`,
  )

  onMounted(() => {
    if (!props.name && !props.src) {
      throw new Error(
        '[maz-ui](MazIcon) you should provide "name" or "src" as prop',
      )
    }
    getSource(fullSrc.value)
  })

  const setTitle = (svg: SVGElement, title: string) => {
    const titleTags = svg.getElementsByTagName('title')
    if (titleTags.length) {
      // overwrite existing title
      titleTags[0].textContent = title
    } else {
      // create a title element if one doesn't already exist
      const titleEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title',
      )
      titleEl.textContent = title
      svg.appendChild(titleEl)
    }
  }

  const filterAttrs = (attrs: Record<string, unknown>) => {
    return Object.keys(attrs).reduce((result, key) => {
      if (
        attrs[key] !== false &&
        attrs[key] !== null &&
        attrs[key] !== undefined
      ) {
        result[key] = attrs[key]
      }
      return result
    }, {})
  }

  const getSvgAttrs = (svgEl: SVGElement) => {
    // copy attrs
    const svgAttrs = {}
    const attrs = svgEl.attributes
    if (!attrs) {
      return svgAttrs
    }
    for (let i = attrs.length - 1; i >= 0; i--) {
      svgAttrs[attrs[i].name] = attrs[i].value
    }
    return svgAttrs
  }

  const getSvgContent = (svgEl: SVGElement) => {
    let svgElNode = svgEl.cloneNode(true)
    svgElNode = props.transformSource(svgEl)

    if (props.title) {
      setTitle(svgElNode as SVGElement, props.title)
    }

    // copy inner html
    return svgEl.innerHTML
  }

  const getSource = async (src: string) => {
    // fill cache by src with promise
    if (!cache[src]) {
      // download
      cache[src] = download(src)
    }

    // inline svg when cached promise resolves
    try {
      const svg = await cache[src]
      svgElSource.value = svg
      // wait to render
      await nextTick()
      emits('loaded', svgElem.value)
    } catch (err) {
      if (svgElSource.value) {
        svgElSource.value = undefined
        emits('unloaded')
      }
      // remove cached rejected promise so next image can try load again
      delete cache[src]
      emits('error', err)
    }
  }

  const download = (url: string): Promise<SVGElement> => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          try {
            // Setup a parser to convert the response to text/xml in order for it to be manipulated and changed
            const parser = new DOMParser()
            const result = parser.parseFromString(
              request.responseText,
              'text/xml',
            )
            let svgEl = result.getElementsByTagName('svg')[0] as SVGElement
            if (svgEl) {
              svgEl = props.transformSource(svgEl)
              resolve(svgEl)
            } else {
              reject(new Error('Loaded file is not valid SVG"'))
            }
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error('Error loading SVG'))
        }
      }

      request.onerror = reject
      request.send()
    })
  }

  watch(
    () => props.src,
    () => getSource(fullSrc.value),
  )
</script>
