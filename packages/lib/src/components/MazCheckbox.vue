<script lang="ts" setup generic="T extends boolean | (string | number)[]">
import type { Color, Size } from './types'
import { computed, type HTMLAttributes, ref } from 'vue'
import CheckIcon from '../../icons/check.svg'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

export type CheckboxValue = string | number | boolean

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
  color?: Color
  /** The value of the checkbox when selected */
  value?: CheckboxValue
  /** The name of the checkbox */
  name?: string
  /** The size of the checkbox */
  size?: Size
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

const isChecked = computed(() =>
  typeof props.value !== 'boolean' && Array.isArray(props.modelValue)
    ? props.modelValue.includes(props.value as never)
    : typeof props.modelValue === 'boolean'
      ? props.modelValue
      : false,
)

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
  if (props.color === 'theme') {
    return 'var(--maz-color-bg)'
  }

  return `var(--maz-color-${props.color}-contrast)`
})
const checkboxSelectedColor = computed(() => {
  if (props.color === 'theme') {
    return 'var(--maz-color-bg-theme)'
  }

  return `var(--maz-color-${props.color})`
})
const checkboxBoxShadow = computed(() => {
  if (props.error) {
    return `var(--maz-color-danger)`
  }
  else if (props.warning) {
    return `var(--maz-color-warning)`
  }
  else if (props.success) {
    return `var(--maz-color-success)`
  }

  return ['black', 'transparent', 'theme'].includes(props.color)
    ? `var(--maz-color-muted)`
    : `var(--maz-color-${props.color}-alpha)`
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

const inputRef = ref<HTMLInputElement>()

function onBlur(event: FocusEvent) {
  inputRef.value?.dispatchEvent(new Event('blur'))
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  inputRef.value?.dispatchEvent(new Event('focus'))
  emits('focus', event)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-checkbox m-reset-css"
    :class="[{ '--disabled': disabled, '--error': error, '--warning': warning, '--success': success }, props.class]"
    tabindex="0"
    :style="[style, { '--checkbox-selected-color': checkboxSelectedColor, '--checkbox-box-shadow-color': checkboxBoxShadow }]"
    role="checkbox"
    :aria-checked="isChecked"
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
      <CheckIcon class="check-icon" :class="checkIconSize" :style="{ color: checkIconColor }" />
    </span>
    <div class="m-checkbox__text">
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
        :style="{ boxShadow: `0 0 0 0.125rem ${checkboxBoxShadow}` }"
      >{{ hint }}</span>
    </div>
  </label>
</template>

<style lang="postcss" scoped>
  .m-checkbox {
  @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

  .check-icon {
    @apply maz-scale-0 maz-transition-transform maz-duration-300 maz-ease-in-out;

    :deep(path) {
      stroke-width: 2.5;
    }
  }

  > span {
    @apply maz-relative maz-flex maz-rounded-md maz-border maz-border-border maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;
  }

  input {
    @apply maz-hidden;

    &:not(:checked) ~ span {
      @apply maz-bg-color dark:maz-bg-color-light;
    }

    &:checked ~ span {
      border-color: var(--checkbox-selected-color);
      background-color: var(--checkbox-selected-color);

      .check-icon {
        @apply maz-scale-100;
      }
    }

    &:disabled ~ span {
      @apply maz-bg-color-light dark:maz-bg-color-lighter;
    }
  }

  &.--disabled {
    @apply maz-cursor-not-allowed maz-text-muted;

    input:checked ~ span {
      @apply maz-border-border dark:maz-border-color-lighter;

      .check-icon {
        @apply maz-text-muted;
      }
    }
  }

  &:not(.--disabled) {
    @apply maz-cursor-pointer;

    &:hover > span,
    &:focus > span {
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
      @apply maz-text-danger-600;
    }

    &.--success {
      @apply maz-text-success-600;
    }

    &.--warning {
      @apply maz-text-warning-600;
    }
  }

  &.--error,
  &.--warning,
  &.--success {
    > span {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;
    }
  }
}
</style>
