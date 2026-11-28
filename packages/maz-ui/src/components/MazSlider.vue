<script lang="ts" setup>
import type { CSSProperties, StyleValue } from 'vue'
import type { MazColor, MazSizeUnit } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { debounce } from '@maz-ui/utils/helpers/debounce'

import {
  computed,

  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { getOpacityCoeff, getPos, isBetween } from './MazSlider/utils.ts'

export interface MazSliderProps {
  /** Array of cursors values */
  modelValue: number | number[] | undefined | null
  /** array of cursors label */
  labels?: string[]
  /** min value of sliders */
  min?: number
  /** max value of sliders */
  max?: number
  /** step value for slider increments */
  step?: number
  /** height size of slider bar */
  size?: MazSizeUnit
  /** remove div in different colors */
  divider?: boolean
  /** become a logarithmic slider (exponential) */
  log?: boolean
  /** main slider color */
  color?: MazColor
  /** disables cursor animation when active */
  cursorAnim?: boolean
  /** show a tick at each step, they darken as the fill passes them (ignored with `log`) */
  ticks?: boolean
  /**
   * Animate the value bubble, the ticks and the press of the cursor
   * @default true
   */
  animated?: boolean
}

const {
  modelValue,
  labels,
  min = 0,
  max = 100,
  step = 1,
  color = 'primary',
  divider = true,
  log = false,
  cursorAnim = true,
  ticks = false,
  animated = true,
} = defineProps<MazSliderProps>()

const emits = defineEmits(['update:model-value'])

const { t } = useTranslations()

const MazSlider = ref<HTMLDivElement>()

const activeCursor = ref<number>()
const buttonPositions = ref<number[]>()
const tmpValues = ref<number[]>()

const buttonStyles = ref<CSSProperties[]>([])
const dividers = ref<CSSProperties[]>([])
const isRtl = ref(false)

// COMPUTED

const computedValue = computed<number[]>(() => {
  if (typeof modelValue === 'number') {
    return [modelValue]
  }
  else if (modelValue) {
    return modelValue
  }
  else {
    return [0]
  }
})
const minLog = computed(() => {
  return Math.log(min || 1)
})
const maxLog = computed(() => {
  return Math.log(max)
})
const scale = computed(() => {
  return (maxLog.value - minLog.value) / (max - min)
})
const range = computed(() => {
  return max - min
})
const wrapperStyle = computed(() => {
  return {
    paddingTop: labels
      ? `2.5em`
      : `1em`,
  }
})
const sliderStyle = computed<StyleValue>(() => {
  if (color === 'transparent')
    return {}
  return { '--m-slider-color': color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})` }
})
const hasMultipleValues = computed(() => Array.isArray(modelValue))

const MAX_TICKS = 101

const tickList = computed(() => {
  const count = Math.floor((max - min) / step)

  if (!ticks || log || !Number.isFinite(count) || count < 1 || count + 1 > MAX_TICKS)
    return []

  const values = tmpValues.value ?? computedValue.value
  const low = values.length > 1 ? Math.min(...values) : min
  const high = Math.max(...values)

  return Array.from({ length: count + 1 }, (_, index) => {
    const value = min + index * step

    return {
      key: index,
      style: { insetInlineStart: `${(index * step / (max - min)) * 100}%` } satisfies CSSProperties,
      passed: value >= low && value <= high,
    }
  })
})

function readDirection() {
  isRtl.value = MazSlider.value ? globalThis.getComputedStyle(MazSlider.value).direction === 'rtl' : false
}

watch(
  () => modelValue,
  () => (tmpValues.value = computedValue.value),
  { immediate: true },
)
watch(
  () => [computedValue.value, min, max, log].join(','),
  () => buildComponent(true),
)

const resizeListenerFunction = debounce(() => buildComponent(), 300)

onMounted(() => {
  buildComponent(true)

  window.addEventListener('resize', resizeListenerFunction)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeListenerFunction)
})

async function buildComponent(emitValue?: boolean) {
  readDirection()
  if (emitValue === true)
    checkValues()
  await calcPos()
  await nextTick()

  for (const [index] of computedValue.value.entries()) {
    setBtnDividers(index)
  }
}

function decimalsOf(value: number): number {
  return String(value).split('.')[1]?.length ?? 0
}

/** Snaps a value to the closest step, without the float noise of a decimal step (0.1 + 0.2) */
function roundToStep(value: number): number {
  const snapped = Math.round((value - min) / step) * step + min

  return Number(snapped.toFixed(Math.max(decimalsOf(step), decimalsOf(min))))
}

const PAGE_STEP_MULTIPLIER = 10

/**
 * A cursor can not go below the previous cursor nor above the next one
 */
function getCursorBounds(i: number) {
  const values = tmpValues.value ?? []

  return {
    lower: i > 0
      ? values[i - 1]
      : min,
    upper: i < values.length - 1
      ? values[i + 1]
      : max,
  }
}

function getKeyboardValue(event: KeyboardEvent, i: number): number | undefined {
  const values = tmpValues.value

  if (!values)
    return undefined

  const current = values[i]
  const { lower, upper } = getCursorBounds(i)

  switch (event.key) {
    case isRtl.value ? 'ArrowRight' : 'ArrowLeft':
    case 'ArrowDown':
      return isBetween(current - step, values[i - 1], values[i + 1], 'minus')
        ? Math.max(min, roundToStep(current - step))
        : current
    case isRtl.value ? 'ArrowLeft' : 'ArrowRight':
    case 'ArrowUp':
      return isBetween(current + step, values[i - 1], values[i + 1], 'plus')
        ? Math.min(max, roundToStep(current + step))
        : current
    case 'PageDown':
      return Math.max(lower, roundToStep(current - step * PAGE_STEP_MULTIPLIER))
    case 'PageUp':
      return Math.min(upper, roundToStep(current + step * PAGE_STEP_MULTIPLIER))
    case 'Home':
      return lower
    case 'End':
      return upper
    default:
      return undefined
  }
}

/**
 * Slider keyboard pattern: arrows move by one step, Page Up / Page Down by ten steps,
 * Home / End to the lowest / highest value allowed for the cursor
 */
function cursorKeyDown(event: KeyboardEvent, i: number) {
  const value = getKeyboardValue(event, i)

  if (value === undefined || !tmpValues.value)
    return

  event.preventDefault()

  if (value === tmpValues.value[i])
    return

  tmpValues.value[i] = value
  emitValue(tmpValues.value)
}
function blurCursor(i: number) {
  activeCursor.value = undefined
  setBtnStyle(i)
}
function checkValues() {
  // check if values are not below the min or above the max
  const valuesChecked = computedValue.value.map((v: number) => {
    const checkedValue = v < min
      ? min
      : v > max
        ? max
        : v
    return roundToStep(checkedValue)
  })
  emitValue(valuesChecked)
  tmpValues.value = valuesChecked
}
function emitValue(values: number[]) {
  const valueToEmit = hasMultipleValues.value
    ? [...values]
    : values[0]
  emits('update:model-value', valueToEmit)
}
function getLabel(i: number) {
  return labels ? labels[i] : undefined
}
function setBtnDividers(i: number) {
  setBtnStyle(i)
  if (divider)
    setDividers()
}
async function setBtnStyle(i: number) {
  await nextTick()

  const currentCursor = document.querySelectorAll('.m-slider .m-slider__btn')

  // get width of text in cursor + padding/space
  if (currentCursor) {
    const cursor = currentCursor[i]
    const width = cursor?.clientWidth + 16

    const btnStyle = {
      insetInlineStart:
          typeof buttonPositions.value?.[i] === 'number'
            ? `${buttonPositions.value[i] - width / 2 || 1}px`
            : '',
    }

    buttonStyles.value[i] = btnStyle
  }
}

function setDividers() {
  if (buttonPositions.value) {
    // remove getters/setters of vue
    const base = [...buttonPositions.value]
    // add an item to generate one more divider
    base.push(0)
    const baseLength = base.length
    const middle = Math.round(baseLength / 2)
    // generate dividers items with style
    dividers.value = base.map((pos, i) => ({
      insetInlineStart: i === 0
        ? 0
        : `${base[i - 1]}px`, // ATTENTION: buttonPositions.value[i - 1]
      insetInlineEnd: i + 1 === baseLength
        ? 0
        : `calc( 100% - ${pos}px )`,
      backgroundColor:
        middle === i + 1
          ? undefined
          : i < middle
            ? `rgba(255, 255, 255, ${getOpacityCoeff(i, middle, baseLength)})` // lighten
            : `rgba(0, 0, 0, ${getOpacityCoeff(i, middle, baseLength)})`, // darken
    }))
  }
}

async function calcPos() {
  await nextTick()
  const barWidth = MazSlider.value?.clientWidth
  if (typeof barWidth === 'number') {
    buttonPositions.value = tmpValues.value?.map(v =>
      log
        ? (barWidth / max) * (min + (Math.log(v) - minLog.value) / scale.value)
        : (barWidth / range.value) * (v - min),
    )
  }
  else {
    console.warn('[maz-ui][MazSlider] ref component not found')
  }
}
async function getCursorsValues() {
  await nextTick()
  const barWidth = MazSlider.value?.clientWidth
  if (typeof barWidth === 'number') {
    return log
      ? buttonPositions.value?.map((pos: number) => {
          const position = pos / (barWidth / max)
          const value = Math.exp((position - min) * scale.value + minLog.value)
          return roundToStep(value)
        })
      : buttonPositions.value?.map(
          (pos: number) => roundToStep(pos / (barWidth / range.value) + min),
        )
  }
  else {
    console.warn('[maz-ui][MazSlider] ref component not found')
    return undefined
  }
}
function handleMousedown(_event: MouseEvent | TouchEvent | FocusEvent, i: number) {
  if (activeCursor.value !== undefined)
    return

  readDirection()
  activeCursor.value = i
  setBtnDividers(i)
}
async function handleMouseup() {
  if (activeCursor.value === undefined)
    return

  const values = await getCursorsValues()

  if (values)
    emitValue(values)

  activeCursor.value = undefined
}
async function handleMousemove(event: MouseEvent | TouchEvent) {
  await nextTick()
  if (activeCursor.value === undefined)
    return

  const barWidth = MazSlider.value?.clientWidth

  if (buttonPositions.value) {
    const prevValue = buttonPositions.value[activeCursor.value - 1] || 0
    const nextValue = buttonPositions.value[activeCursor.value + 1] || barWidth

    if (!MazSlider.value)

      return console.error('[maz-ui](MazSlider/handleMousemove) MazSlider not available')

    buttonPositions.value[activeCursor.value] = (() => {
      const movement = getPos(event, MazSlider.value, isRtl.value).x

      if (movement < prevValue) {
        return prevValue
      }
      else if (nextValue && movement > nextValue) {
        return nextValue
      }

      return movement
    })()

    tmpValues.value = await getCursorsValues()

    setBtnDividers(activeCursor.value)
  }
}
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <div
    :style="[wrapperStyle, sliderStyle, { fontSize: size }]"
    class="m-slider m-reset-css"
    :class="[`m-slider--${color}`, { 'm-slider--labels': labels, 'm-slider--static': !animated }]"
    @mousemove.passive="handleMousemove"
    @mouseup.passive="handleMouseup"
    @mouseleave.passive="handleMouseup"
    @touchmove.passive="handleMousemove"
  >
    <div
      ref="MazSlider"
      class="m-slider__bar maz:relative maz:flex maz:flex-center maz:rounded-full"
    >
      <div
        v-if="tickList.length"
        class="m-slider__ticks"
        aria-hidden="true"
      >
        <span
          v-for="tick in tickList"
          :key="`tick-${tick.key}`"
          class="m-slider__tick"
          :data-passed="tick.passed"
          :style="tick.style"
        />
      </div>

      <div
        v-for="(div, i) in dividers"
        :key="`divider-${i}`"
        :style="[div]"
        class="m-slider__divider"
      />

      <button
        v-for="(_btn, i) in computedValue"
        :key="`cursor-${i}`"
        type="button"
        role="slider"
        :aria-label="t('aria.value')"
        :aria-valuenow="Number(tmpValues?.[i])"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuetext="getLabel(i)"
        :data-label="getLabel(i)"
        :data-value="tmpValues?.[i]"
        :data-state="i === activeCursor ? 'active' : 'idle'"
        class="m-slider__btn maz:flex maz:flex-center maz:rounded-full maz:border maz:border-solid maz:border-divider maz:bg-surface maz:shadow-md maz:hover:bg-surface-200"
        :class="{
          'active-cursor maz:z-2 maz:border maz:shadow-lg': i === activeCursor && cursorAnim,
        }"
        :style="[buttonStyles[i]]"
        @mousedown.passive="handleMousedown($event, i)"
        @touchstart.passive="handleMousedown($event, i)"
        @focus.passive="handleMousedown($event, i)"
        @blur.passive="blurCursor(i)"
        @touchend.passive="blurCursor(i)"
        @keydown="cursorKeyDown($event, i)"
      >
        <span class="maz:flex maz:items-center maz:text-foreground">
          {{ tmpValues?.[i] }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.m-slider {
  padding-block: 1em;
  padding-inline: 1.5rem;
}

.m-slider__btn {
  position: absolute;
  outline: none;
  cursor: var(--maz-interactive-cursor, pointer);
  font-size: 0.8em;
  font-weight: bold;
  line-height: 1;
  transition:
    box-shadow calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    scale calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-bounce, ease-out),
    background-color calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
  z-index: 1;
  user-select: none;
  padding-block: 0.25em;
  padding-inline: 0.5em;

  & span {
    margin-inline: 0.25em;
  }

  &.active-cursor {
    transform: scale(1.3);
    border-color: var(--m-slider-color);
  }

  &:focus-visible {
    outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
    outline-offset: var(--maz-focus-ring-offset, 2px);
  }

  &:active {
    scale: 0.94;
    transition-duration: calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1));
  }

  &::before {
    content: attr(data-label);
    position: absolute;
    inset-block-start: -1.5em;
    font-size: 0.8em;
    font-weight: 500;
    color: var(--maz-foreground);
  }

  &::after {
    content: attr(data-value) / '';
    position: absolute;
    inset-block-end: calc(100% + 0.6em);
    inset-inline: 0;
    inline-size: max-content;
    margin-inline: auto;
    translate: 0 0.4em;
    scale: 0.9;
    padding-block: 0.25em;
    padding-inline: 0.6em;
    border-radius: 0.5em;
    background-color: var(--maz-foreground);
    color: var(--maz-surface);
    font-size: 0.9em;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity calc(var(--maz-motion-fast, 100ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
      translate calc(var(--maz-motion-fast, 100ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
      scale calc(var(--maz-motion-fast, 100ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
  }

  &[data-state='active']::after,
  &:focus-visible::after {
    translate: 0 0;
    scale: 1;
    opacity: 1;
    transition-duration: calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1));
    transition-timing-function: var(--maz-easing-spring, ease-out);
  }
}

.m-slider--labels .m-slider__btn::after {
  inset-block-end: calc(100% + 1.9em);
}

.m-slider--static .m-slider__btn,
.m-slider--static .m-slider__btn::after,
.m-slider--static .m-slider__tick {
  transition: none;
}

.m-slider__ticks {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 0.35em);
  block-size: 0.4em;
  pointer-events: none;
}

.m-slider__tick {
  position: absolute;
  inset-block-start: 0;
  inline-size: 2px;
  block-size: 100%;
  margin-inline-start: -1px;
  border-radius: 1px;
  background-color: var(--maz-divider);
  transition: background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);

  &[data-passed='true'] {
    background-color: var(--m-slider-color, var(--maz-foreground));
  }
}

.m-slider__divider {
  position: absolute;
  border-radius: 2em;
  block-size: 100%;
}

.m-slider__bar {
  block-size: 0.5em;
  background-color: var(--m-slider-color);
}
</style>
