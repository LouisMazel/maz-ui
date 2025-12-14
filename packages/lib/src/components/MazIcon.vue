<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'

import type { StyleValue } from 'vue'
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'

const {
  icon,
  src,
  path,
  name,
  size,
  title,
  transformSource = (svg: SVGElement) => svg,
} = defineProps<MazIconProps>()

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

const predefinedSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

type SizeUnit
  = | `${number}px`
    | `${number}em`
    | `${number}rem`
    | `${number}%`
    | `${number}vw`
    | `${number}vh`
    | `${number}cm`
    | `${number}mm`
    | `${number}in`
    | `${number}pt`
    | `${number}pc`
    | `${number}ex`

type PredefinedSize = typeof predefinedSizes[number]

type MazIconSize = SizeUnit | PredefinedSize

export interface MazIconProps {
  /** The icon component to render - e.g: `import { MazStar } from '@maz-ui/icons'` */
  icon?: IconComponent
  /** The source path of the SVG file - e.g: `/icons/home.svg` */
  src?: string
  /** The path of the folder where the SVG files are stored - e.g: `/icons` */
  path?: string
  /** The name of the SVG file - e.g: `home` */
  name?: string
  /** The size of the SVG file - e.g: `1em` or can be a predefined size: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` */
  size?: MazIconSize
  /** The title of the SVG file - e.g: `Home` */
  title?: string
  /** The function to transform the source of the SVG file - e.g: `(svg) => svg` */
  transformSource?: (svg: SVGElement) => SVGElement
}

const cache: Record<string, Promise<SVGElement>> = {}
const svgElSource = ref<SVGElement>()
const svgElem = ref<SVGElement>()

function getMazIconPath() {
  try {
    return useInjectStrict<string>('mazIconPath')
  }
  catch {
    return undefined
  }
}

const iconPath = computed(() => path ?? getMazIconPath())
const fullSrc = computed(() => {
  if (icon) {
    return undefined
  }
  else if (src) {
    return src
  }
  else if (iconPath.value) {
    return `${iconPath.value}/${name}.svg`
  }
  else {
    return `/${name}.svg`
  }
})

onMounted(() => {
  if ((icon && src) || (icon && name)) {
    console.error('[maz-ui](MazIcon) you should provide "name" or "src" as prop')
  }
  if (!icon && !name && !src) {
    console.error('[maz-ui](MazIcon) you should provide "icon", "name" or "src" as prop')
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
  }, {} as Record<string, unknown>)
}

function getSvgAttrs(svgEl: SVGElement) {
  // copy attrs
  const svgAttrs: Record<string, string> = {}
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
  const svgElNode = transformSource(svgEl)

  if (title) {
    setTitle(svgElNode as SVGElement, title)
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
            svgEl = transformSource(svgEl)
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

const svgStyle = computed<StyleValue | undefined>(() => {
  const isPredefinedSize = size && predefinedSizes.includes(size as PredefinedSize)
  if (isPredefinedSize) {
    return
  }

  return {
    fontSize: size,
  }
})

const svgClasses = computed<string | undefined>(() => {
  const isPredefinedSize = size && predefinedSizes.includes(size as PredefinedSize)
  if (!isPredefinedSize) {
    return
  }

  return `m-icon--${size}`
})

watchEffect(() => {
  if (!fullSrc.value)
    return

  getSource(fullSrc.value)
})
</script>

<template>
  <svg
    v-if="svgElSource"
    ref="svgElem"
    class="m-icon m-reset-css"
    :class="svgClasses"
    width="1em"
    height="1em"
    v-bind="{
      ...getSvgAttrs(svgElSource),
      ...filterAttrs($attrs),
    }"
    :style="svgStyle"
    v-html="getSvgContent(svgElSource)"
  />
  <component :is="icon" v-else class="m-icon m-reset-css" :class="svgClasses" :style="svgStyle" />
</template>

<style lang="postcss" scoped>
.m-icon {
  width: 1em !important;
  height: 1em !important;

  &--xs {
    @apply maz-text-base;
  }

  &--sm {
    @apply maz-text-xl;
  }

  &--md {
    @apply maz-text-2xl;
  }

  &--lg {
    @apply maz-text-4xl;
  }

  &--xl {
    @apply maz-text-5xl;
  }
}
</style>
