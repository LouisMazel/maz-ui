<script lang="ts" setup generic="T extends string | number | boolean">
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { computed, ref } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

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

const props = withDefaults(
  defineProps<MazRadioProps<T>>(),
  {
    style: undefined,
    class: undefined,
    id: undefined,
    modelValue: undefined,
    label: undefined,
    color: 'primary',
    size: 'md',
    disabled: false,
  },
)

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

const instanceId = useInstanceUniqId({
  componentName: 'MazRadio',
  providedId: props.id,
})

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const isSelected = computed(() => props.modelValue === props.value)

const radioSize = computed(() => {
  switch (props.size) {
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

const radioSelectedColor = computed(() => `hsl(var(--maz-${props.color}))`)
const radioBoxShadow = computed(() => {
  if (props.error && !isFocused.value) {
    return `hsl(var(--maz-destructive))`
  }
  else if (props.warning && !isFocused.value) {
    return `hsl(var(--maz-warning))`
  }
  else if (props.success && !isFocused.value) {
    return `hsl(var(--maz-success))`
  }

  return ['transparent', 'contrast'].includes(props.color)
    ? `hsl(var(--maz-muted))`
    : `hsl(var(--maz-${props.color}) / 60%)`
})

function keyboardHandler(event: KeyboardEvent) {
  if (['Space'].includes(event.code)) {
    event.preventDefault()
    emitValue()
  }
}

function emitValue() {
  emits('update:model-value', props.value)
  emits('change', props.value)
}

function onBlur(event: FocusEvent) {
  isFocused.value = false
  inputRef.value?.dispatchEvent(new Event('blur'))
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  isFocused.value = true
  inputRef.value?.dispatchEvent(new Event('focus'))
  emits('focus', event)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-radio m-reset-css"
    :class="[{ '--selected': isSelected, '--error': error, '--warning': warning, '--success': success }, props.class]"
    tabindex="0"
    role="radio"
    :style="[style, { '--radio-size': radioSize, '--radio-selected-color': radioSelectedColor, '--radio-box-shadow': radioBoxShadow }]"
    :aria-checked="isSelected"
    @blur="onBlur"
    @focus="onFocus"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      ref="inputRef"
      :value
      v-bind="$attrs"
      tabindex="-1"
      :disabled
      :name
      type="radio"
      :checked="isSelected"
      @change="emitValue()"
    >

    <span>
      <span class="round" />
    </span>

    <!--
      @slot Label of the radio
        @binding {Boolean} is-selected - If the radio is selected
        @binding {string | number | boolean} value - The value of the radio
    -->
    <div class="m-radio__text">
      <slot :is-selected="isSelected" :value="value as T">
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-radio__hint" :class="{
          '--error': error,
          '--success': success,
          '--warning': warning,
        }"
      >{{ hint }}</span>
    </div>
  </label>
</template>

<style scoped>
  .m-radio {
  @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

  > span {
    @apply maz-relative maz-flex maz-rounded-full maz-border maz-border-divider dark:maz-border-divider-400 maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center;

    width: var(--radio-size);
    height: var(--radio-size);

    .round {
      @apply maz-h-[50%] maz-w-[50%] maz-scale-0 maz-rounded-full maz-transition-transform maz-duration-300 maz-ease-in-out;

      background-color: var(--radio-selected-color);
    }
  }

  &:not(.--selected) > span {
    @apply maz-bg-surface dark:maz-bg-surface-400;
  }

  &.--selected > span {
    border-color: var(--radio-selected-color);

    .round {
      @apply maz-scale-100;
    }
  }

  &__text {
    @apply maz-flex maz-flex-col maz-gap-0;
  }

  input {
    @apply maz-hidden;
  }

  &:has(input:disabled) {
    @apply maz-cursor-not-allowed maz-text-muted;

    > span {
      @apply maz-bg-surface-600 dark:maz-bg-surface-400;
    }

    &.--selected {
      > span {
        @apply maz-border-divider;

        .round {
          @apply maz-bg-muted;
        }
      }
    }
  }

  &__hint {
    @apply maz-text-sm maz-text-muted;

    &.--error {
      @apply maz-text-destructive-600;
    }

    &.--success {
      @apply maz-text-success-600;
    }

    &.--warning {
      @apply maz-text-warning-600;
    }
  }

  &:not(:has(input:disabled)),
  &:not(.--selected) {
    @apply maz-cursor-pointer;

    &:hover > span,
    &:focus > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;

      box-shadow: 0 0 0 0.125rem var(--radio-box-shadow);
    }
  }

  &.--error,
  &.--warning,
  &.--success {
    > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;

      box-shadow: 0 0 0 0.125rem var(--radio-box-shadow);
    }
  }
}
</style>
