<script lang="ts" setup>
import type { MazColor, MazColorOrFree } from './types.ts'
import { MazArrowDown } from '@maz-ui/icons/lazy/MazArrowDown'
import { MazArrowUp } from '@maz-ui/icons/lazy/MazArrowUp'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import { resolveColor } from '../utils/freeColor.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { getSparklinePadding, getSparklinePoints } from '../utils/sparkline.ts'
import MazCard from './MazCard.vue'
import MazIcon from './MazIcon.vue'
import MazRollingText from './MazRollingText.vue'
import MazSparkline from './MazSparkline.vue'

export interface MazStatCardProps {
  /**
   * What the number measures (`Revenue`, `Active users`)
   */
  label: string
  /**
   * The key figure. It rolls when it changes
   */
  value: number
  /**
   * Options of `Intl.NumberFormat` used to format `value` and the points of the chart (`{ style: 'currency', currency: 'EUR' }`)
   */
  format?: Intl.NumberFormatOptions
  /**
   * Any BCP 47 locale. Falls back to the locale of `@maz-ui/translations` when its plugin is installed, then to the locale of the browser
   */
  locale?: string
  /**
   * The variation in percent (`12` shows `+12 %`, `-3.5` shows `-3,5 %`), colored and with an arrow
   */
  delta?: number
  /**
   * The text after the variation (`vs last month`)
   */
  deltaLabel?: string
  /**
   * Lower is better (churn, errors, load time): a decrease is green and an increase is red
   * @default false
   */
  inverse?: boolean
  /**
   * The values of the trend drawn in the background, from the oldest to the newest. A marker follows the pointer along it
   */
  data?: number[]
  /**
   * The name of each point of `data` (`Mon`, `Tue`...), shown with the value in the marker
   */
  labels?: string[]
  /**
   * Color of the chart: a theme color or a free CSS color
   * @default 'primary'
   */
  color?: MazColorOrFree<Exclude<MazColor, 'transparent'>>
  /**
   * Draw a smooth curve. When `false`, the points are linked by straight segments
   * @default true
   */
  smooth?: boolean
}

const {
  label,
  value,
  format = undefined,
  locale = undefined,
  delta = undefined,
  deltaLabel = undefined,
  inverse = false,
  data = undefined,
  labels = undefined,
  color = 'primary',
  smooth = true,
} = defineProps<MazStatCardProps>()

defineSlots<{
  /**
   * Replaces the label
   */
  label?: () => unknown
  /**
   * Content under the figure, before the chart
   */
  default?: () => unknown
}>()

const { t, locale: translationsLocale } = useTranslations()

const DEFAULT_WIDTH = 240
const DEFAULT_HEIGHT = 72
const CHART_STROKE = 2

const chartRef = useTemplateRef<HTMLElement>('chartRef')
const size = ref({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT })
const activeIndex = ref(-1)

const resolvedLocale = computed(() => locale || translationsLocale.value || undefined)
const numberFormatter = computed(() => new Intl.NumberFormat(resolvedLocale.value, format))

const deltaText = computed(() => delta === undefined
  ? ''
  : new Intl.NumberFormat(resolvedLocale.value, { style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 }).format(delta / 100))

const deltaTone = computed(() => {
  if (!delta)
    return 'neutral'

  return (delta > 0) !== inverse
    ? 'good'
    : 'bad'
})

const hasChart = computed(() => !!data && data.filter(Number.isFinite).length > 1)
const points = computed(() => data ? getSparklinePoints(data, size.value.width, size.value.height, getSparklinePadding(CHART_STROKE)) : [])
const activePoint = computed(() => points.value[activeIndex.value])
const accent = computed(() => resolveColor(color === 'neutral' ? 'neutral-foreground' : color))

const markerAlign = computed(() => {
  const x = activePoint.value?.x ?? 0

  if (x < size.value.width * 0.22)
    return 'start'

  return x > size.value.width * 0.78
    ? 'end'
    : 'center'
})

const markerStyle = computed(() => activePoint.value
  ? { transform: `translate(${activePoint.value.x}px, ${activePoint.value.y}px)` }
  : undefined)

const markerText = computed(() => {
  if (!activePoint.value)
    return ''

  const text = numberFormatter.value.format(activePoint.value.value)
  const name = labels?.[activeIndex.value]

  return name
    ? `${name}: ${text}`
    : text
})

const sliderValue = computed(() => activeIndex.value === -1
  ? points.value.length - 1
  : activeIndex.value)

const sliderText = computed(() => {
  const point = points.value[sliderValue.value]

  if (!point)
    return ''

  const text = numberFormatter.value.format(point.value)
  const name = labels?.[sliderValue.value]

  return name
    ? `${name}: ${text}`
    : text
})

function measure() {
  const element = chartRef.value

  if (!element)
    return

  const { width, height } = element.getBoundingClientRect()

  if (width > 0 && height > 0)
    size.value = { width: Math.round(width), height: Math.round(height) }
}

onMounted(measure)
useResizeObserver(chartRef, measure)

function setNearest(clientX: number) {
  const element = chartRef.value

  if (!element || points.value.length === 0)
    return

  const x = clientX - element.getBoundingClientRect().left
  let nearest = 0
  let best = Number.POSITIVE_INFINITY

  for (const [index, point] of points.value.entries()) {
    const distance = Math.abs(point.x - x)

    if (distance < best) {
      best = distance
      nearest = index
    }
  }

  activeIndex.value = nearest
}

function onPointerMove(event: PointerEvent) {
  setNearest(event.clientX)
}

function onPointerLeave() {
  if (document.activeElement !== chartRef.value)
    activeIndex.value = -1
}

function onFocus() {
  if (activeIndex.value === -1)
    activeIndex.value = points.value.length - 1
}

function onBlur() {
  activeIndex.value = -1
}

function onKeydown(event: KeyboardEvent) {
  const last = points.value.length - 1
  const current = activeIndex.value === -1 ? last : activeIndex.value
  const next = {
    ArrowRight: Math.min(current + 1, last),
    ArrowLeft: Math.max(current - 1, 0),
    Home: 0,
    End: last,
  }[event.key]

  if (event.key === 'Escape') {
    activeIndex.value = -1
    return
  }

  if (next === undefined)
    return

  event.preventDefault()
  activeIndex.value = next
}
</script>

<template>
  <MazCard
    class="m-stat-card"
    :padding="false"
    overflow-hidden
    :scale="false"
    role="group"
    :aria-label="label"
  >
    <div class="m-stat-card__body maz:relative maz:flex maz:flex-col" :class="{ 'm-stat-card__body--chart': hasChart }" :style="{ '--m-stat-card-color': accent }">
      <div class="m-stat-card__content maz:relative maz:z-1 maz:flex maz:flex-col maz:gap-1 maz:p-4">
        <p class="m-stat-card__label maz:text-sm maz:font-medium maz:text-muted">
          <!-- @slot label - Replaces the label -->
          <slot name="label">
            {{ label }}
          </slot>
        </p>

        <p class="m-stat-card__value maz:text-3xl maz:font-bold maz:text-foreground maz:tabular-nums">
          <MazRollingText :value="value" :format="format" :locale="locale" />
        </p>

        <p v-if="deltaText" class="m-stat-card__delta maz:flex maz:flex-wrap maz:items-center maz:gap-x-1 maz:text-sm">
          <span class="m-stat-card__trend maz:inline-flex maz:items-center maz:gap-0.5 maz:font-semibold" :class="`m-stat-card__trend--${deltaTone}`">
            <MazIcon v-if="delta" :icon="delta > 0 ? MazArrowUp : MazArrowDown" aria-hidden="true" />
            <bdi>{{ deltaText }}</bdi>
          </span>
          <span v-if="deltaLabel" class="maz:text-muted">{{ deltaLabel }}</span>
        </p>

        <!-- @slot default - Content under the figure -->
        <slot v-if="hasSlotContent($slots.default)" />
      </div>

      <div
        v-if="hasChart"
        ref="chartRef"
        class="m-stat-card__chart maz:relative maz:focus-ring"
        role="slider"
        tabindex="0"
        :aria-label="t('statCard.chart', { label })"
        aria-valuemin="0"
        :aria-valuemax="points.length - 1"
        :aria-valuenow="sliderValue"
        :aria-valuetext="sliderText"
        @pointermove="onPointerMove"
        @pointerdown="onPointerMove"
        @pointerleave="onPointerLeave"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      >
        <MazSparkline
          class="m-stat-card__sparkline maz:absolute maz:inset-0"
          :data="data!"
          :width="size.width"
          :height="size.height"
          :color="color"
          :smooth="smooth"
          :stroke-width="CHART_STROKE"
          :locale="resolvedLocale"
          :format="format"
          fill
          aria-hidden="true"
        />

        <div
          class="m-stat-card__marker"
          :class="{ 'm-stat-card__marker--visible': !!activePoint }"
          :style="markerStyle"
          aria-hidden="true"
        >
          <span class="m-stat-card__marker-line" :style="{ height: `${size.height}px` }" />
          <span class="m-stat-card__marker-dot" />
          <span class="m-stat-card__marker-bubble" :class="`m-stat-card__marker-bubble--${markerAlign}`">{{ markerText }}</span>
        </div>
      </div>
    </div>
  </MazCard>
</template>

<style scoped>
.m-stat-card {
  min-inline-size: 11rem;
}

.m-stat-card__body {
  inline-size: 100%;
}

.m-stat-card__trend--good {
  color: color-mix(in srgb, var(--maz-success) 70%, var(--maz-foreground));
}

.m-stat-card__trend--bad {
  color: color-mix(in srgb, var(--maz-destructive) 85%, var(--maz-foreground));
}

.m-stat-card__trend--neutral {
  color: var(--maz-muted);
}

.m-stat-card__chart {
  block-size: 4.5rem;
  margin-block-start: -0.5rem;
  direction: ltr;
  touch-action: pan-y;
  cursor: crosshair;
}

.m-stat-card__marker {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  opacity: 0;
  pointer-events: none;
  transition:
    transform calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-stat-card__marker--visible {
  opacity: 1;
}

.m-stat-card__marker-line {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 1px;
  translate: -0.5px 0;
  background: color-mix(in srgb, var(--m-stat-card-color) 40%, transparent);
  transform-origin: top;
}

.m-stat-card__marker-dot {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  translate: -50% -50%;
  background: var(--maz-container-bg, var(--maz-surface));
  border: 2px solid var(--m-stat-card-color);
  border-radius: 9999px;
}

.m-stat-card__marker-bubble {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  padding-block: 0.125rem;
  padding-inline: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: var(--maz-contrast-foreground);
  white-space: nowrap;
  background: var(--maz-contrast);
  border-radius: 0.375rem;
}

.m-stat-card__marker-bubble--center {
  translate: -50% calc(-100% - 0.625rem);
}

.m-stat-card__marker-bubble--start {
  translate: -0.5rem calc(-100% - 0.625rem);
}

.m-stat-card__marker-bubble--end {
  translate: calc(-100% + 0.5rem) calc(-100% - 0.625rem);
}
</style>
