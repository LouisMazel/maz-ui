<script lang="ts" setup>
import type { MazColor, MazColorOrFree } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { resolveColor } from '../utils/freeColor.ts'
import { observeIntersection } from '../utils/reveal.ts'
import { getSparklineAreaPath, getSparklinePadding, getSparklinePath, getSparklinePoints, getSparklineTrend } from '../utils/sparkline.ts'

export interface MazSparklineProps {
  /**
   * The values of the trend, from the oldest to the newest
   */
  data: number[]
  /**
   * Width of the chart in pixels (the aspect ratio is kept, the line is never stretched)
   * @default 64
   */
  width?: number
  /**
   * Height of the chart in pixels
   * @default 20
   */
  height?: number
  /**
   * Color of the line: a theme color or a free CSS color (`#e11d48`, `oklch(...)`, `var(--brand)`). `currentColor` follows the text
   * @default 'primary'
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>> | 'currentColor'
  /**
   * Fill the area under the line
   * @default false
   */
  fill?: boolean
  /**
   * Draw a smooth curve that never overshoots the data. When `false`, the points are linked by straight segments
   * @default true
   */
  smooth?: boolean
  /**
   * Width of the line in pixels
   * @default 1.5
   */
  strokeWidth?: number
  /**
   * Draw the line when the chart enters the screen, then pop the last point. Off with the reduced motion
   * @default true
   */
  animated?: boolean
  /**
   * Accessible summary of the chart. By default: the trend, the minimum, the maximum and the last value
   */
  label?: string
  /**
   * Any BCP 47 locale used to format the numbers of the summary. Falls back to the locale of `@maz-ui/translations`
   * when its plugin is installed, then to the locale of the browser
   */
  locale?: string
  /**
   * Options of `Intl.NumberFormat` used to format the numbers of the summary
   */
  format?: Intl.NumberFormatOptions
}

const {
  data,
  width = 64,
  height = 20,
  color = 'primary',
  fill = false,
  smooth = true,
  strokeWidth = 1.5,
  animated = true,
  label = undefined,
  locale = undefined,
  format = undefined,
} = defineProps<MazSparklineProps>()

const { t, locale: translationsLocale } = useTranslations()

const { shouldReduceMotion } = useReducedMotion()

const rootRef = useTemplateRef<SVGSVGElement>('rootRef')
const isArmed = ref(false)
const isDrawn = ref(false)

let stopObserver: (() => void) | undefined

const points = computed(() => getSparklinePoints(data, width, height, getSparklinePadding(strokeWidth)))
const linePath = computed(() => getSparklinePath(points.value, smooth))
const areaPath = computed(() => fill ? getSparklineAreaPath(linePath.value, points.value, height) : '')
const lastPoint = computed(() => points.value.at(-1))

const strokeColor = computed(() => {
  if (color === 'currentColor')
    return 'currentColor'

  return resolveColor(color === 'neutral' ? 'neutral-foreground' : color)
})

const summary = computed(() => {
  if (label)
    return label

  if (points.value.length === 0)
    return ''

  const values = points.value.map(point => point.value)
  const formatter = new Intl.NumberFormat(locale || translationsLocale.value || undefined, format)
  const trend = getSparklineTrend(values)
  const trendText = {
    up: t('sparkline.up'),
    down: t('sparkline.down'),
    flat: t('sparkline.flat'),
  }[trend]

  return t('sparkline.label', {
    trend: trendText,
    min: formatter.format(Math.min(...values)),
    max: formatter.format(Math.max(...values)),
    last: formatter.format(values.at(-1)!),
  })
})

onMounted(() => {
  if (!animated || shouldReduceMotion.value || !rootRef.value)
    return

  isArmed.value = true

  stopObserver = observeIntersection(rootRef.value, (entry) => {
    if (!entry.isIntersecting)
      return

    isDrawn.value = true
    stopObserver?.()
  })
})

onBeforeUnmount(() => stopObserver?.())
</script>

<template>
  <svg
    ref="rootRef"
    class="m-sparkline m-reset-css maz:inline-block maz:shrink-0 maz:overflow-visible maz:align-middle"
    :class="{ 'm-sparkline--armed': isArmed, 'm-sparkline--drawn': isDrawn }"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    :style="{ color: strokeColor }"
    :role="summary ? 'img' : undefined"
    :aria-label="summary || undefined"
    :aria-hidden="summary ? undefined : true"
    focusable="false"
  >
    <path v-if="areaPath" class="m-sparkline__area" :d="areaPath" fill="currentColor" stroke="none" />
    <path
      v-if="points.length > 1"
      class="m-sparkline__line"
      :d="linePath"
      pathLength="1"
      fill="none"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      v-if="lastPoint"
      class="m-sparkline__dot"
      :cx="lastPoint.x"
      :cy="lastPoint.y"
      :r="strokeWidth * 1.6"
      fill="currentColor"
    />
  </svg>
</template>

<style scoped>
.m-sparkline__area {
  fill-opacity: 0.14;
}

.m-sparkline__line {
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}

.m-sparkline__dot {
  transform-box: fill-box;
  transform-origin: center;
}

.m-sparkline--armed .m-sparkline__line {
  stroke-dashoffset: 1;
  opacity: 0;
}

.m-sparkline--armed .m-sparkline__area {
  opacity: 0;
}

.m-sparkline--armed .m-sparkline__dot {
  transform: scale(0);
}

.m-sparkline--drawn .m-sparkline__line {
  stroke-dashoffset: 0;
  opacity: 1;
  transition:
    stroke-dashoffset calc(var(--maz-motion-slower, 500ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1)) linear;
}

.m-sparkline--drawn .m-sparkline__area {
  opacity: 1;
  transition: opacity calc(var(--maz-motion-slower, 500ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-sparkline--drawn .m-sparkline__dot {
  transform: scale(1);
  transition: transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-bounce, cubic-bezier(0.34, 1.56, 0.64, 1))
    calc(var(--maz-motion-slower, 500ms) * 0.8 * var(--maz-motion-scale, 1));
}
</style>
