<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue'
import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'
import type { Color, Size } from './types'
import CheckIcon from './../icons/check.svg'

export type { Color, Size }

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
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
})

const emits = defineEmits([
  /* emitted when value change */
  'update:model-value',
  /* emited when value change */
  'change',
])

export interface Props {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The model value of the checkbox */
  modelValue?: boolean | (string | number)[]
  /** The id of the checkbox */
  id?: string
  /** The color of the checkbox */
  color?: Color
  /** The value of the checkbox when selected */
  value?: string | number | boolean
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

const checkIconColor = computed(() => `var(--maz-color-${props.color}-contrast)`)
const checkboxSelectedColor = computed(() => `var(--maz-color-${props.color})`)
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

  return ['black', 'transparent'].includes(props.color)
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

  emits('update:model-value', newValue)
  emits('change', newValue)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-checkbox"
    :class="[{ '--disabled': disabled, '--error': error, '--warning': warning, '--success': success }, props.class]"
    tabindex="0"
    :style="style"
    role="checkbox"
    :aria-checked="isChecked"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      :checked="isChecked"
      v-bind="$attrs"
      tabindex="-1"
      :disabled="disabled"
      :name="name"
      type="checkbox"
      @change="emitValue(value ?? ($event?.target as HTMLInputElement)?.checked)"
    >
    <span>
      <CheckIcon class="check-icon" :class="checkIconSize" />
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
      >{{ hint }}</span>
    </div>
  </label>
</template>

<style lang="postcss" scoped>
  .m-checkbox {
  @apply maz-relative maz-inline-flex maz-items-center maz-gap-2 maz-align-top maz-outline-none;

  .check-icon {
    color: v-bind('checkIconColor');

    @apply maz-scale-0 maz-transition-transform maz-duration-300 maz-ease-in-out;

    :deep(path) {
      stroke-width: 2.5;
    }
  }

  > span {
    @apply maz-relative maz-flex maz-rounded-md maz-border maz-border-border maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center dark:maz-border-color-lighter;

    width: v-bind('checkboxSize');
    height: v-bind('checkboxSize');
  }

  input {
    @apply maz-hidden;

    &:not(:checked) ~ span {
      @apply maz-bg-color dark:maz-bg-color-light;
    }

    &:checked ~ span {
      border-color: v-bind('checkboxSelectedColor');
      background-color: v-bind('checkboxSelectedColor');

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

      box-shadow: 0 0 0 0.125rem v-bind('checkboxBoxShadow');
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

      box-shadow: 0 0 0 0.125rem v-bind('checkboxBoxShadow');
    }
  }
}
</style>
