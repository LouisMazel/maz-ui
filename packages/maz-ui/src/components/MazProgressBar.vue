<script lang="ts" setup>
import type { MazColor, MazSize } from './types'
import { computed } from 'vue'
import { getColor } from './types'

export interface MazProgressBarSegment {
  /** Value of the segment, on the same scale as `max` */
  value: number
  /**
   * Color of the segment
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   * @default the `color` of the bar
   */
  color?: Exclude<MazColor, 'transparent'>
  /** Name of the segment, read in the accessible description of the bar ("12 patch") */
  label?: string
}

export interface MazProgressBarProps {
  /** Current value, between 0 and `max` (ignored with `segments`) */
  value?: number
  /**
   * Value of a full bar. With `segments` and without `max`, their sum fills the bar
   * @default 100
   */
  max?: number
  /**
   * Stacked segments (a distribution: 12 patch, 5 minor, 2 major) instead of a single value
   */
  segments?: MazProgressBarSegment[]
  /**
   * Color of the bar (and of the segments without their own color)
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   * @default 'primary'
   */
  color?: Exclude<MazColor, 'transparent'>
  /**
   * Thickness of the bar
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'sm'
   */
  size?: MazSize
  /**
   * Size of the rounded of the bar
   * @values `'none' | 'sm' | 'md' | 'full'`
   * @default 'full'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'full'
  /**
   * Leave a small gap between the segments
   * @default false
   */
  gap?: boolean
  /**
   * Semantic of the bar: `progressbar` for the progress of a task, `meter` for a measure in a known range
   * (disk usage, projects up to date)
   * @values `'progressbar' | 'meter'`
   * @default 'progressbar'
   */
  role?: 'progressbar' | 'meter'
  /** Accessible name of the bar */
  label?: string
  /** Accessible text of the value ("3 of 5 projects"), instead of the number */
  valueText?: string
}

const {
  value = 0,
  max,
  segments,
  color = 'primary',
  size = 'sm',
  roundedSize = 'full',
  gap = false,
  role = 'progressbar',
  label,
  valueText,
} = defineProps<MazProgressBarProps>()

const SIZE_CLASS = {
  mini: 'maz:h-0.5',
  xs: 'maz:h-1',
  sm: 'maz:h-1.5',
  md: 'maz:h-2',
  lg: 'maz:h-3',
  xl: 'maz:h-4',
} as const satisfies Record<MazSize, string>

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  full: 'maz:rounded-full',
} as const

function positive(n: number) {
  return Number.isFinite(n) && n > 0
    ? n
    : 0
}

const total = computed(() => max ?? (segments
  ? segments.reduce((sum, segment) => sum + positive(segment.value), 0)
  : 100))

/** The filled parts, in percent of the bar (they grow in proportion, so a `gap` never pushes the last one out) */
const parts = computed(() => {
  const scale = total.value > 0
    ? total.value
    : 1
  const items = segments ?? [
    { value, color },
  ]
  let left = 100
  return items.map((segment) => {
    const width = Math.min((positive(segment.value) / scale) * 100, left)
    left -= width
    return {
      width,
      color: getColor(segment.color ?? color),
    }
  }).filter(part => part.width > 0)
})

const empty = computed(() => 100 - parts.value.reduce((sum, part) => sum + part.width, 0))

const now = computed(() => segments
  ? segments.reduce((sum, segment) => sum + positive(segment.value), 0)
  : Math.min(positive(value), total.value))

const describedText = computed(() => valueText ?? (segments?.some(segment => segment.label)
  ? segments.filter(segment => segment.label).map(segment => `${segment.value} ${segment.label}`).join(', ')
  : undefined))
</script>

<template>
  <div
    class="m-progress-bar m-reset-css maz:flex maz:w-full maz:overflow-hidden maz:bg-foreground/12"
    :class="[SIZE_CLASS[size], ROUNDED_CLASS[roundedSize], { 'maz:gap-0.5': gap }]"
    :role="role"
    :aria-label="label"
    aria-valuemin="0"
    :aria-valuemax="total"
    :aria-valuenow="now"
    :aria-valuetext="describedText"
  >
    <span
      v-for="(part, index) in parts"
      :key="index"
      class="m-progress-bar__part maz:h-full maz:min-w-0 maz:transition-[flex-grow] maz:duration-300 maz:ease-out maz:motion-reduce:transition-none"
      :class="gap && ROUNDED_CLASS[roundedSize]"
      :style="{ flex: `${part.width} 1 0%`, backgroundColor: `var(--maz-${part.color})` }"
    />
    <span v-if="empty > 0.01" class="m-progress-bar__rest maz:min-w-0 maz:transition-[flex-grow] maz:duration-300 maz:ease-out maz:motion-reduce:transition-none" :style="{ flex: `${empty} 1 0%` }" />
  </div>
</template>
