<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazInputProps } from './MazInput.vue'
import type { MazSize } from './types'
import { MazMinus, MazPlus } from '@maz-ui/icons'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { computed, defineAsyncComponent } from 'vue'
import MazInput from './MazInput.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputNumberProps>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  disabled: false,
  max: Number.POSITIVE_INFINITY,
  min: Number.NEGATIVE_INFINITY,
  step: 1,
  size: 'md',
  textCenter: true,
  inputmode: 'numeric',
})

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

export interface MazInputNumberProps {
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
   * @type {number}
   */
  modelValue?: number
  /**
   * Whether the input number is disabled or not.
   * @type {boolean}
   */
  disabled?: boolean
  /**
   * The maximum value allowed for the input number.
   * @type {number}
   * @default Number.POSITIVE_INFINITY
   */
  max?: number
  /**
   * The minimum value allowed for the input number.
   * @type {number}
   * @default Number.NEGATIVE_INFINITY
   */
  min?: number
  /**
   * The step value for incrementing or decrementing the input number.
   * @type {number}
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
   * @type {boolean}
   * @default false
   */
  hideButtons?: boolean
  /**
   * Whether to center the text inside the input or not.
   * @type {boolean}
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
   * @type {boolean}
   */
  block?: boolean
  /**
   * Will display the input in error state.
   * @type {boolean}
   * @default false
   */
  error?: boolean
  /**
   * The hint text to display below the input.
   * @type {string}
   */
  hint?: string
  /**
   * Will display the input in success state.
   * @type {boolean}
   * @default false
   */
  success?: boolean
  /**
   * Will display the input in warning state.
   * @type {boolean}
   * @default false
   */
  warning?: boolean
  /**
   * The props for the input component.
   * @type {MazInputProps}
   */
  inputProps?: MazInputProps
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const currentValue = computed({
  get: () => props.modelValue,
  set: value => emitValue(value),
})

function findClosestStep(number: number) {
  return Math.round(number / props.step) * props.step
}

function checkValue(value?: number) {
  if (typeof value !== 'number')
    return
  if (value <= props.min)
    return props.min
  return value >= props.max ? props.max : findClosestStep(value)
}

const emitDebounced = debounce((value?: number) => emitValue(value), 300)

function emitValue(newValue?: number) {
  newValue = checkValue(newValue)
  if (currentValue.value === newValue)
    return
  emits('update:model-value', newValue)
}

emitValue(currentValue.value)

const incrementDisabled = computed(() => props.modelValue && props.modelValue >= props.max)
const decrementDisabled = computed(() => props.modelValue && props.modelValue <= props.min)

function increment() {
  if (props.disabled || incrementDisabled.value)
    return

  if (
    (currentValue.value === undefined || currentValue.value === null)
    && Number.isFinite(props.min)
  ) {
    currentValue.value = props.min
    return
  }

  currentValue.value = (currentValue.value ?? 0) + 1 * props.step
}
function decrement() {
  if (props.disabled || decrementDisabled.value)
    return

  if (
    (currentValue.value === undefined || currentValue.value === null)
    && Number.isFinite(props.min)
  ) {
    currentValue.value = props.min
    return
  }

  currentValue.value = (currentValue.value ?? 0) - 1 * props.step
}
</script>

<template>
  <div
    class="m-input-number m-reset-css"
    :class="[`m-input-number--${size}`, props.class, { '--block': block }]"
    :style="style"
  >
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
      :model-value="currentValue"
      type="number"
      class="m-input-number__input"
      :class="{ '--no-buttons': hideButtons, '--text-center': textCenter }"
      v-bind="{ ...$attrs, ...inputProps }"
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
      @update:model-value="emitDebounced($event as number | undefined)"
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
</template>

<style>
  .m-input-number {
  @apply maz-inline-flex maz-align-top;

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
    &:not(.--no-buttons) .m-input-wrapper {
      @apply maz-z-1 !maz-rounded-none;
    }

    &.--text-center input {
      @apply maz-p-0 maz-text-center;
    }

    /* Chrome, Safari, Edge, Opera */
    & input::-webkit-outer-spin-button,
    & input::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    /* Firefox */
    & input[type='number'] {
      appearance: textfield;
    }
  }
}
</style>
