<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor } from './types'
import { debounce } from '@maz-ui/utils/helpers/debounce'

import {
  computed,

  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { getOpacityCoeff, getPos, isBetween } from './MazSlider/utils'

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
  size?: string
  /** remove div in different colors */
  divider?: boolean
  /** become a logarithmic slider (exponential) */
  log?: boolean
  /** main slider color */
  color?: MazColor
  /** disables cursor animation when active */
  cursorAnim?: boolean
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
} = defineProps<MazSliderProps>()

const emits = defineEmits(['update:model-value'])

const MazSlider = ref<HTMLDivElement>()

const activeCursor = ref<number>()
const buttonPositions = ref<number[]>()
const tmpValues = ref<number[]>()

const buttonStyles = ref<CSSProperties[]>([])
const dividers = ref<CSSProperties[]>([])

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
    paddingTop: labels ? `2.5em` : `1em`,
  }
})
const hasMultipleValues = computed(() => Array.isArray(modelValue))

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
  if (emitValue === true)
    checkValues()
  await calcPos()
  await nextTick()

  for (const [index] of computedValue.value.entries()) {
    setBtnDividers(index)
  }
}

function roundToStep(value: number): number {
  return Math.round((value - min) / step) * step + min
}

function cursorKeyDown(event: KeyboardEvent, i: number) {
  if (event.key === 'ArrowLeft') {
    if (
      tmpValues.value
      && isBetween(tmpValues.value[i] - step, tmpValues.value[i - 1], tmpValues.value[i + 1], 'minus')
    ) {
      tmpValues.value[i] = Math.max(min, tmpValues.value[i] - step)
      emitValue(tmpValues.value)
    }
  }
  // ArrowRight
  else if (
    event.key === 'ArrowRight'
    && tmpValues.value
    && isBetween(tmpValues.value[i] + step, tmpValues.value[i - 1], tmpValues.value[i + 1], 'plus')
  ) {
    tmpValues.value[i] = Math.min(max, tmpValues.value[i] + step)
    emitValue(tmpValues.value)
  }
}
function blurCursor(i: number) {
  activeCursor.value = undefined
  setBtnStyle(i)
}
function checkValues() {
  // check if values are not below the min or above the max
  const valuesChecked = computedValue.value.map((v: number) => {
    const checkedValue = v < min ? min : v > max ? max : v
    return roundToStep(checkedValue)
  })
  emitValue(valuesChecked)
  tmpValues.value = valuesChecked
}
function emitValue(values: number[]) {
  const valueToEmit = hasMultipleValues.value ? [...values] : values[0]
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
      left:
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
      left: i === 0 ? 0 : `${base[i - 1]}px`, // ATTENTION: buttonPositions.value[i - 1]
      right: i + 1 === baseLength ? 0 : `calc( 100% - ${pos}px )`,
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
          return roundToStep(Math.round(value))
        })
      : buttonPositions.value?.map(
          (pos: number) => roundToStep(Math.round(pos / (barWidth / range.value)) + min),
        )
  }
  else {
    console.warn('[maz-ui][MazSlider] ref component not found')
  }
}
function handleMousedown(_event: MouseEvent | TouchEvent | FocusEvent, i: number) {
  if (activeCursor.value !== undefined)
    return

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
      const movement = getPos(event, MazSlider.value).x

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
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
  <div
    :style="[wrapperStyle, { fontSize: size }]"
    class="m-slider m-reset-css"
    role="button"
    tabindex="-1"
    :class="[`m-slider--${color}`]"
    @mousemove.passive="handleMousemove"
    @mouseup.passive="handleMouseup"
    @mouseleave.passive="handleMouseup"
    @touchmove.passive="handleMousemove"
  >
    <div
      ref="MazSlider"
      class="m-slider__bar"
      role="slider"
      :aria-valuenow="modelValue?.toString()"
      :aria-valuemin="min"
      :aria-valuemax="max"
    >
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
        :data-label="getLabel(i)"
        class="m-slider__btn"
        :class="{
          'active-cursor': i === activeCursor && cursorAnim,
        }"
        :style="[buttonStyles[i]]"
        @mousedown.passive="handleMousedown($event, i)"
        @touchstart.passive="handleMousedown($event, i)"
        @focus.passive="handleMousedown($event, i)"
        @blur.passive="blurCursor(i)"
        @touchend.passive="blurCursor(i)"
        @keydown.passive="cursorKeyDown($event, i)"
      >
        <span>
          {{ tmpValues?.[i] }}
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-slider {
  padding: 1em 1.5rem;

  &__bar {
    @apply maz-relative maz-flex maz-items-center maz-justify-center maz-rounded-full;

    height: 0.5em;
  }

  &__divider {
    position: absolute;
    border-radius: 2em;
    height: 100%;
  }

  &__btn {
    position: absolute;
    outline: none;
    cursor: pointer;
    font-size: 0.8em;
    font-weight: bold;
    line-height: 1;
    transition:
      box-shadow 300ms ease-in-out,
      width 300ms ease-in-out,
      transform 300ms ease-in-out,
      background-color 300ms ease-in-out;
    z-index: 1;
    user-select: none;

    @apply maz-flex maz-items-center maz-justify-center maz-rounded-full maz-border
        maz-border-divider maz-bg-surface-400 maz-shadow-md;

    padding: 0.25em 0.5em;

    & span {
      @apply maz-flex maz-items-center maz-text-foreground;

      margin-left: 0.25em;
      margin-right: 0.25em;
    }

    &.active-cursor {
      transform: scale(1.3);

      @apply maz-z-2;
    }

    &::before {
      content: attr(data-label);
      font-size: 0.8em;
      top: -1.5em;

      @apply maz-absolute maz-font-medium maz-text-foreground;
    }

    &:hover {
      @apply maz-bg-surface-200;
    }
  }

  &--primary {
    & .m-slider {
      &__bar {
        @apply maz-bg-primary;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-primary maz-shadow-lg;
      }
    }
  }

  &--secondary {
    & .m-slider {
      &__bar {
        @apply maz-bg-secondary;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-secondary maz-shadow-lg;
      }
    }
  }

  &--info {
    & .m-slider {
      &__bar {
        @apply maz-bg-info;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-info maz-shadow-lg;
      }
    }
  }

  &--success {
    & .m-slider {
      &__bar {
        @apply maz-bg-success;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-success maz-shadow-lg;
      }
    }
  }

  &--warning {
    & .m-slider {
      &__bar {
        @apply maz-bg-warning;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-warning maz-shadow-lg;
      }
    }
  }

  &--destructive {
    & .m-slider {
      &__bar {
        @apply maz-bg-destructive;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-destructive maz-shadow-lg;
      }
    }
  }

  &--contrast {
    & .m-slider {
      &__bar {
        @apply maz-bg-contrast;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-contrast maz-shadow-lg;
      }
    }
  }

  &--accent {
    & .m-slider {
      &__bar {
        @apply maz-bg-accent;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-accent maz-shadow-lg;
      }
    }
  }
}
</style>
