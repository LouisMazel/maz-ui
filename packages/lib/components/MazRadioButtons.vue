<template>
  <div class="m-radio-buttons" :class="[orientation === 'row' ? 'maz-flex-row' : 'maz-flex-col']">
    <label
      v-for="(option, i) in options"
      :key="i"
      :for="option.value.toString()"
      class="m-radio-buttons__items"
      :class="{
        '--is-selected': isSelected(option.value),
        'maz-elevation': !noElevation,
      }"
      tabindex="0"
      :style="
        isSelected(option.value)
          ? {
              color: `var(--maz-color-${color}-contrast)`,
              backgroundColor: `var(--maz-color-${color})`,
            }
          : undefined
      "
      role="radio"
      :aria-checked="isSelected(option.value)"
      @keydown="keyboardHandler($event, option)"
    >
      <input
        :id="option.value.toString()"
        type="radio"
        :name="name"
        :value="option.value"
        class="maz-hidden"
        @change="selectOption(option)"
      />
      <slot :option="option" :selected="isSelected(option.value)">
        {{ option.label }}
      </slot>
    </label>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import type { Color } from './types'

  export interface ButtonsRadioOption {
    label: string
    value: string | number
  }

  const props = defineProps({
    modelValue: { type: [String, Number], default: undefined },
    options: { type: Array as PropType<ButtonsRadioOption[]>, required: true },
    name: {
      type: String as PropType<HTMLInputElement['name']>,
      default: 'MazButtonsRadio',
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
    noElevation: { type: Boolean, default: false },
    orientation: { type: String as PropType<'row' | 'col'>, default: 'row' },
  })

  const emits = defineEmits(['update:model-value', 'change'])

  function selectOption(option: ButtonsRadioOption) {
    emits('update:model-value', option.value)
  }

  function isSelected(value: ButtonsRadioOption['value']) {
    return props.modelValue === value
  }

  function keyboardHandler(event: KeyboardEvent, option: ButtonsRadioOption) {
    if (['Space'].includes(event.code)) {
      event.preventDefault()
      selectOption(option)
    }
  }
</script>

<style lang="postcss" scoped>
  .m-radio-buttons {
    @apply maz-flex maz-flex-wrap maz-gap-2;

    &__items {
      @apply maz-cursor-pointer maz-rounded maz-px-4 maz-py-2
        maz-font-medium maz-transition-colors maz-duration-300 maz-elevation;

      &:not(.--is-selected) {
        @apply hover:maz-bg-color-light;
      }
    }
  }

  html.dark {
    .m-radio-buttons__items:not(.--is-selected) {
      @apply maz-bg-color-light hover:maz-bg-color-lighter;
    }
  }
</style>
