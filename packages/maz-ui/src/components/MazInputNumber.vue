<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazInputProps } from './MazInput.vue'
import type { MazSize } from './types.ts'
import { MazMinus } from '@maz-ui/icons/raw/MazMinus'
import { MazPlus } from '@maz-ui/icons/raw/MazPlus'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { throttle } from '@maz-ui/utils/helpers/throttle'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref } from 'vue'
import { useInstanceUniqId } from '../composables/index.ts'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { SIZE_TEXT_CLASS } from './constants.ts'
import MazIcon from './MazIcon.vue'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const {
  id = undefined,
  style = undefined,
  class: className = undefined,
  modelValue = undefined,
  disabled = false,
  max = Number.POSITIVE_INFINITY,
  min = Number.NEGATIVE_INFINITY,
  step = 1,
  textCenter = true,
  inputmode = 'numeric',
  topLabel = undefined,
  prefix = undefined,
  suffix = undefined,
  error = false,
  success = false,
  warning = false,
  animated = true,
} = defineProps<MazInputNumberProps>()

const emits = defineEmits<{
  /**
   * Emitted when the input value change
   * @property {number | undefined} value - value of the input
   */
  'update:model-value': [value?: number]
  /**
   * Emitted when the input is focused
   * @property {Event} value - event object
   */
  'focus': [value: Event]
  /**
   * Emitted when the input is blurred
   * @property {Event} value - event object
   */
  'blur': [value: Event]
  /**
   * Emitted input is clicked
   * @property {Event} value - event object
   */
  'click': [value: Event]
  /**
   * Emitted when the value change
   * @property {Event} value - event object
   */
  'change': [value: Event]
}>()

defineSlots<{
  /** Content before the number, inside the field (a unit, an icon) */
  prefix?: () => unknown
  /** Content after the number, inside the field (a unit, an icon) */
  suffix?: () => unknown
}>()

const { size } = useGlobalConfig<{ size: MazSize }>('MazInputNumber', { size: 'md' })
const { t } = useTranslations()

const instanceId = useInstanceUniqId({
  componentName: 'MazInput',
  providedId: id,
})

export interface MazInputNumberProps {
  /**
   * The id of the input.
   */
  id?: string
  /**
   * The inline style object for the component.
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * The CSS class name for the component.
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /**
   * The value of the component (v-model).
   * @model
   */
  modelValue?: number
  /**
   * Whether the input number is disabled or not.
   */
  disabled?: boolean
  /**
   * The maximum value allowed for the input number.
   * @default Number.POSITIVE_INFINITY
   */
  max?: number
  /**
   * The minimum value allowed for the input number.
   * @default Number.NEGATIVE_INFINITY
   */
  min?: number
  /**
   * The step value for incrementing or decrementing the input number.
   * @default 1
   */
  step?: number
  /**
   * The size of the input number component.
   * @type {MazSize}
   * @default 'md'
   */
  size?: MazSize
  /**
   * Whether to hide the increment and decrement buttons or not.
   * @default false
   */
  hideButtons?: boolean
  /**
   * Whether to center the text inside the input or not.
   * @default true
   */
  textCenter?: boolean
  /**
   * The inputmode attribute for the input.
   * @type {HTMLAttributes['inputmode']}
   */
  inputmode?: HTMLAttributes['inputmode']
  /**
   * The input will be displayed in full width
   */
  block?: boolean
  /**
   * Will display the input in error state.
   * @default false
   */
  error?: boolean
  /**
   * The hint text to display below the input.
   */
  hint?: string
  /**
   * Will display the input in success state.
   * @default false
   */
  success?: boolean
  /**
   * Will display the input in warning state.
   * @default false
   */
  warning?: boolean
  /**
   * The props for the input component.
   * @type {MazInputProps}
   */
  inputProps?: MazInputProps
  /**
   * Text displayed before the number, inside the field (a unit like `$`). Use the `prefix` slot for rich content
   */
  prefix?: string
  /**
   * Text displayed after the number, inside the field (a unit like `min` or `kg`). Use the `suffix` slot for rich content
   */
  suffix?: string
  /**
   * Static label displayed above the input field. Unlike the floating label, this remains fixed
   * @example "User Information"
   */
  topLabel?: string
  /**
   * Slide the value a little when the + and - buttons change it, and speed up while a button is held.
   * Typing and the arrow keys never animate
   * @default true
   */
  animated?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const currentValue = computed({
  get: () => modelValue,
  set: value => emitValue(value),
})

function findClosestStep(number: number) {
  return Math.round(number / step) * step
}

function checkValue(value?: number) {
  if (typeof value !== 'number')
    return
  if (value <= min)
    return min
  return value >= max
    ? max
    : findClosestStep(value)
}

const emitThrottled = throttle((value?: number) => emitValue(value), 300)

function emitValue(newValue?: number) {
  newValue = checkValue(newValue)
  if (currentValue.value === newValue)
    return
  emits('update:model-value', newValue)
}

emitValue(currentValue.value)

const incrementDisabled = computed(() => modelValue && modelValue >= max)
const decrementDisabled = computed(() => modelValue && modelValue <= min)

const root = ref<HTMLElement>()
const { shouldReduceMotion } = useReducedMotion()

const HOLD_DELAY = 400
const HOLD_START_INTERVAL = 160
const HOLD_MIN_INTERVAL = 40
const HOLD_ACCELERATION = 12
const SLIDE_DISTANCE = '30%'
const SLIDE_DURATION = 150

let holdTimer: ReturnType<typeof setTimeout> | undefined
let holdCount = 0
let handledByHold = false
let slide: Animation | undefined

function slideValue(direction: 1 | -1) {
  if (!animated || shouldReduceMotion.value)
    return

  const input = root.value?.querySelector('input')

  if (!input || typeof input.animate !== 'function')
    return

  const offset = direction === 1 ? SLIDE_DISTANCE : `-${SLIDE_DISTANCE}`

  slide?.cancel()
  slide = input.animate(
    [
      { transform: `translateY(${offset})`, opacity: 0 },
      { transform: 'translateY(0)', opacity: 1, offset: 0.7 },
      { transform: 'translateY(0)', opacity: 1 },
    ],
    { duration: SLIDE_DURATION, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  )
}

function stepValue(direction: 1 | -1, withSlide: boolean) {
  if (direction === 1)
    increment()
  else
    decrement()

  if (withSlide)
    nextTick(() => slideValue(direction))
}

function stopHold() {
  clearTimeout(holdTimer)
  holdTimer = undefined
  holdCount = 0
  globalThis.removeEventListener('pointerup', stopHold)
  globalThis.removeEventListener('pointercancel', stopHold)
}

function repeatHold(direction: 1 | -1) {
  const edgeReached = direction === 1 ? incrementDisabled.value : decrementDisabled.value

  if (disabled || edgeReached) {
    stopHold()
    return
  }

  handledByHold = true
  stepValue(direction, false)
  holdCount++
  holdTimer = setTimeout(
    repeatHold,
    Math.max(HOLD_MIN_INTERVAL, HOLD_START_INTERVAL - holdCount * HOLD_ACCELERATION),
    direction,
  )
}

function startHold(event: PointerEvent, direction: 1 | -1) {
  if (!animated || event.button !== 0)
    return

  stopHold()
  handledByHold = false
  globalThis.addEventListener('pointerup', stopHold)
  globalThis.addEventListener('pointercancel', stopHold)
  holdTimer = setTimeout(repeatHold, HOLD_DELAY, direction)
}

function onButtonClick(direction: 1 | -1) {
  if (handledByHold) {
    handledByHold = false
    return
  }

  stepValue(direction, true)
}

onBeforeUnmount(() => {
  stopHold()
  slide?.cancel()
})

function increment() {
  if (disabled || incrementDisabled.value)
    return

  if (
    (currentValue.value === undefined || currentValue.value === null)
    && Number.isFinite(min)
  ) {
    currentValue.value = min
    return
  }

  currentValue.value = (currentValue.value ?? 0) + 1 * step
}
function decrement() {
  if (disabled || decrementDisabled.value)
    return

  if (
    (currentValue.value === undefined || currentValue.value === null)
    && Number.isFinite(min)
  ) {
    currentValue.value = min
    return
  }

  currentValue.value = (currentValue.value ?? 0) - 1 * step
}

const stateColor = computed(() => {
  if (error)
    return 'maz:text-destructive-600!'
  if (success)
    return 'maz:text-success-600!'
  if (warning)
    return 'maz:text-warning-600!'
  return undefined
})
</script>

<template>
  <div
    ref="root"
    class="m-input-number m-reset-css maz:inline-flex maz:flex-col maz:gap-2"
    :class="[`m-input-number--${size}`, SIZE_TEXT_CLASS[size], className, { '--block': block, 'maz:w-full': block }]"
    :style="style"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabel"
      :for="instanceId"
      class="m-input-number__top-label"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
      :class="stateColor"
    >
      {{ topLabel }}
    </label>

    <div class="m-input-number__wrapper maz:flex maz:items-center maz:align-top">
      <MazBtn
        v-if="!hideButtons"
        color="transparent"
        :size
        :aria-label="t('aria.decrement')"
        class="m-input-number__button m-input-number__decrement-button"
        :disabled="decrementDisabled || disabled"
        @pointerdown="startHold($event, -1)"
        @click="onButtonClick(-1)"
      >
        <MazIcon :icon="MazMinus" class="m-input-number__button__icon maz:text-base" />
      </MazBtn>
      <MazInput
        v-bind="{ ...$attrs, ...inputProps }"
        :id="instanceId"
        :model-value="currentValue"
        type="number"
        class="m-input-number__input"
        :class="{ '--no-buttons': hideButtons, '--text-center': textCenter }"
        :disabled
        :min
        :max
        :step
        :error
        :success
        :warning
        :hint
        :inputmode
        :size
        block
        @keydown.up.prevent="increment"
        @keydown.down.prevent="decrement"
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event)"
        @blur="$emit('blur', $event)"
        @click="$emit('click', $event)"
        @update:model-value="emitThrottled($event as number | undefined)"
      >
        <template v-if="prefix || hasSlotContent($slots.prefix)" #start-icon>
          <!-- @slot prefix - Content before the number, inside the field (a unit, an icon) -->
          <slot name="prefix">
            <span class="m-input-number__affix maz:whitespace-nowrap maz:text-muted">{{ prefix }}</span>
          </slot>
        </template>
        <template v-if="suffix || hasSlotContent($slots.suffix)" #end-icon>
          <!-- @slot suffix - Content after the number, inside the field (a unit, an icon) -->
          <slot name="suffix">
            <span class="m-input-number__affix maz:whitespace-nowrap maz:text-muted">{{ suffix }}</span>
          </slot>
        </template>
      </MazInput>
      <MazBtn
        v-if="!hideButtons"
        color="transparent"
        :size
        :aria-label="t('aria.increment')"
        class="m-input-number__button m-input-number__increment-button"
        :disabled="incrementDisabled || disabled"
        @pointerdown="startHold($event, 1)"
        @click="onButtonClick(1)"
      >
        <MazIcon :icon="MazPlus" class="m-input-number__button__icon maz:text-base" />
      </MazBtn>
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-input-number__input {
  &:not(.--no-buttons) :deep(.m-input-wrapper) {
    @apply maz:z-1 maz:rounded-none!;
  }

  &.--text-center {
    &:deep(input) {
      @apply maz:p-0 maz:text-center;
    }

    &:deep(.m-input-label) {
      @apply maz:text-center! maz:w-full! maz:p-0! maz:inset-s-0!;
    }

    &.--should-up:deep(.m-input-label) {
      @apply maz:w-[calc(125%)]!;
    }
  }

  /* Chrome, Safari, Edge, Opera: Safari needs the prefixed property on the pseudo-elements */
  &:deep(input::-webkit-outer-spin-button),
  &:deep(input::-webkit-inner-spin-button) {
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  /* Firefox and Safari */
  &:deep(input[type='number']) {
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: textfield;
    appearance: textfield;
  }
}

.m-input-number__button {
  &.m-btn {
    &::before {
      content: none !important;
    }

    &:first-child,
    &:last-child {
      @apply maz:border maz:border-divider;
      @apply maz:px-3 maz:py-0;
    }

    &:first-child {
      @apply maz:rounded-e-none!;

      margin-inline-end: calc(-1 * 2px);
    }

    &:last-child {
      @apply maz:rounded-s-none!;

      margin-inline-start: calc(-1 * 2px);
    }
  }
}
</style>
