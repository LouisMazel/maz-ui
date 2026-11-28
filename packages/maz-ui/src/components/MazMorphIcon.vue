<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazIconSize } from './MazIcon.vue'
import { computed } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'

export type MazMorphIconName
  = | 'menu-close'
    | 'plus-close'
    | 'plus-minus'
    | 'play-pause'
    | 'eye-eye-slash'
    | 'copy-check'
    | 'sun-moon'
    | 'chevron-down-up'
    | 'sound-mute'

export interface MazMorphIconProps {
  /** The pair of icons: the first one when `active` is `false`, the second one when it is `true`. */
  name: MazMorphIconName
  /**
   * `false` shows the first icon of the pair, `true` the second one.
   * @default false
   */
  active?: boolean
  /** Predefined keyword (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`) or any CSS length. Defaults to `1em`. */
  size?: MazIconSize
  /**
   * Width of the strokes, in the units of the 24x24 viewBox.
   * @default 2
   */
  strokeWidth?: number
}

interface PartState {
  x?: number
  y?: number
  r?: number
  s?: number
  o?: number
  dash?: number
}

interface Part {
  d: string
  a?: PartState
  b: PartState
}

const {
  name,
  active = false,
  size,
  strokeWidth = 2,
} = defineProps<MazMorphIconProps>()

const PAIRS: Record<MazMorphIconName, Part[]> = {
  'menu-close': [
    { d: 'M4 6h16', b: { y: 6, r: 45 } },
    { d: 'M4 12h16', b: { o: 0, s: 0.3 } },
    { d: 'M4 18h16', b: { y: -6, r: -45 } },
  ],
  'plus-close': [
    { d: 'M5 12h14', b: { r: 135 } },
    { d: 'M12 5v14', b: { r: 135 } },
  ],
  'plus-minus': [
    { d: 'M5 12h14', b: {} },
    { d: 'M12 5v14', b: { r: 90, o: 0 } },
  ],
  'play-pause': [
    { d: 'M7 5l12 7-12 7z', b: { o: 0, r: 90, s: 0.4 } },
    { d: 'M9 5v14', a: { o: 0, r: -90, s: 0.4 }, b: {} },
    { d: 'M15 5v14', a: { o: 0, r: 90, s: 0.4 }, b: {} },
  ],
  'eye-eye-slash': [
    {
      d: 'M2.04 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.57 3.01 9.96 7.18.07.21.07.43 0 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.57-3.01-9.96-7.18z',
      b: {},
    },
    { d: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', b: { o: 0 } },
    { d: 'M3 3l18 18', a: { dash: 1 }, b: {} },
  ],
  'copy-check': [
    { d: 'M6 8h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z', b: { o: 0, s: 0.6, r: -15 } },
    { d: 'M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2', b: { o: 0, s: 0.6, r: 15 } },
    { d: 'M5 12.5l5 5L19 7', a: { dash: 1 }, b: {} },
  ],
  'sun-moon': [
    { d: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z', b: { o: 0, s: 0.3, r: 90 } },
    { d: 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1', b: { o: 0, s: 0.4, r: 90 } },
    {
      d: 'M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5 8.5 8.5 0 1 0 20.5 14.7z',
      a: { o: 0, s: 0.3, r: -90 },
      b: {},
    },
  ],
  'chevron-down-up': [
    { d: 'M6 9l6 6 6-6', b: { r: 180 } },
  ],
  'sound-mute': [
    { d: 'M11 5L6 9H3v6h3l5 4V5z', b: {} },
    { d: 'M15.5 9a4.5 4.5 0 0 1 0 6', b: { dash: 1 } },
    { d: 'M18.5 6a8.5 8.5 0 0 1 0 12', b: { dash: 1 } },
    { d: 'M16 9l5 5', a: { dash: 1 }, b: {} },
    { d: 'M21 9l-5 5', a: { dash: 1 }, b: {} },
  ],
}

const MIRRORED_IN_RTL: readonly MazMorphIconName[] = ['play-pause', 'sound-mute']

const PREDEFINED_SIZES: readonly string[] = ['xs', 'sm', 'md', 'lg', 'xl']

const SIZE_CLASS: Record<string, string> = {
  xs: 'maz:text-base',
  sm: 'maz:text-xl',
  md: 'maz:text-2xl',
  lg: 'maz:text-4xl',
  xl: 'maz:text-5xl',
}

const { shouldReduceMotion } = useReducedMotion()

const isPredefinedSize = computed(() => !!size && PREDEFINED_SIZES.includes(size))

const sizeClass = computed(() => (isPredefinedSize.value ? SIZE_CLASS[size as string] : undefined))

const rootStyle = computed<CSSProperties | undefined>(() =>
  size && !isPredefinedSize.value ? { fontSize: size } : undefined,
)

function partStyle(part: Part): CSSProperties {
  const { x = 0, y = 0, r = 0, s = 1, o = 1, dash = 0 } = (active ? part.b : part.a) ?? {}

  return {
    transform: `rotate(${r}deg) translate(${x}px, ${y}px) scale(${s})`,
    opacity: o,
    strokeDashoffset: dash,
  }
}

const parts = computed(() =>
  (PAIRS[name] ?? []).map((part, index) => ({
    key: `${name}-${index}`,
    d: part.d,
    style: partStyle(part),
  })),
)
</script>

<template>
  <svg
    class="m-morph-icon m-reset-css maz:inline-block maz:size-[1em] maz:align-middle"
    :class="[
      sizeClass,
      {
        'm-morph-icon--active': active,
        'm-morph-icon--reduced': shouldReduceMotion,
        'm-morph-icon--rtl-flip': MIRRORED_IN_RTL.includes(name),
      },
    ]"
    :style="rootStyle"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="part in parts"
      :key="part.key"
      class="m-morph-icon__part"
      :d="part.d"
      :style="part.style"
      pathLength="1"
    />
  </svg>
</template>

<style scoped>
.m-morph-icon__part {
  stroke-dasharray: 1;
  transform-origin: 12px 12px;
  transition:
    transform calc(var(--maz-motion-normal) * var(--maz-motion-scale)) var(--maz-easing-spring),
    opacity calc(var(--maz-motion-fast) * var(--maz-motion-scale)) var(--maz-easing-out),
    stroke-dashoffset calc(var(--maz-motion-normal) * var(--maz-motion-scale)) var(--maz-easing-out);
}

.m-morph-icon--reduced .m-morph-icon__part {
  transition: none;
}

[dir='rtl'] .m-morph-icon--rtl-flip {
  transform: scaleX(-1);
}
</style>
