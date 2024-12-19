<script lang="ts" setup>
import type { Size } from './types'
import { computed, defineAsyncComponent, type HTMLAttributes } from 'vue'
import { debounce } from '../helpers/debounce'
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
  noButtons: false,
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
  /** The inline style object for the component. */
  style?: HTMLAttributes['style']
  /** The CSS class name for the component. */
  class?: HTMLAttributes['class']
  /** The value of the component (v-model). */
  modelValue?: number
  /** Whether the input number is disabled or not. */
  disabled?: boolean
  /** The maximum value allowed for the input number. */
  max?: number
  /** The minimum value allowed for the input number. */
  min?: number
  /** The step value for incrementing or decrementing the input number. */
  step?: number
  /** The size of the input number component. */
  size?: Size
  /** Whether to hide the increment and decrement buttons or not. */
  noButtons?: boolean
  /** Whether to center the text inside the input or not. */
  textCenter?: boolean
  /** The inputmode attribute for the input. */
  inputmode?: HTMLAttributes['inputmode']
  /** The input will be displayed in full width */
  block?: boolean
  /** Will display the input in error state. */
  error?: boolean
  /** The hint text to display below the input. */
  hint?: string
  /** Will display the input in success state. */
  success?: boolean
  /** Will display the input in warning state. */
  warning?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MinusIcon = defineAsyncComponent(() => import('../../icons/minus.svg'))
const PlusIcon = defineAsyncComponent(() => import('../../icons/plus.svg'))

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
      v-if="!noButtons"
      color="transparent"
      :size
      tabindex="-1"
      class="m-input-number__button m-input-number__decrement-button"
      :disabled="decrementDisabled || disabled"
      @click="decrement"
    >
      <MinusIcon class="m-input-number__button__icon" />
    </MazBtn>
    <MazInput
      :model-value="currentValue"
      type="number"
      class="m-input-number__input"
      :class="{ '--no-buttons': noButtons, '--text-center': textCenter }"
      :disabled
      :min
      :max
      :step
      :error
      :success
      :warning
      :hint
      v-bind="$attrs"
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
      v-if="!noButtons"
      color="transparent"
      no-shadow
      tabindex="-1"
      :size
      class="m-input-number__button m-input-number__increment-button"
      :disabled="incrementDisabled || disabled"
      @click="increment"
    >
      <PlusIcon class="m-input-number__button__icon" />
    </MazBtn>
  </div>
</template>

<style lang="postcss">
  .m-input-number {
  @apply maz-inline-flex maz-align-top;

  &.--block {
    @apply maz-w-full;
  }

  &__button {
    &.m-btn.--is-button {
      &::before {
        content: none !important;
      }

      &:first-child,
      &:last-child {
        @apply maz-border maz-border-border;
        @apply maz-px-3 maz-py-0;
        @apply dark:maz-border-color-lighter;
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
      @apply maz-z-1 maz-rounded-none;
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
