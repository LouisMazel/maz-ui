<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazIconSize } from './MazIcon.vue'
import { computed } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'

export type MazDrawnIconName
  = | 'check'
    | 'x-mark'
    | 'minus'
    | 'check-circle'
    | 'x-circle'
    | 'exclamation-circle'
    | 'information-circle'

export interface MazDrawnIconProps {
  /** Icon to draw: `check`, `x-mark`, `minus`, `check-circle`, `x-circle`, `exclamation-circle` or `information-circle`. */
  name: MazDrawnIconName
  /**
   * `true` draws the icon (also when it appears), `false` hides it.
   * @default true
   */
  drawn?: boolean
  /** Predefined keyword (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`) or any CSS length. Defaults to `1em`. */
  size?: MazIconSize
  /**
   * Width of the strokes, in the units of the 24x24 viewBox.
   * @default 2
   */
  strokeWidth?: number
  /** Duration of the drawing of each stroke, as a CSS time (`'400ms'`). Defaults to the `--maz-motion-normal` token. */
  duration?: string
  /** Delay before the drawing starts, as a CSS time (`'200ms'`). */
  delay?: string
  /** Accessible name. Without it the icon is decorative (`aria-hidden`). */
  label?: string
}

const {
  name,
  drawn = true,
  size,
  strokeWidth = 2,
  duration,
  delay = '0ms',
  label,
} = defineProps<MazDrawnIconProps>()

const CIRCLE = 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'

const PATHS: Record<MazDrawnIconName, string[]> = {
  'check': ['M4.5 12.75l6 6 9-13.5'],
  'x-mark': ['M6 18L18 6', 'M6 6l12 12'],
  'minus': ['M5 12h14'],
  'check-circle': [CIRCLE, 'M8 12.5l2.7 2.7L16 9.5'],
  'x-circle': [CIRCLE, 'M9.5 14.5l5-5', 'M9.5 9.5l5 5'],
  'exclamation-circle': [CIRCLE, 'M12 7.5v5', 'M12 16.25v.01'],
  'information-circle': [CIRCLE, 'M12 7.75v.01', 'M12 11.5v5'],
}

const PREDEFINED_SIZES: readonly string[] = ['xs', 'sm', 'md', 'lg', 'xl']

const SIZE_CLASS: Record<string, string> = {
  xs: 'maz:text-base',
  sm: 'maz:text-xl',
  md: 'maz:text-2xl',
  lg: 'maz:text-4xl',
  xl: 'maz:text-5xl',
}

const { shouldReduceMotion } = useReducedMotion()

const paths = computed(() => PATHS[name] ?? [])

const isPredefinedSize = computed(() => !!size && PREDEFINED_SIZES.includes(size))

const sizeClass = computed(() => (isPredefinedSize.value ? SIZE_CLASS[size as string] : undefined))

const style = computed<CSSProperties>(() => ({
  '--m-drawn-duration': duration ?? 'calc(var(--maz-motion-normal) * var(--maz-motion-scale))',
  '--m-drawn-delay': delay,
  'fontSize': size && !isPredefinedSize.value ? size : undefined,
}) as CSSProperties)
</script>

<template>
  <svg
    class="m-drawn-icon m-reset-css maz:inline-block maz:size-[1em] maz:align-middle"
    :class="[sizeClass, { 'm-drawn-icon--drawn': drawn, 'm-drawn-icon--reduced': shouldReduceMotion }]"
    :style="style"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="label ? undefined : 'true'"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    focusable="false"
  >
    <path
      v-for="(d, index) in paths"
      :key="`${name}-${index}`"
      class="m-drawn-icon__path"
      :style="{ '--m-drawn-index': index }"
      :d="d"
      pathLength="1"
    />
  </svg>
</template>

<style scoped>
.m-drawn-icon__path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.m-drawn-icon--drawn .m-drawn-icon__path {
  animation: m-drawn-icon-draw var(--m-drawn-duration) var(--maz-easing-out) both;
  animation-delay: calc(var(--m-drawn-delay) + var(--m-drawn-index) * var(--m-drawn-duration) * 0.75);
}

.m-drawn-icon--reduced .m-drawn-icon__path,
.m-drawn-icon--reduced.m-drawn-icon--drawn .m-drawn-icon__path {
  animation: none;
}

.m-drawn-icon--reduced.m-drawn-icon--drawn .m-drawn-icon__path {
  stroke-dashoffset: 0;
}

@keyframes m-drawn-icon-draw {
  from {
    stroke-dashoffset: 1;
  }

  to {
    stroke-dashoffset: 0;
  }
}
</style>
