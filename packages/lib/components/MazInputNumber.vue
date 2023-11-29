<template>
  <div
    class="m-input-number maz-align-center"
    :class="[`m-input-number--${size}`, props.class]"
    :style="style"
  >
    <MazBtn
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
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="step"
      v-bind="$attrs"
      :size="size"
      @keydown.up.prevent="increment"
      @keydown.down.prevent="decrement"
      @update:model-value="emitDebounced($event)"
    />
    <MazBtn
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
  import { computed, type HTMLAttributes, type PropType } from 'vue'
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

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    modelValue: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false },
    max: { type: Number, default: Number.POSITIVE_INFINITY },
    min: { type: Number, default: Number.NEGATIVE_INFINITY },
    step: { type: Number, default: 1 },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
  })

  const emits = defineEmits(['update:model-value'])

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

  const emitDebounced = debounce((value: number) => emitValue(value), 300)

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
    @apply maz-inline-flex;

    &__button {
      &.m-btn.--is-button {
        &::before {
          content: none !important;
        }

        &:first-child,
        &:last-child {
          @apply maz-border maz-border-gray-200;
          @apply maz-px-3 maz-py-0;
          @apply dark:maz-border-color-lighter;
        }

        &:first-child {
          @apply maz-rounded-r-none;

          margin-right: calc(-1 * 2px);
        }

        &:last-child {
          @apply maz-rounded-l-none;

          margin-left: calc(-1 * 2px);
        }
      }

      &__icon {
        @apply maz-text-base;
      }
    }

    &__input {
      & .m-input-wrapper {
        @apply maz-z-1 maz-rounded-none;
      }

      input {
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
