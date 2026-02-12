<script lang="ts" setup generic="T extends boolean | (string | number)[]">
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { MazCheck } from '@maz-ui/icons/static'
import { computed, ref } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

export type MazCheckboxValue = string | number | boolean

export interface MazCheckboxProps<T = boolean | (string | number)[]> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The model value of the checkbox */
  modelValue?: T
  /** The id of the checkbox */
  id?: string
  /** The color of the checkbox */
  color?: MazColor
  /** The value of the checkbox when selected */
  value?: MazCheckboxValue
  /** The name of the checkbox */
  name?: string
  /** The size of the checkbox */
  size?: MazSize
  /** Text label */
  label?: string
  /** If the checkbox is disabled */
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

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<MazCheckboxProps<T>>(),
  {
    style: undefined,
    class: undefined,
    modelValue: undefined,
    label: undefined,
    id: undefined,
    color: 'primary',
    value: undefined,
    name: 'm-checkbox',
    size: 'md',
    disabled: false,
    tabindex: 0,
  },
)

const emits = defineEmits<{
  /**
   * Emitted when the model value change
   * @property value The new value
   */
  'update:model-value': [value: T]
  /**
   * Emitted when the model value change
   * @property value The new value
   */
  'change': [value: T]
  /**
   * Emitted when the checkbox lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the checkbox is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

const instanceId = useInstanceUniqId({
  componentName: 'MazCheckbox',
  providedId: props.id,
})

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const isChecked = computed(() => {
  if (typeof props.value !== 'boolean' && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value as never)
  }

  else if (typeof props.modelValue === 'boolean') {
    return props.modelValue
  }

  return false
})

const checkboxSize = computed(() => {
  switch (props.size) {
    case 'xl': {
      return '2rem'
    }
    case 'lg': {
      return '1.75rem'
    }
    case 'sm': {
      return '1.25rem'
    }
    case 'xs': {
      return '1rem'
    }
    case 'mini': {
      return '0.75rem'
    }

    default: {
      return '1.5rem'
    }
  }
})

const checkIconSize = computed(() => {
  switch (props.size) {
    case 'xl': {
      return 'maz-text-2xl'
    }
    case 'lg': {
      return 'maz-text-xl'
    }
    case 'sm': {
      return 'maz-text-base'
    }
    case 'xs': {
      return 'maz-text-sm'
    }
    case 'mini': {
      return 'maz-text-xs'
    }
    default: {
      return 'maz-text-lg'
    }
  }
})

const checkIconColor = computed(() => {
  if (props.color === 'contrast') {
    return 'hsl(var(--maz-background))'
  }

  return `hsl(var(--maz-${props.color}-foreground))`
})
const checkboxSelectedColor = computed(() => {
  if (props.color === 'contrast') {
    return 'hsl(var(--maz-contrast))'
  }

  return `hsl(var(--maz-${props.color}))`
})
const checkboxBoxShadow = computed(() => {
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
    emitValue(props.value ?? !props.modelValue)
  }
}

function getNewValue(value: boolean | string | number) {
  if (
    typeof value === 'boolean'
    && (typeof props.modelValue === 'boolean'
      || props.modelValue === undefined
      || props.modelValue === null)
  ) {
    return !props.modelValue
  }
  else if (Array.isArray(props.modelValue) && typeof value !== 'boolean') {
    return props.modelValue.includes(value)
      ? props.modelValue.filter(v => v !== value)
      : [...props.modelValue, value]
  }
  else {
    return [value]
  }
}

function emitValue(value: boolean | string | number) {
  const newValue = getNewValue(value)

  emits('update:model-value', newValue as T)
  emits('change', newValue as T)
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
    class="m-checkbox m-reset-css"
    :class="[{ '--error': error, '--warning': warning, '--success': success }, props.class]"
    :style="[style, { '--checkbox-selected-color': checkboxSelectedColor, '--checkbox-box-shadow-color': checkboxBoxShadow }]"
    role="checkbox"
    :aria-checked="isChecked"
    tabindex="0"
    @keydown="keyboardHandler"
    @blur="onBlur"
    @focus="onFocus"
  >
    <input
      :id="instanceId"
      ref="inputRef"
      :checked="isChecked"
      v-bind="$attrs"
      tabindex="-1"
      :disabled
      :name
      type="checkbox"
      @change="emitValue(value ?? ($event?.target as HTMLInputElement)?.checked)"
    >
    <span :style="{ width: checkboxSize, height: checkboxSize }">
      <MazCheck class="check-icon" :class="checkIconSize" :style="{ color: checkIconColor }" />
    </span>
    <div v-if="label || $slots.default || hint" class="m-checkbox__text">
      <slot :value>
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-checkbox__hint" :class="{
          '--error': error,
          '--success': success,
          '--warning': warning,
        }"
      >{{ hint }}</span>
    </div>
  </label>
</template>

<style scoped>
.m-checkbox {
  @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

  .check-icon {
    @apply maz-scale-0 maz-transition-transform maz-duration-300 maz-ease-in-out;

    :deep(path) {
      stroke-width: 2.5;
    }
  }

  > span {
    @apply maz-relative maz-flex maz-rounded-md maz-border maz-border-divider dark:maz-border-divider-400 maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center;
  }

  input {
    @apply maz-hidden;

    &:not(:checked) ~ span {
      @apply maz-bg-surface dark:maz-bg-surface-400;
    }

    &:checked ~ span {
      border-color: var(--checkbox-selected-color);
      background-color: var(--checkbox-selected-color);

      .check-icon {
        @apply maz-scale-100;
      }
    }

    &:disabled ~ span {
      @apply maz-bg-surface-600 dark:maz-bg-surface-300;
    }
  }

  &:has(input:disabled) {
    @apply maz-cursor-not-allowed maz-text-muted;

    svg {
      @apply !maz-text-muted;
    }

    input:checked ~ span {
      @apply maz-border-divider;

      .check-icon {
        @apply maz-text-muted;
      }
    }
  }

  &:not(:has(input:disabled)) {
    @apply maz-cursor-pointer;

    &:hover > span,
    &:focus > span,
    &.--error > span,
    &.--warning > span,
    &.--success > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;

      box-shadow: 0 0 0 0.125rem var(--checkbox-box-shadow-color);
    }
  }

  &__text {
    @apply maz-flex maz-flex-col maz-gap-0;
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

  /* &.--error,
  &.--warning,
  &.--success {
    > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;
    }
  } */
}
</style>
