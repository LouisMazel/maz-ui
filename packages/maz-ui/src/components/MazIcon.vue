<script lang="ts" setup generic="_T">
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazIconString, MazSizeUnit } from './types.ts'
import { MazQuestionMarkCircle } from '@maz-ui/icons/lazy/MazQuestionMarkCircle'
import { MazIconPrimitive } from '@maz-ui/icons/vue'
import { computed } from 'vue'
import { prepareSvgString } from '../utils/svg-utils.ts'
import { useSvgAccessibility, useSvgSource } from '../utils/useSvgSource.ts'

export type MazIconSize = MazSizeUnit | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type MazIconValue = MazIconString | IconComponent
export type MazIconAnimation = 'ring' | 'spin' | 'lift' | 'nudge' | 'beat' | 'takeoff'

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
  /**
   * Play a small animation that mimes the meaning of the icon on hover (and keyboard focus) of the icon or of its closest
   * interactive parent (button, link...). It works with the icons of the set: `bell`, `bell-alert`, `trash`, `cog`, `cog-6-tooth`,
   * `cog-8-tooth`, `paper-airplane`, `heart` and the arrows (`arrow-right`, `arrow-up`...). Use `animation` for any other icon.
   * Off with reduced motion
   * @default false
   */
  animated?: boolean
  /**
   * The animation to play when `animated` is set. By default it is chosen from the name of the icon
   * @values 'ring', 'spin', 'lift', 'nudge', 'beat', 'takeoff'
   */
  animation?: MazIconAnimation
}

const {
  icon,
  fallback = MazQuestionMarkCircle,
  size,
  title,
  svgAttributes,
  flipIconForRtl = false,
  animated = false,
  animation,
} = defineProps<MazIconProps>()

const emits = defineEmits<{
  /** Emitted when an SVG fails to fetch or parse — useful for telemetry / fallback UI. */
  (event: 'error', error: Error): void
}>()

const NAME_ANIMATIONS: Array<[RegExp, MazIconAnimation]> = [
  [/^bell(-alert)?$/, 'ring'],
  [/^trash$/, 'lift'],
  [/^cog(-\d+-tooth)?$/, 'spin'],
  [/^paper-airplane$/, 'takeoff'],
  [/^arrow(-long|-small)?-(left|right|up|down)$/, 'nudge'],
  [/^heart$/, 'beat'],
]

type PredefinedSize = Exclude<MazIconSize, MazSizeUnit>

const predefinedSizes: readonly PredefinedSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const { rawSvgContent, registeredName, isPendingUrl, componentIcon } = useSvgSource({
  icon: () => icon,
  fallback: () => fallback,
  prepare: svg => prepareSvgString(svg, { title, svgAttributes }),
  watchSources: () => [title, svgAttributes],
  onError: error => emits('error', error),
})

const { ariaHidden, role, ariaLabel, primitiveAttributes } = useSvgAccessibility({
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

const iconName = computed(() => {
  const value = icon as unknown as { name?: string } | string | undefined
  const name = typeof value === 'string' ? value : value?.name

  return name
    ?.replace(/^.*:/, '')
    .replace(/^Maz(?=[A-Z])/, '')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/([a-z])(\d)/g, '$1-$2')
    .toLowerCase()
})

const animationName = computed<MazIconAnimation | undefined>(() => {
  if (!animated)
    return undefined

  return animation ?? NAME_ANIMATIONS.find(([pattern]) => iconName.value && pattern.test(iconName.value))?.[1]
})

const animationAttributes = computed(() => animationName.value
  ? {
      'data-animation': animationName.value,
      'data-direction': animationName.value === 'nudge' ? iconName.value?.match(/(left|up|down)$/)?.[1] ?? 'right' : undefined,
    }
  : undefined)
</script>

<template>
  <span
    v-if="registeredName"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass, animationName && 'm-icon--animated']"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-bind="animationAttributes"
  >
    <MazIconPrimitive :icon="registeredName" :title="title" :svg-attributes="svgAttributes" v-bind="primitiveAttributes" />
  </span>
  <span
    v-else-if="rawSvgContent"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass, animationName && 'm-icon--animated']"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-bind="animationAttributes"
    v-html="rawSvgContent"
  />
  <span
    v-else-if="isPendingUrl"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass, animationName && 'm-icon--animated']"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-bind="animationAttributes"
  />
  <component
    :is="componentIcon"
    v-else-if="componentIcon"
    class="m-icon m-reset-css maz:inline-flex maz:size-[1em] maz:flex-center maz:align-middle"
    :class="[sizeClass, flipClass, animationName && 'm-icon--animated']"
    :style="svgStyle"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :role="role"
    v-bind="animationAttributes"
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

<style scoped>
.m-icon--animated {
  --m-icon-nx: 0;
  --m-icon-ny: 0;

  &[data-animation='ring'] {
    --m-icon-keyframes: m-icon-ring;
    --m-icon-origin: 50% 10%;
  }

  &[data-animation='spin'] {
    --m-icon-keyframes: m-icon-spin;
    --m-icon-duration: 800ms;
  }

  &[data-animation='lift'] {
    --m-icon-keyframes: m-icon-lift;
    --m-icon-origin: 15% 30%;
  }

  &[data-animation='nudge'] {
    --m-icon-keyframes: m-icon-nudge;
    --m-icon-nx: 0.16em;
  }

  &[data-animation='nudge'][data-direction='left'] {
    --m-icon-nx: -0.16em;
  }

  &[data-animation='nudge'][data-direction='up'] {
    --m-icon-nx: 0;
    --m-icon-ny: -0.16em;
  }

  &[data-animation='nudge'][data-direction='down'] {
    --m-icon-nx: 0;
    --m-icon-ny: 0.16em;
  }

  &[data-animation='beat'] {
    --m-icon-keyframes: m-icon-beat;
  }

  &[data-animation='takeoff'] {
    --m-icon-keyframes: m-icon-takeoff;
    --m-icon-duration: 700ms;
  }

  & :deep(svg) {
    transform-origin: var(--m-icon-origin, center);
  }
}

@media (hover: hover) {
  .m-icon--animated:hover :deep(svg),
  :is(a, button, summary, label, [role='button'], [role='menuitem'], [role='tab'], [role='option']):hover
    .m-icon--animated
    :deep(svg) {
    animation: var(--m-icon-keyframes) calc(var(--m-icon-duration, 600ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, ease-in-out) 1;
  }
}

.m-icon--animated:focus-visible :deep(svg),
:is(a, button, summary, label, [role='button'], [role='menuitem'], [role='tab'], [role='option']):focus-visible
  .m-icon--animated
  :deep(svg) {
  animation: var(--m-icon-keyframes) calc(var(--m-icon-duration, 600ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-in-out) 1;
}
</style>

<style>
@keyframes m-icon-ring {
  0%,
  100% {
    transform: rotate(0);
  }

  15% {
    transform: rotate(14deg);
  }

  30% {
    transform: rotate(-12deg);
  }

  45% {
    transform: rotate(9deg);
  }

  60% {
    transform: rotate(-6deg);
  }

  75% {
    transform: rotate(3deg);
  }
}

@keyframes m-icon-spin {
  to {
    transform: rotate(180deg);
  }
}

@keyframes m-icon-lift {
  40% {
    transform: translateY(-0.1em) rotate(-10deg);
  }

  100% {
    transform: none;
  }
}

@keyframes m-icon-nudge {
  35% {
    transform: translate(var(--m-icon-nx), var(--m-icon-ny));
  }

  70% {
    transform: translate(calc(var(--m-icon-nx) * 0.25), calc(var(--m-icon-ny) * 0.25));
  }

  100% {
    transform: none;
  }
}

@keyframes m-icon-beat {
  20% {
    transform: scale(1.22);
  }

  40% {
    transform: scale(1);
  }

  60% {
    transform: scale(1.14);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes m-icon-takeoff {
  40% {
    opacity: 0;
    transform: translate(0.3em, -0.3em);
  }

  41% {
    opacity: 0;
    transform: translate(-0.3em, 0.3em);
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

html.m-motion-reduced .m-icon--animated svg {
  animation: none !important;
}

@media (prefers-reduced-motion: reduce) {
  html:not(.m-motion-full) .m-icon--animated svg {
    animation: none !important;
  }
}
</style>
