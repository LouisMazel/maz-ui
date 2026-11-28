<script lang="ts" setup generic="T extends string | number | boolean">
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types.ts'
import { computed, ref } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'

export interface MazRadioProps<T = string | number | boolean> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The id of the radio */
  id?: string
  /** @model The value of the radio */
  modelValue?: T
  /** The value of the radio */
  value: T
  /** The name of the radio */
  name: string
  /** The label of the radio */
  label?: string
  /** The color of the radio */
  color?: MazColor
  /** The size of the radio */
  size?: MazSize
  /** The disabled state of the radio */
  disabled?: boolean
  /** Whether there is an error with the input. */
  error?: boolean
  /** Whether the input is successful. */
  success?: boolean
  /** Whether there is a warning with the input. */
  warning?: boolean
  /** The hint text to display below the input. */
  hint?: string
}

const {
  class: classProp,
  id,
  modelValue,
  value,
  color = 'primary',
  disabled = false,
  error,
  success,
  warning,
} = defineProps<MazRadioProps<T>>()

const emits = defineEmits<{
  /**
   * Event emitted when value change
   * @property {string | number | boolean} value - selected value
   */
  'update:model-value': [value: T]
  /**
   * Event emitted when value change
   * @property {string | number | boolean} value - selected value
   */
  'change': [value: T]
  /**
   * Emitted when the radio lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the radio is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

const { size } = useGlobalConfig<{ size: MazSize }>('MazRadio', { size: 'md' })

const instanceId = useInstanceUniqId({
  componentName: 'MazRadio',
  providedId: id,
})

const isFocused = ref(false)

const isSelected = computed(() => modelValue === value)

const radioSize = computed(() => {
  switch (size.value) {
    case 'xl': {
      return '2.25rem'
    }
    case 'lg': {
      return '2rem'
    }
    case 'sm': {
      return '1.425rem'
    }
    case 'xs': {
      return '1.325rem'
    }
    case 'mini': {
      return '1.2rem'
    }
    default: {
      return '1.625rem'
    }
  }
})

const radioSelectedColor = computed(() => color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})`)
const radioBoxShadow = computed(() => {
  if (error && !isFocused.value) {
    return `var(--maz-destructive)`
  }
  else if (warning && !isFocused.value) {
    return `var(--maz-warning)`
  }
  else if (success && !isFocused.value) {
    return `var(--maz-success)`
  }

  return ['transparent', 'contrast', 'neutral'].includes(color)
    ? `var(--maz-muted)`
    : `color-mix(in srgb, var(--maz-${color}) 60%, transparent)`
})

function emitValue() {
  emits('update:model-value', value)
  emits('change', value)
}

function onBlur(event: FocusEvent) {
  isFocused.value = false
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  isFocused.value = true
  emits('focus', event)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-radio m-reset-css maz:relative maz:inline-flex maz:items-center maz:gap-2 maz:align-top maz:outline-hidden"
    :class="[{ '--selected': isSelected, '--error': error, '--warning': warning, '--success': success, 'maz:disabled-cursor maz:text-muted': disabled, 'maz:cursor-interactive': !disabled }, classProp]"
    :style="[style, { '--radio-size': radioSize, '--radio-selected-color': radioSelectedColor, '--radio-box-shadow': radioBoxShadow }]"
  >
    <input
      :id="instanceId"
      :value
      v-bind="$attrs"
      :disabled
      :name
      type="radio"
      :checked="isSelected"
      class="maz:sr-only maz:outline-hidden"
      @change="emitValue()"
      @blur="onBlur"
      @focus="onFocus"
    >

    <span>
      <span class="round" />
    </span>

    <!--
      @slot Label of the radio
        @binding {Boolean} is-selected - If the radio is selected
        @binding {string | number | boolean} value - The value of the radio
    -->
    <div class="m-radio__text maz:flex maz:flex-col maz:gap-0">
      <slot :is-selected="isSelected" :value="value as T">
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-radio__hint maz:text-body-sm" :class="{
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
  </label>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-radio {
  --m-radio-fast: calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1));
  --m-radio-normal: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));

  > span {
    @apply maz:relative maz:flex maz:rounded-full maz:border maz:border-divider maz:dark:border-divider-400 maz:flex-center;

    inline-size: var(--radio-size);
    block-size: var(--radio-size);
    transition:
      border-color var(--m-radio-fast) var(--maz-easing-out, ease-out),
      box-shadow var(--m-radio-fast) var(--maz-easing-out, ease-out);

    .round {
      @apply maz:h-[50%] maz:w-[50%] maz:scale-0 maz:rounded-full;

      background-color: var(--radio-selected-color);
      transition: scale calc(var(--m-radio-normal) * 0.7) var(--maz-easing-in, ease-in);
    }
  }

  &:not(.--selected) > span {
    @apply maz:bg-input;
  }

  &.--selected > span {
    border-color: var(--radio-selected-color);

    .round {
      @apply maz:scale-100;

      transition-duration: var(--m-radio-normal);
      transition-timing-function: var(--maz-easing-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
    }
  }

  &:has(input:disabled) {
    > span {
      @apply maz:bg-surface-600 maz:dark:bg-surface-400;
    }

    &.--selected > span {
      @apply maz:border-divider;

      .round {
        @apply maz:bg-muted;
      }
    }
  }

  &:has(input:focus-visible) > span {
    outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
    outline-offset: var(--maz-focus-ring-offset, 2px);
  }

  &:not(:has(input:disabled), .--selected) {
    &:hover > span {
      box-shadow: 0 0 0 0.125rem var(--radio-box-shadow);
    }
  }

  &.--error > span,
  &.--warning > span,
  &.--success > span {
    box-shadow: 0 0 0 0.125rem var(--radio-box-shadow);
  }
}
</style>
