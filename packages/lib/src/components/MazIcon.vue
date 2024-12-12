<script lang="ts" setup>
import { injectStrict } from '@helpers/injectStrict'

import { computed, nextTick, onMounted, type PropType, ref, watchEffect } from 'vue'

const props = defineProps({
  /** The source path of the SVG file - e.g: `/icons/home.svg` */
  src: { type: String, default: undefined },
  /** The path of the folder where the SVG files are stored - e.g: `/icons` */
  path: { type: String, default: undefined },
  /** The name of the SVG file - e.g: `home` */
  name: { type: String, default: undefined },
  /** The size of the SVG file - e.g: `1em` */
  size: { type: String, default: undefined },
  /** The title of the SVG file - e.g: `Home` */
  title: { type: String, default: undefined },
  /** The function to transform the source of the SVG file - e.g: `(svg) => svg` */
  transformSource: {
    type: Function as PropType<(param: SVGElement) => typeof param>,
    default: (svg: SVGElement) => svg,
  },
})
const emits = defineEmits<{
  /**
   * emitted when SVG file is loaded
   * @property {SVGElement | undefined} svg the svg element loaded
   */
  (event: 'loaded', svg: SVGElement | undefined): void
  /**
   * emitted when SVG file is not loaded
   */
  (event: 'unloaded'): void
  /**
   * emitted when SVG file is not loaded
   * @property {Error} error the error
   */
  (event: 'error', error: Error): void
}>()
const cache: Record<string, Promise<SVGElement>> = {}
const svgElSource = ref<SVGElement>()
const svgElem = ref<SVGElement>()

function getMazIconPath() {
  try {
    return injectStrict<string>('mazIconPath')
  }
  catch {
    return undefined
  }
}

const iconPath = computed(() => props.path ?? getMazIconPath())
const fullSrc = computed(() => {
  if (props.src) {
    return props.src
  }
  else if (iconPath.value) {
    return `${iconPath.value}/${props.name}.svg`
  }
  else {
    return `/${props.name}.svg`
  }
})

onMounted(() => {
  if (!props.name && !props.src) {
    console.error('[maz-ui](MazIcon) you should provide "name" or "src" as prop')
  }
})

function setTitle(svg: SVGElement, title: string) {
  const titleTags = svg.querySelectorAll('title')
  if (titleTags.length > 0) {
    // overwrite existing title
    titleTags[0].textContent = title
  }
  else {
    // create a title element if one doesn't already exist
    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title')
    titleEl.textContent = title
    svg.append(titleEl)
  }
}

function filterAttrs(attrs: Record<string, unknown>) {
  return Object.keys(attrs).reduce((result, key) => {
    if (attrs[key] !== false && attrs[key] !== null && attrs[key] !== undefined) {
      result[key] = attrs[key]
    }
    return result
  }, {})
}

function getSvgAttrs(svgEl: SVGElement) {
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

function getSvgContent(svgEl: SVGElement) {
  svgEl.cloneNode(true)
  const svgElNode = props.transformSource(svgEl)

  if (props.title) {
    setTitle(svgElNode as SVGElement, props.title)
  }

  // copy inner html
  return svgEl.innerHTML
}

async function getSource(src: string) {
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
  }
  catch (error) {
    if (svgElSource.value) {
      svgElSource.value = undefined
      emits('unloaded')
    }
    // remove cached rejected promise so next image can try load again
    delete cache[src]
    emits('error', error as Error)
  }
}

function download(url: string): Promise<SVGElement> {
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
          }
          else {
            reject(new Error('Loaded file is not valid SVG"'))
          }
        }
        catch (error) {
          reject(error)
        }
      }
      else {
        reject(new Error('Error loading SVG'))
      }
    })

    request.addEventListener('error', error => reject(error))
    request.send()
  })
}

watchEffect(() => getSource(fullSrc.value))
</script>

<template>
  <svg
    v-if="svgElSource"
    ref="svgElem"
    class="m-icon m-reset-css"
    width="1em"
    height="1em"
    v-bind="{
      ...getSvgAttrs(svgElSource),
      ...filterAttrs($attrs),
    }"
    :style="`font-size: ${size}`"
    v-html="getSvgContent(svgElSource)"
  />
</template>
