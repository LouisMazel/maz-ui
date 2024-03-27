<template>
  <div
    class="m-input-number maz-align-center"
    :class="[`m-input-number--${size}`, props.class]"
    :style="style"
  >
    <MazBtn
      v-if="!noButtons"
      color="transparent"
      :size="size"
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
      class="m-input-number__input maz-flex-1"
      :class="{ '--no-buttons': noButtons, '--text-center': textCenter }"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      v-bind="$attrs"
      :inputmode="inputmode"
      :size="size"
      @keydown.up.prevent="increment"
      @keydown.down.prevent="decrement"
      @focus="$emit('focus', $event)"
      @change="$emit('change', $event)"
      @blur="$emit('blur', $event)"
      @click="$emit('click', $event)"
      @update="$emit('update', $event)"
      @update:model-value="emitDebounced($event as number | undefined)"
    />
    <MazBtn
      v-if="!noButtons"
      color="transparent"
      no-shadow
      tabindex="-1"
      :size="size"
      class="m-input-number__button m-input-number__increment-button"
      :disabled="incrementDisabled || disabled"
      @click="increment"
    >
      <PlusIcon class="m-input-number__button__icon" />
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { computed, type HTMLAttributes } from 'vue'
  import type { Size } from './types'
  export type { Size }

  import MazBtn from './MazBtn.vue'
  import MazInput from './MazInput.vue'
  import PlusIcon from './../icons/plus.svg'
  import MinusIcon from './../icons/minus.svg'
  import { debounce } from '../modules/helpers/debounce'

  defineOptions({
    inheritAttrs: false,
  })

  export type Props = {
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
  }

  const props = withDefaults(defineProps<Props>(), {
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
    /** Emitted when the input value change */
    (event: 'update:model-value', value: number | undefined): void
    /** Emitted when the input is focused */
    (event: 'focus', value: unknown): void
    /** Emitted when the input is blurred */
    (event: 'blur', value: unknown): void
    /** Emitted input is clicked */
    (event: 'click', value: unknown): void
    /** Emitted when the value change */
    (event: 'update', value: unknown): void
    /** Emitted when the value change */
    (event: 'change', value: unknown): void
  }>()

  const currentValue = computed({
    get: () => props.modelValue,
    set: (value) => emitValue(value),
  })

  function findClosestStep(number: number) {
    return Math.round(number / props.step) * props.step
  }

  const checkValue = (value?: number) => {
    if (typeof value !== 'number') return
    if (value <= props.min) return props.min
    return value >= props.max ? props.max : findClosestStep(value)
  }

  const emitDebounced = debounce((value?: number) => emitValue(value), 300)

  const emitValue = (newValue?: number) => {
    newValue = checkValue(newValue)
    if (currentValue.value === newValue) return
    emits('update:model-value', newValue)
  }

  emitValue(currentValue.value)

  const incrementDisabled = computed(() => props.modelValue && props.modelValue >= props.max)
  const decrementDisabled = computed(() => props.modelValue && props.modelValue <= props.min)

  const increment = () => {
    if (props.disabled || incrementDisabled.value) return

    if (
      (currentValue.value === undefined || currentValue.value === null) &&
      Number.isFinite(props.min)
    ) {
      currentValue.value = props.min
      return
    }

    currentValue.value = (currentValue.value ?? 0) + 1 * props.step
  }
  const decrement = () => {
    if (props.disabled || decrementDisabled.value) return

    if (
      (currentValue.value === undefined || currentValue.value === null) &&
      Number.isFinite(props.min)
    ) {
      currentValue.value = props.min
      return
    }

    currentValue.value = (currentValue.value ?? 0) - 1 * props.step
  }
</script>

<style lang="postcss">
  .m-input-number {
    @apply maz-inline-flex maz-align-top;

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
        @apply maz-z-1 !maz-rounded-none;
      }

      &.--text-center input {
        @apply !maz-p-0 maz-text-center;
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
