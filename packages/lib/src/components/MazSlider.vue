<script lang="ts" setup>
import type { Color } from '@components/types'
import { getOpacityCoeff, getPos, isBetween } from '@components/MazSlider/utils'

import { debounce } from '@helpers/debounce'
import {
  computed,
  type CSSProperties,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch,
} from 'vue'

const props = defineProps({
  /** Array of cursors values */
  modelValue: {
    type: [Number, Array] as PropType<number | number[]>,
    required: true,
    validator: (value: string) => {
      return ['number'].includes(typeof value) || Array.isArray(value) || value === null
    },
  },
  /** array of cursors label */
  labels: { type: Array, default: undefined },
  /** min value of sliders */
  min: { type: Number, default: 0 },
  /** max value of sliders */
  max: { type: Number, default: 100 },
  /** height size of slider bar */
  size: { type: String, default: undefined },
  /** remove div in different colors */
  noDivider: { type: Boolean, default: false },
  /** become a logarithmic slider (exponential) */
  log: { type: Boolean, default: false },
  /** main slider color */
  color: {
    type: String as PropType<Color>,
    default: 'primary',
  },
  /** disables cursor animation when active */
  noCursorAnim: { type: Boolean, default: false },
})

const emits = defineEmits(['update:model-value'])

const MazSlider = ref<HTMLDivElement>()

const activeCursor = ref<number>()
const buttonPositions = ref<number[]>()
const tmpValues = ref<number[]>()

const buttonStyles = ref<CSSProperties[]>([])
const dividers = ref<CSSProperties[]>([])

// COMPUTED

const computedValue = computed<number[]>(() => {
  if (typeof props.modelValue === 'number') {
    return [props.modelValue]
  }
  else if (props.modelValue) {
    return props.modelValue
  }
  else {
    return [0]
  }
})
const minLog = computed(() => {
  return Math.log(props.min || 1)
})
const maxLog = computed(() => {
  return Math.log(props.max)
})
const scale = computed(() => {
  const { min, max } = props
  return (maxLog.value - minLog.value) / (max - min)
})
const range = computed(() => {
  const { min, max } = props
  return max - min
})
const wrapperStyle = computed(() => {
  return {
    paddingTop: props.labels ? `2.5em` : `1em`,
  }
})
const hasMultipleValues = computed(() => Array.isArray(props.modelValue))

watch(
  () => props.modelValue,
  () => (tmpValues.value = computedValue.value),
  { immediate: true },
)
watch(
  () => [computedValue.value, props.min, props.max, props.log].join(','),
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

function cursorKeyDown(event: KeyboardEvent, i: number) {
  if (event.key === 'ArrowLeft') {
    if (
      tmpValues.value
      && isBetween(tmpValues.value[i] - 1, tmpValues.value[i - 1], tmpValues.value[i + 1], 'minus')
    ) {
      tmpValues.value[i]--
      emitValue(tmpValues.value)
    }
  }
  // ArrowRight
  else if (
    event.key === 'ArrowRight'
    && tmpValues.value
    && isBetween(tmpValues.value[i] + 1, tmpValues.value[i - 1], tmpValues.value[i + 1], 'plus')
  ) {
    tmpValues.value[i]++
    emitValue(tmpValues.value)
  }
}
function blurCursor(i: number) {
  activeCursor.value = undefined
  setBtnStyle(i)
}
function checkValues() {
  // check if values are not below the min or above the max
  const { min, max } = props
  const valuesChecked = computedValue.value.map((v: number) =>
    v < min ? min : v > max ? max : v,
  )
  emitValue(valuesChecked)
  tmpValues.value = valuesChecked
}
function emitValue(values: number[]) {
  const valueToEmit = hasMultipleValues.value ? [...values] : values[0]
  emits('update:model-value', valueToEmit)
}
function getLabel(i: number) {
  const { labels } = props
  return labels ? labels[i] : undefined
}
function setBtnDividers(i: number) {
  setBtnStyle(i)
  if (!props.noDivider)
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
  const { min, max, log } = props
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
  const { max, min, log } = props
  const barWidth = MazSlider.value?.clientWidth
  if (typeof barWidth === 'number') {
    return log
      ? buttonPositions.value?.map((pos: number) => {
        const position = pos / (barWidth / max)
        const value = Math.exp((position - min) * scale.value + minLog.value)
        return Math.round(value)
      })
      : buttonPositions.value?.map(
        (pos: number) => Math.round(pos / (barWidth / range.value)) + min,
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
      :aria-valuenow="modelValue.toString()"
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
          'active-cursor': i === activeCursor && !noCursorAnim,
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
    font-size: 1em;
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
        maz-border-border maz-bg-bg-light maz-shadow-md;

    padding: 0.25em 0.5em;

    & span {
      @apply maz-flex maz-items-center maz-text-dark;

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

      @apply maz-absolute maz-font-medium maz-text-normal;
    }

    &:hover {
      @apply maz-bg-border;
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

  &--danger {
    & .m-slider {
      &__bar {
        @apply maz-bg-danger;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-danger maz-shadow-lg;
      }
    }
  }

  &--white {
    & .m-slider {
      &__bar {
        @apply maz-bg-white;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-white maz-shadow-lg;
      }
    }
  }

  &--black {
    & .m-slider {
      &__bar {
        @apply maz-bg-black;
      }

      &__btn.active-cursor {
        @apply maz-border maz-border-black maz-shadow-lg;
      }
    }
  }
}
</style>
