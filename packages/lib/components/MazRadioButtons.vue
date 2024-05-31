<template>
  <div
    class="m-radio-buttons"
    :class="[`--${orientation}`, { '--no-wrap': noWrap, '--block': block }]"
  >
    <label
      v-for="(option, i) in options"
      :key="`option-${i}-${option.value.toString()}-${name}`"
      :for="`option-${i}-${option.value.toString()}-${name}`"
      class="m-radio-buttons__items maz-group"
      :class="[
        {
          '--is-selected': isSelected(option.value),
          '--elevation': elevation,
          '--equal-size': equalSize,
        },
        option.classes,
      ]"
      tabindex="0"
      :style="[
        isSelected(option.value)
          ? {
              color: `var(--maz-color-${color}-contrast)`,
              backgroundColor: `var(--maz-color-${color})`,
            }
          : {},
        option.style,
      ]"
      role="radio"
      :aria-checked="isSelected(option.value)"
      @keydown="keyboardHandler($event, option)"
    >
      <input
        :id="`option-${i}-${option.value.toString()}-${name}`"
        type="radio"
        :name="name"
        :value="option.value"
        class="maz-hidden"
        @change="selectOption(option)"
      />
      <div v-if="selector" class="m-radio-buttons__items__checkbox">
        <span
          :class="{
            '--is-selected': isSelected(option.value),
          }"
          :style="[
            isSelected(option.value)
              ? { backgroundColor: `var(--maz-color-${props.color}-600)` }
              : {},
          ]"
        >
          <Transition name="maz-radio-buttons-scale">
            <CheckCircleIcon v-show="isSelected(option.value)" class="maz-h-full maz-w-full" />
          </Transition>
        </span>
      </div>

      <!--
        @slot Label of the radio
          @binding {Boolean} selected - If the option is selected
          @binding {string | number | boolean} option - The value of the option
      -->
      <slot :option="option" :selected="isSelected(option.value)">
        {{ option.label }}
      </slot>
    </label>
  </div>
</template>

<script lang="ts" setup>
  import { type StyleValue, defineAsyncComponent } from 'vue'
  import type { Color } from './types'

  const CheckCircleIcon = defineAsyncComponent(() => import('./../icons/check.svg'))

  export type ButtonsRadioOption = {
    /** The label of the option */
    label: string
    /** The value of the option */
    value: string | number | boolean
    /** The classes to apply to the option */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classes?: any
    /** The style to apply to the option */
    style?: StyleValue
  } & Record<string, unknown>

  export type Props = {
    /** @model The value of the selected option */
    modelValue?: string | number | boolean
    /** The options to display */
    options: ButtonsRadioOption[]
    /** The name of the radio group */
    name?: string
    /** The color of the selected radio buttons */
    color?: Color
    /** Add elevation to the radio buttons */
    elevation?: boolean
    /**
     * The orientation of the radio buttons
     * @values 'row' | 'col'
     */
    orientation?: 'row' | 'col'
    /** Disable the wrap of the radio buttons */
    noWrap?: boolean
    /** Make all radio buttons the same size */
    equalSize?: boolean
    /** Display a selector icon */
    selector?: boolean
    /** The component will be displayed in full width */
    block?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    name: 'MazButtonsRadio',
    color: 'primary',
    elevation: false,
    orientation: 'row',
    noWrap: false,
    equalSize: false,
    selector: false,
    block: false,
  })

  const emits = defineEmits<{
    /**
     * Emitted when the selected option change
     * @property value The value of the selected option
     */
    (event: 'update:model-value', value: string | number | boolean): void
    /**
     * Emitted when the selected option change
     * @property value The value of the selected option
     */
    (event: 'change', value: string | number | boolean): void
  }>()

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
    @apply maz-inline-flex maz-gap-2 maz-align-top;

    &.--block {
      @apply maz-w-full;
    }

    &:not(.--no-wrap) {
      @apply maz-flex-wrap;
    }

    &.--row {
      @apply maz-flex-row;
    }

    &.--col {
      @apply maz-flex-col;
    }

    &__items {
      @apply maz-flex maz-cursor-pointer maz-gap-4 maz-rounded maz-border maz-border-color-light
        maz-bg-color maz-px-4 maz-py-2 maz-font-medium maz-transition-colors maz-duration-300;

      &.--elevation {
        @apply maz-elevation;
      }

      &__checkbox {
        @apply maz-flex maz-flex-center;

        span {
          @apply maz-flex maz-h-6 maz-w-6 maz-flex-none maz-rounded-full maz-border maz-border-color-light maz-bg-color-lighter maz-p-0.5 maz-text-white maz-transition-colors maz-duration-300 maz-flex-center dark:maz-border-color-lighter dark:maz-bg-color-light;

          transition: border-color 0s;

          &.--is-selected {
            @apply maz-border-transparent;
          }

          &:not(.--is-selected) {
            @apply group-hover:maz-bg-color;
          }
        }
      }

      &.--equal-size {
        @apply maz-flex-1;
      }

      &:not(.--is-selected) {
        @apply hover:maz-bg-color-light;
      }
    }
  }

  .maz-radio-buttons-scale-enter-active,
  .maz-radio-buttons-scale-leave-active {
    opacity: 1;
    z-index: 1;
    transition: all 300ms cubic-bezier(0.4, 0.52, 0.26, 0.9);
  }

  .maz-radio-buttons-scale-enter-from,
  .maz-radio-buttons-scale-leave-to {
    opacity: 0.4;
    z-index: 1;
    transform: scale(0);
  }
</style>
