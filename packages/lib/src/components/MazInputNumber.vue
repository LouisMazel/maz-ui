<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazInputProps } from './MazInput.vue'
import type { MazSize } from './types'
import { MazMinus, MazPlus } from '@maz-ui/icons/static'
import { throttle } from '@maz-ui/utils/helpers/throttle'
import { computed, defineAsyncComponent } from 'vue'
import { useInstanceUniqId } from '../composables'
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
  size = 'md',
  textCenter = true,
  inputmode = 'numeric',
  topLabel = undefined,
  error = false,
  success = false,
  warning = false,
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
   * Static label displayed above the input field. Unlike the floating label, this remains fixed
   * @example "User Information"
   */
  topLabel?: string
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
  return value >= max ? max : findClosestStep(value)
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
    return '!maz-text-destructive-600'
  if (success)
    return '!maz-text-success-600'
  if (warning)
    return '!maz-text-warning-600'
  return undefined
})
</script>

<template>
  <div
    class="m-input-number m-reset-css"
    :class="[`m-input-number--${size}`, className, { '--block': block }]"
    :style="style"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="topLabel" :for="instanceId" class="m-input-number__top-label" :class="stateColor">{{ topLabel }}</label>

    <div class="m-input-number__wrapper">
      <MazBtn
        v-if="!hideButtons"
        color="transparent"
        :size
        class="m-input-number__button m-input-number__decrement-button"
        :disabled="decrementDisabled || disabled"
        @click="decrement"
      >
        <MazMinus class="m-input-number__button__icon" />
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
      />
      <MazBtn
        v-if="!hideButtons"
        color="transparent"
        :size
        class="m-input-number__button m-input-number__increment-button"
        :disabled="incrementDisabled || disabled"
        @click="increment"
      >
        <MazPlus class="m-input-number__button__icon" />
      </MazBtn>
    </div>
  </div>
</template>

<style scoped>
.m-input-number {
  @apply maz-inline-flex maz-flex-col maz-gap-2;

  &__wrapper {
    @apply maz-flex maz-items-center maz-align-top;
  }

  &.--block {
    @apply maz-w-full;
  }

  &__button {
    &.m-btn {
      &::before {
        content: none !important;
      }

      &:first-child,
      &:last-child {
        @apply maz-border maz-border-divider;
        @apply maz-px-3 maz-py-0;
      }

      &:first-child {
        @apply !maz-rounded-r-none;

        margin-right: calc(-1 * 2px);
      }

      &:last-child {
        @apply !maz-rounded-l-none;

        margin-left: calc(-1 * 2px);
      }
    }

    &__icon {
      @apply maz-text-base;
    }
  }

  &__input {
    &:not(.--no-buttons) :deep(.m-input-wrapper) {
      @apply maz-z-1 !maz-rounded-none;
    }

    &.--text-center {
      &:deep(input) {
        @apply maz-p-0 maz-text-center;
      }

      &:deep(.m-input-label) {
        @apply !maz-text-center !maz-w-full !maz-p-0 !maz-start-0;
      }

      &.--should-up:deep(.m-input-label) {
        @apply !maz-w-[calc(125%)];
      }
    }

    /* Chrome, Safari, Edge, Opera */
    &:deep(input::-webkit-outer-spin-button),
    &:deep(input::-webkit-inner-spin-button) {
      appearance: none;
      margin: 0;
    }

    /* Firefox */
    &:deep(input[type='number']) {
      appearance: textfield;
    }
  }
}
</style>
