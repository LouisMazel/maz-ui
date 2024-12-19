<script lang="ts" setup generic="T extends string | number | boolean">
import type { Color } from './types'
import { defineAsyncComponent, ref, type StyleValue } from 'vue'

export type MazRadioButtonsOption<T = string | number | boolean> = {
  /** The label of the option */
  label: string
  /** The value of the option */
  value: T
  /** The classes to apply to the option */
  classes?: any
  /** The style to apply to the option */
  style?: StyleValue
} & Record<string, unknown>

export interface MazRadioButtonsProps<T = string | number | boolean> {
  /** @model The value of the selected option */
  modelValue?: T
  /** The options to display */
  options: MazRadioButtonsOption<T>[]
  /** The name of the radio group */
  name?: string
  /** The color of the selected radio buttons */
  color?: Color
  /** Add elevation to the radio buttons */
  elevation?: boolean
  /**
   * The orientation of the radio buttons
   * @values 'row' | 'col'
   * @default 'row'
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
  /** Whether there is an error with the input. */
  error?: boolean
  /** Whether the input is successful. */
  success?: boolean
  /** Whether there is a warning with the input. */
  warning?: boolean
  /** The hint text to display below the input. */
  hint?: string
}

const props = withDefaults(defineProps<MazRadioButtonsProps<T>>(), {
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
  'update:model-value': [value: T]
  /**
   * Emitted when the selected option change
   * @property value The value of the selected option
   */
  'change': [value: T]
  /**
   * Emitted when the a radio button lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the a radio button is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

const CheckCircleIcon = defineAsyncComponent(() => import('../../icons/check.svg'))

function selectOption(option: MazRadioButtonsOption<T>) {
  emits('update:model-value', option.value)
}

function isSelected(value: MazRadioButtonsOption<T>['value']) {
  return props.modelValue === value
}

function keyboardHandler(event: KeyboardEvent, option: MazRadioButtonsOption<T>) {
  if (['Space'].includes(event.code)) {
    event.preventDefault()
    selectOption(option)
  }
}

function getOptionId(option: MazRadioButtonsOption<T>, i: number) {
  return `option-${i}-${option.value.toString()}-${props.name}`
}

const inputRef = ref<HTMLInputElement[]>()

function onBlur(index: number, event: FocusEvent) {
  inputRef.value?.[index]?.dispatchEvent(new Event('blur'))
  emits('blur', event)
}
function onFocus(index: number, event: FocusEvent) {
  inputRef.value?.[index]?.dispatchEvent(new Event('focus'))
  emits('focus', event)
}
</script>

<template>
  <div
    class="m-radio-buttons m-reset-css"
  >
    <div class="m-radio-buttons__wrapper" :class="[`--${orientation}`, { '--no-wrap': noWrap, '--block': block }]">
      <label
        v-for="(option, i) in options"
        :key="getOptionId(option, i)"
        :for="getOptionId(option, i)"
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
        @blur="onBlur(i, $event)"
        @focus="onFocus(i, $event)"
      >
        <input
          :id="getOptionId(option, i)"
          ref="inputRef"
          type="radio"
          tabindex="-1"
          :name="name"
          :value="option.value"
          class="maz-hidden"
          @change="selectOption(option)"
        >
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
    <span
      v-if="hint"
      class="m-radio-buttons__hint" :class="{
        '--error': error,
        '--success': success,
        '--warning': warning,
      }"
    >{{ hint }}</span>
  </div>
</template>

<style lang="postcss" scoped>
  .m-radio-buttons {
  @apply maz-inline-flex maz-gap-1 maz-align-top maz-flex-col;

  &__wrapper {
    @apply maz-inline-flex maz-gap-2;

    &:not(.--no-wrap) {
      @apply maz-flex-wrap;
    }

    &.--row {
      @apply maz-flex-row;
    }

    &.--col {
      @apply maz-flex-col;
    }
  }

  &.--block {
    @apply maz-w-full;
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

  &__hint {
    @apply maz-text-sm maz-text-muted;

    &.--error {
      @apply maz-text-danger-600;
    }

    &.--success {
      @apply maz-text-success-600;
    }

    &.--warning {
      @apply maz-text-warning-600;
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
