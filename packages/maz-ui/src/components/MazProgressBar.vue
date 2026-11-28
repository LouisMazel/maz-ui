<script lang="ts" setup>
import type { MazColor, MazColorOrFree, MazSize } from './types.ts'
import { computed, defineAsyncComponent } from 'vue'
import { resolveColor } from '../utils/freeColor.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazRollingText from './MazRollingText.vue'

export interface MazProgressBarSegment {
  /** Value of the segment, on the same scale as `max` */
  value: number
  /**
   * Color of the segment: a theme color or a free CSS color (`#e11d48`, `oklch(...)`, `var(--brand)`)
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   * @default the `color` of the bar
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>>
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
   * Color of the bar (and of the segments without their own color): a theme color or a free CSS color
   * (`#e11d48`, `oklch(...)`, `var(--brand)`)
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   * @default 'primary'
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>>
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
  /**
   * The progress is unknown: a segment slides along the bar (`progressbar` role only)
   * @default false
   */
  indeterminate?: boolean
  /**
   * Shows the percentage after the bar, its digits roll when it changes
   * @default false
   */
  showValue?: boolean
  /**
   * Draws a check after the bar once it is full
   * @default false
   */
  check?: boolean
  /**
   * The percentage rolls, the check draws itself and the parts grow smoothly
   * @default true
   */
  animated?: boolean
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
  indeterminate = false,
  showValue = false,
  check = false,
  animated = true,
} = defineProps<MazProgressBarProps>()

const MazDrawnIcon = defineAsyncComponent(() => import('./MazDrawnIcon.vue'))

const SIZE_CLASS = {
  mini: 'maz:h-0.5',
  xs: 'maz:h-1',
  sm: 'maz:h-1.5',
  md: 'maz:h-2',
  lg: 'maz:h-3',
  xl: 'maz:h-4',
} as const satisfies Record<MazSize, string>

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

function accentColor(color: string) {
  return color === 'neutral' ? 'neutral-foreground' : color
}

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
      color: resolveColor(accentColor(segment.color ?? color)),
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

const ratio = computed(() => total.value > 0 ? now.value / total.value : 0)
const isComplete = computed(() => !indeterminate && total.value > 0 && now.value >= total.value)
const hasAside = computed(() => !indeterminate && (showValue || check))
const indeterminateColor = computed(() => resolveColor(accentColor(color)))

const barClass = computed(() => [
  SIZE_CLASS[size],
  ROUNDED_CLASS[roundedSize],
  {
    'maz:gap-0.5': gap,
    '--indeterminate': indeterminate,
    '--static': !animated,
  },
])

const barAttrs = computed(() => ({
  'role': role,
  'aria-label': label,
  'aria-valuemin': 0,
  'aria-valuemax': total.value,
  'aria-valuenow': indeterminate ? undefined : now.value,
  'aria-valuetext': describedText.value,
}))
</script>

<template>
  <div v-if="hasAside" class="m-progress-bar-field m-reset-css maz:flex maz:w-full maz:items-center maz:gap-2">
    <div
      class="m-progress-bar maz:flex maz:min-w-0 maz:flex-1 maz:overflow-hidden maz:bg-foreground/12"
      :class="barClass"
      v-bind="barAttrs"
    >
      <span
        v-for="(part, index) in parts"
        :key="index"
        class="m-progress-bar__part maz:duration-slow maz:h-full maz:min-w-0 maz:transition-[flex-grow] maz:ease-out maz:motion-reduce:transition-none"
        :class="gap && ROUNDED_CLASS[roundedSize]"
        :style="{ flex: `${part.width} 1 0%`, backgroundColor: part.color }"
      />
      <span v-if="empty > 0.01" class="m-progress-bar__rest maz:duration-slow maz:min-w-0 maz:transition-[flex-grow] maz:ease-out maz:motion-reduce:transition-none" :style="{ flex: `${empty} 1 0%` }" />
    </div>
    <span class="m-progress-bar__aside maz:inline-flex maz:shrink-0 maz:justify-end maz:text-sm maz:text-muted" :class="{ 'maz:min-w-[3ch]': showValue }" aria-hidden="true">
      <MazDrawnIcon v-if="check && isComplete" name="check" :duration="animated ? undefined : '0s'" class="maz:text-success" />
      <MazRollingText v-else-if="showValue" :value="ratio" :format="{ style: 'percent', maximumFractionDigits: 0 }" :animated />
    </span>
  </div>
  <div
    v-else
    class="m-progress-bar m-reset-css maz:flex maz:w-full maz:overflow-hidden maz:bg-foreground/12"
    :class="[barClass, { 'maz:relative': indeterminate }]"
    v-bind="barAttrs"
  >
    <span
      v-if="indeterminate"
      class="m-progress-bar__indeterminate maz:h-full maz:w-2/5"
      :style="{ backgroundColor: indeterminateColor }"
    />
    <template v-else>
      <span
        v-for="(part, index) in parts"
        :key="index"
        class="m-progress-bar__part maz:duration-slow maz:h-full maz:min-w-0 maz:transition-[flex-grow] maz:ease-out maz:motion-reduce:transition-none"
        :class="gap && ROUNDED_CLASS[roundedSize]"
        :style="{ flex: `${part.width} 1 0%`, backgroundColor: part.color }"
      />
      <span v-if="empty > 0.01" class="m-progress-bar__rest maz:duration-slow maz:min-w-0 maz:transition-[flex-grow] maz:ease-out maz:motion-reduce:transition-none" :style="{ flex: `${empty} 1 0%` }" />
    </template>
  </div>
</template>

<style scoped>
.m-progress-bar__indeterminate {
  --m-progress-dir: 1;

  animation: m-progress-bar-slide calc(var(--maz-motion-slower, 450ms) * 3 * var(--maz-motion-scale, 1))
    var(--maz-easing-in-out, ease-in-out) infinite;
  border-radius: inherit;
}

[dir='rtl'] .m-progress-bar__indeterminate {
  --m-progress-dir: -1;
}

.m-progress-bar.--static .m-progress-bar__indeterminate {
  animation: none;
}

@keyframes m-progress-bar-slide {
  from {
    transform: translateX(calc(var(--m-progress-dir) * -100%));
  }

  to {
    transform: translateX(calc(var(--m-progress-dir) * 250%));
  }
}
</style>
