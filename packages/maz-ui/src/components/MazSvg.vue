<script lang="ts" setup generic="_T">
import type { MazIconValue } from './MazIcon.vue'
import { computed } from 'vue'
import { prepareSvgString } from '../utils/svg-utils.ts'
import { useSvgAccessibility, useSvgSource } from '../utils/useSvgSource.ts'

export interface MazSvgProps {
  /**
   * The SVG to render, in the formats of MazIcon:
   * - A name (`'flag-fr'`, `'logo-vue'`, `'app:hero'`), registered by `MazUi()` of `@maz-ui/vite-plugin` or `@maz-ui/nuxt`
   * - A Vue component, a URL, a `data:` URI or a raw SVG string
   *
   * Unlike MazIcon, it keeps the size and the colors of the SVG.
   */
  icon?: MazIconValue
  /** Rendered when `icon` is not provided or fails to load, same formats as `icon` */
  fallback?: MazIconValue
  /** Width of the SVG (`200`, `'12rem'`). By default, the width of the SVG */
  width?: string | number
  /** Height of the SVG. By default, computed from the width and the ratio of the SVG */
  height?: string | number
  /** Sets a `<title>` element inside the SVG for screen-reader accessibility. */
  title?: string
  /** Extra attributes to merge onto the rendered `<svg>` root. */
  svgAttributes?: Record<string, string | number>
}

const {
  icon,
  fallback,
  width,
  height,
  title,
  svgAttributes,
} = defineProps<MazSvgProps>()

const emits = defineEmits<{
  /** Emitted when the SVG fails to load: an unknown name, or a URL that fails or returns invalid SVG */
  (event: 'error', error: Error): void
}>()

const dimensions = computed(() => (width === undefined && height === undefined
  ? false
  : { width, height }))

const { rawSvgContent, isPendingUrl, componentIcon } = useSvgSource({
  icon: () => icon,
  fallback: () => fallback,
  prepare: svg => prepareSvgString(svg, { title, svgAttributes, dimensions: dimensions.value }),
  watchSources: () => [title, svgAttributes, width, height],
  onError: error => emits('error', error),
})

const { ariaHidden, role, ariaLabel } = useSvgAccessibility({
  title: () => title,
  svgAttributes: () => svgAttributes,
})

const fluidClass = computed(() => (height === undefined
  ? 'm-svg--fluid'
  : undefined))
</script>

<template>
  <span
    v-if="rawSvgContent"
    class="m-svg m-reset-css maz:inline-block maz:max-w-full maz:align-middle"
    :class="fluidClass"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-html="rawSvgContent"
  />
  <span
    v-else-if="isPendingUrl"
    class="m-svg m-reset-css maz:inline-block maz:max-w-full maz:align-middle"
    :class="fluidClass"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
  />
  <component
    :is="componentIcon"
    v-else-if="componentIcon"
    class="m-svg m-reset-css maz:inline-block maz:max-w-full maz:align-middle"
    :class="fluidClass"
    :width="width"
    :height="height"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
  />
</template>

<style scoped>
.m-svg {
  &:deep(> svg) {
    display: block;
    max-inline-size: 100%;
  }

  &.m-svg--fluid {
    &,
    &:deep(> svg) {
      block-size: auto;
    }
  }
}
</style>
