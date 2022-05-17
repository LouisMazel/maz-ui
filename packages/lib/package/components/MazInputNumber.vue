<template>
  <div
    class="m-input-number maz-align-center"
    :class="[`m-input-number--${size}`]"
  >
    <MazBtn
      color="transparent"
      no-shadow
      :size="size"
      class="m-input-number__button m-input-number__decrement-button"
      :disabled="decrementDisabled || disabled"
      @click="decrement"
    >
      <MazIcon :src="MinusIcon" class="m-input-number__button__icon" />
    </MazBtn>
    <MazInput
      v-model.number="currentValue"
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
    />
    <MazBtn
      color="transparent"
      no-shadow
      :size="size"
      class="m-input-number__button m-input-number__increment-button"
      :disabled="incrementDisabled || disabled"
      @click="increment"
    >
      <MazIcon :src="PlusIcon" class="m-input-number__button__icon" />
    </MazBtn>
  </div>
</template>

<script lang="ts">
  export type { Size } from './types'
</script>

<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import type { Size } from './types'
  import MazBtn from './MazBtn.vue'
  import MazInput from './MazInput.vue'
  import MazIcon from './MazIcon.vue'
  import PlusIcon from '@package/icons/plus.svg'
  import MinusIcon from '@package/icons/minus.svg'

  const props = defineProps({
    modelValue: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
    max: { type: Number, default: Infinity },
    min: { type: Number, default: -Infinity },
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
    set: (value: number) => emitValue(value),
  })
  const checkValue = (value: number) => {
    if (value <= props.min) return props.min
    if (value >= props.max) return props.max
    else return value
  }
  const emitValue = (newValue: number) => {
    newValue = checkValue(newValue)
    if (currentValue.value === newValue) return
    emits('update:model-value', newValue)
  }
  emitValue(currentValue.value)
  const incrementDisabled = computed(() => props.modelValue >= props.max)
  const decrementDisabled = computed(() => props.modelValue <= props.min)
  const increment = () => {
    if (props.disabled || incrementDisabled.value) return
    currentValue.value = currentValue.value + 1 * props.step
  }
  const decrement = () => {
    if (props.disabled || decrementDisabled.value) return
    currentValue.value = currentValue.value - 1 * props.step
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

        &:first-child {
          @apply maz-rounded-r-none maz-border maz-border-color-lighter maz-px-2 maz-shadow-none;
          @apply maz-px-3 maz-py-0 !important;

          margin-right: calc(-1 * 2px);
        }

        &:last-child {
          @apply maz-rounded-l-none maz-border maz-border-color-lighter maz-px-2 maz-shadow-none;
          @apply maz-px-3 maz-py-0 !important;

          margin-left: calc(-1 * 2px);
        }
      }

      &__icon {
        @apply maz-h-4 maz-w-4;
      }
    }

    &__input {
      min-width: 120px;

      & .m-input-wrapper {
        @apply maz-z-1 maz-rounded-none;
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
