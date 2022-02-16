<template>
  <div
    class="maz-input-number maz-align-center"
    :class="[`maz-input-number--${size}`]"
  >
    <MazBtn
      color="transparent"
      no-shadow
      :size="size"
      class="maz-input-number__button maz-input-number__decrement-button"
      :disabled="decrementDisabled || disabled"
      icon-name="remove"
      @click="decrement"
    />
    <MazInput
      v-model.number="currentValue"
      type="number"
      class="maz-input-number__input maz-flex-1"
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
      class="maz-input-number__button maz-input-number__increment-button"
      :disabled="incrementDisabled || disabled"
      icon-name="add"
      @click="increment"
    />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'

  export default defineComponent({
    name: 'MazInputNumber',
    props: {
      value: { type: Number, required: true },
      disabled: { type: Boolean, default: false },
      max: { type: Number, default: Infinity },
      min: { type: Number, default: -Infinity },
      step: { type: Number, default: 1 },
      size: { type: String, default: 'md' },
    },
    setup(props, { emit }) {
      const currentValue = computed({
        get: () => props.value,
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

        emit('input', newValue)
      }

      emitValue(currentValue.value)

      const incrementDisabled = computed(() => props.value >= props.max)
      const decrementDisabled = computed(() => props.value <= props.min)

      const increment = () => {
        if (props.disabled || incrementDisabled.value) return

        currentValue.value = currentValue.value + 1 * props.step
      }

      const decrement = () => {
        if (props.disabled || decrementDisabled.value) return

        currentValue.value = currentValue.value - 1 * props.step
      }

      return {
        decrementDisabled,
        incrementDisabled,
        currentValue,
        increment,
        decrement,
      }
    },
  })
</script>

<style lang="scss">
  .maz-input-number {
    display: inline-flex;

    &__button {
      border-color: var(--maz-border-color);
      border-width: var(--maz-border-width);
      border-style: solid;
      box-shadow: none !important;

      &::before {
        content: none !important;
      }

      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-right: calc(-1 * var(--maz-border-width));
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        margin-left: calc(-1 * var(--maz-border-width));
      }
    }

    &__input {
      border-radius: 0;
      z-index: 1;

      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }
    }
  }
</style>
