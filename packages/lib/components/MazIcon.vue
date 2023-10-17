<template>
  <!-- eslint-disable vue/no-v-html -->
  <!-- eslint-disable vue/html-self-closing -->
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
  <!-- eslint-enable vue/html-self-closing -->
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref, computed, watchEffect, type PropType } from 'vue'

  import { injectStrict } from '../modules/helpers/inject-strict'

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
    size: { type: String, default: undefined },
    title: { type: String, default: undefined },
    transformSource: {
      type: Function as PropType<(param: SVGElement) => typeof param>,
      default: (svg: SVGElement) => svg,
    },
  })

  const emits = defineEmits(['loaded', 'unloaded', 'error'])

  const iconPath = computed(() => props.path ?? getMazIconPath())
  const fullSrc = computed(() => {
    if (props.src) {
      return props.src
    } else if (iconPath.value) {
      return `${iconPath.value}/${props.name}.svg`
    } else {
      return `/${props.name}.svg`
    }
  })

  onMounted(() => {
    if (!props.name && !props.src) {
      console.error('[maz-ui](MazIcon) you should provide "name" or "src" as prop')
    }
  })

  const setTitle = (svg: SVGElement, title: string) => {
    const titleTags = svg.querySelectorAll('title')
    if (titleTags.length > 0) {
      // overwrite existing title
      titleTags[0].textContent = title
    } else {
      // create a title element if one doesn't already exist
      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title')
      titleEl.textContent = title
      svg.append(titleEl)
    }
  }

  const filterAttrs = (attrs: Record<string, unknown>) => {
    return Object.keys(attrs).reduce((result, key) => {
      if (attrs[key] !== false && attrs[key] !== null && attrs[key] !== undefined) {
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
      svgElSource.value = await cache[src]
      // wait to render
      await nextTick()
      emits('loaded', svgElem.value)
    } catch (error) {
      if (svgElSource.value) {
        svgElSource.value = undefined
        emits('unloaded')
      }
      // remove cached rejected promise so next image can try load again
      delete cache[src]
      emits('error', error)
    }
  }

  const download = (url: string): Promise<SVGElement> => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.open('GET', url, true)

      request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400) {
          try {
            // Setup a parser to convert the response to text/xml in order for it to be manipulated and changed
            const parser = new DOMParser()
            const result = parser.parseFromString(request.responseText, 'text/xml')
            let svgEl = result.querySelectorAll('svg')[0] as SVGElement
            if (svgEl) {
              svgEl = props.transformSource(svgEl)
              resolve(svgEl)
            } else {
              reject(new Error('Loaded file is not valid SVG"'))
            }
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('Error loading SVG'))
        }
      })

      request.addEventListener('error', () => reject())
      request.send()
    })
  }

  watchEffect(() => getSource(fullSrc.value))
</script>
