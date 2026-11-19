<script lang="ts" setup generic="_T">
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazIconString, MazSizeUnit } from './types.ts'
import { MazQuestionMarkCircle } from '@maz-ui/icons/lazy/MazQuestionMarkCircle'
import { computed } from 'vue'
import { prepareSvgString } from '../utils/svg-utils.ts'
import { useSvgAccessibility, useSvgSource } from '../utils/useSvgSource.ts'

export type MazIconSize = MazSizeUnit | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type MazIconValue = MazIconString | IconComponent

export interface MazIconProps {
  /**
   * The icon to render. Accepts:
   * - An icon name (`'x-mark'`, `'app:logo'`), registered by `MazUi()` of `@maz-ui/vite-plugin` or `@maz-ui/nuxt`
   * - A Vue component (e.g. `import { MazStar } from '@maz-ui/icons/static/MazStar'`)
   * - A URL or `data:` URI to a `.svg` file (`'/icons/star.svg'`, `'data:image/svg+xml,…'`)
   * - A raw SVG string (`'<svg viewBox="0 0 24 24">…</svg>'`)
   *
   * The component detects the format and renders accordingly.
   */
  icon?: MazIconValue
  /**
   * Fallback icon used when:
   * - `icon` is not provided
   * - `icon` is an unknown name, or a URL that fails to load or returns invalid SVG
   *
   * Same shape as `icon`. Defaults to the imported `MazQuestionMarkCircle` if
   * neither `icon` nor `fallback` resolves to anything renderable.
   */
  fallback?: MazIconValue
  /** Predefined keyword (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`) or any CSS length. */
  size?: MazIconSize
  /** Sets a `<title>` element inside the SVG for screen-reader accessibility. */
  title?: string
  /** Extra attributes to merge onto the rendered `<svg>` root. */
  svgAttributes?: Record<string, string | number>
  /**
   * Mirror the icon horizontally when the document direction is RTL. Useful
   * for directional icons (chevrons, arrows). Renders unchanged in LTR.
   * @default false
   */
  flipIconForRtl?: boolean
}

const {
  icon,
  fallback = MazQuestionMarkCircle,
  size,
  title,
  svgAttributes,
  flipIconForRtl = false,
} = defineProps<MazIconProps>()

const emits = defineEmits<{
  /** Emitted when an SVG fails to fetch or parse — useful for telemetry / fallback UI. */
  (event: 'error', error: Error): void
}>()

type PredefinedSize = Exclude<MazIconSize, MazSizeUnit>

const predefinedSizes: readonly PredefinedSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const { rawSvgContent, isPendingUrl, componentIcon } = useSvgSource({
  icon: () => icon,
  fallback: () => fallback,
  prepare: svg => prepareSvgString(svg, { title, svgAttributes }),
  watchSources: () => [title, svgAttributes],
  onError: error => emits('error', error),
})

const { ariaHidden, role, ariaLabel } = useSvgAccessibility({
  title: () => title,
  svgAttributes: () => svgAttributes,
})

const svgStyle = computed<CSSProperties | undefined>(() => {
  const isPredefined = size && predefinedSizes.includes(size as PredefinedSize)
  if (!size || isPredefined)
    return undefined
  return { fontSize: size }
})

const SIZE_CLASS = {
  xs: 'maz:text-base',
  sm: 'maz:text-xl',
  md: 'maz:text-2xl',
  lg: 'maz:text-4xl',
  xl: 'maz:text-5xl',
} as const

const sizeClass = computed<string | undefined>(() => {
  const isPredefined = size && predefinedSizes.includes(size as PredefinedSize)
  return isPredefined
    ? `m-icon--${size} ${SIZE_CLASS[size as PredefinedSize]}`
    : undefined
})

const flipClass = computed(() => (flipIconForRtl ? 'm-icon--flip-for-rtl' : undefined))
</script>

<template>
  <span
    v-if="rawSvgContent"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-html="rawSvgContent"
  />
  <span
    v-else-if="isPendingUrl"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
  />
  <component
    :is="componentIcon"
    v-else-if="componentIcon"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass]"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
  />
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-icon {
  &,
  &:deep(> svg) {
    @apply maz:size-[1em];
  }

  &.m-icon--flip-for-rtl {
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }
}
</style>
