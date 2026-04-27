<script lang="ts" setup generic="T extends string | number | boolean, Option extends MazRadioButtonsOption<T>">
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { ref } from 'vue'
import MazIcon from './MazIcon.vue'
import { getColor } from './types'

export type MazRadioButtonsOption<T = string | number | boolean> = {
  /** The label of the option */
  label: string
  /** The value of the option */
  value: T
  /** The classes to apply to the option */
  classes?: any
  /** The style to apply to the option */
  style?: HTMLAttributes['style']
} & Record<string, unknown>

export interface MazRadioButtonsProps<T = string | number | boolean, Option extends MazRadioButtonsOption<T> = MazRadioButtonsOption<T>> {
  /** @model The value of the selected option */
  modelValue?: T
  /** The options to display */
  options: Option[]
  /** The name of the radio group */
  name?: string
  /** The color of the selected radio buttons */
  color?: MazColor | 'background'
  /** Add elevation to the radio buttons */
  elevation?: boolean
  /**
   * The orientation of the radio buttons
   * @values 'row' | 'col'
   * @default 'row'
   */
  orientation?: 'row' | 'col'
  /** Disable the wrap of the radio buttons */
  wrap?: boolean
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
  /**
   * The size of the radio buttons
   * @default 'md'
   */
  size?: MazSize
}

const props = withDefaults(defineProps<MazRadioButtonsProps<T, Option>>(), {
  modelValue: undefined,
  name: 'MazButtonsRadio',
  color: 'primary',
  elevation: false,
  orientation: 'row',
  wrap: true,
  equalSize: false,
  selector: false,
  block: false,
  size: 'md',
})

const emits = defineEmits<{
  /**
   * Emitted when the selected option change
   * @property value The value of the selected option
   */
  'update:model-value': [value: Option['value']]
  /**
   * Emitted when the selected option change
   * @property value The value of the selected option
   */
  'change': [value: Option['value']]
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

function selectOption(option: Option) {
  emits('update:model-value', option.value)
  emits('change', option.value)
}

function isSelected(value: Option['value']) {
  return props.modelValue === value
}

function keyboardHandler(event: KeyboardEvent, option: Option) {
  if (['Space'].includes(event.code)) {
    event.preventDefault()
    selectOption(option)
  }
}

function getOptionId(option: Option, i: number) {
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

const SIZE_CLASS: Record<MazSize, string> = {
  mini: 'maz:px-1 maz:min-h-6 maz:text-xs',
  xs: 'maz:px-2 maz:min-h-8 maz:text-xs',
  sm: 'maz:px-3 maz:min-h-10 maz:text-sm',
  md: 'maz:px-4 maz:min-h-12',
  lg: 'maz:px-5 maz:min-h-14 maz:text-lg',
  xl: 'maz:px-6 maz:min-h-16 maz:text-xl',
}
</script>

<template>
  <div
    class="m-radio-buttons m-reset-css maz:inline-flex maz:gap-1 maz:align-top maz:flex-col"
    :class="{ 'maz:w-full': block }"
  >
    <div
      class="m-radio-buttons__wrapper maz:inline-flex maz:gap-2"
      :class="[
        `--${orientation}`,
        orientation === 'row' ? 'maz:flex-row' : 'maz:flex-col',
        { '--wrap': wrap, 'maz:flex-wrap': wrap, '--block': block },
      ]"
    >
      <label
        v-for="(option, i) in options"
        :key="getOptionId(option, i)"
        :for="getOptionId(option, i)"
        class="m-radio-buttons__items maz:group maz:flex maz:cursor-pointer maz:gap-4 maz:rounded maz:border maz:border-divider
        maz:bg-surface maz:px-4 maz:py-2 maz:font-medium maz:transition-colors maz:duration-300 maz:items-center"
        :class="[
          `--size-${size}`,
          SIZE_CLASS[size],
          {
            '--is-selected': isSelected(option.value),
            'maz:drop-shadow-md maz:shadow-elevation': elevation,
            '--equal-size': equalSize,
          },
          option.classes,
        ]"
        tabindex="0"
        :style="[
          isSelected(option.value)
            ? {
              color: `var(--maz-${getColor(color)}-foreground)`,
              backgroundColor: `var(--maz-${getColor(color)})`,
              borderColor: `var(--maz-${getColor(color)})`,
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
          class="maz:hidden"
          @change="selectOption(option)"
        >
        <div v-if="selector" class="m-radio-buttons__items__checkbox maz:flex maz:flex-center">
          <span
            class="maz:flex maz:h-6 maz:w-6 maz:flex-none maz:rounded-full maz:border maz:border-divider maz:p-0.5 maz:text-white maz:transition-colors maz:duration-300 maz:flex-center maz:bg-surface maz:dark:bg-surface-400"
            :class="{
              '--is-selected': isSelected(option.value),
            }"
            :style="[
              isSelected(option.value)
                ? {
                  backgroundColor: `var(--maz-${getColor(props.color)}-600)`,
                  color: `var(--maz-${getColor(props.color)}-foreground)`,
                }
                : {},
            ]"
          >
            <Transition name="maz-radio-buttons-scale">
              <MazIcon v-show="isSelected(option.value)" :icon="MazCheck" class="maz:size-full" />
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
      class="m-radio-buttons__hint maz:text-sm" :class="{
        '--error': error,
        '--success': success,
        '--warning': warning,
        'maz:text-destructive-600': error,
        'maz:text-success-600': success,
        'maz:text-warning-600': warning,
        'maz:text-muted': !error && !success && !warning,
      }"
    >{{ hint }}</span>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-radio-buttons {
  &__items {
    &__checkbox {
      span {
        transition: border-color 0s;

        &.--is-selected {
          @apply maz:border-transparent;
        }

        &:not(.--is-selected) {
          @apply maz:group-hover:bg-surface;
        }
      }
    }

    &.--equal-size {
      @apply maz:flex-1;
    }

    &:not(.--is-selected) {
      @apply maz:hover:bg-surface-600 maz:dark:hover:bg-surface-400;
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
