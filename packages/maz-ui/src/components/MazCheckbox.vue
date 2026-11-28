<script lang="ts" setup generic="T extends boolean | (string | number)[]">
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types.ts'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'

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
  /**
   * Mixed state (a dash instead of the check, `aria-checked="mixed"`), for a "select all" checkbox
   * whose children are partly selected. It does not change the model: set it from the children
   * @default false
   */
  indeterminate?: boolean
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

const {
  class: classProp,
  modelValue,
  id,
  color = 'primary',
  value,
  name = 'm-checkbox',
  disabled,
  indeterminate = false,
  error,
  success,
  warning,
} = defineProps<MazCheckboxProps<T>>()

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

const { size } = useGlobalConfig<{ size: MazSize }>('MazCheckbox', { size: 'md' })

const instanceId = useInstanceUniqId({
  componentName: 'MazCheckbox',
  providedId: id,
})

const isFocused = ref(false)
const inputRef = ref<HTMLInputElement>()

function syncIndeterminate() {
  if (inputRef.value)
    inputRef.value.indeterminate = indeterminate
}

onMounted(syncIndeterminate)
watch(() => indeterminate, syncIndeterminate, { flush: 'post' })

const isChecked = computed(() => {
  if (typeof value !== 'boolean' && Array.isArray(modelValue)) {
    return modelValue.includes(value as never)
  }

  else if (typeof modelValue === 'boolean') {
    return modelValue
  }

  return false
})

const checkboxSize = computed(() => {
  switch (size.value) {
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
  switch (size.value) {
    case 'xl': {
      return 'maz:text-2xl'
    }
    case 'lg': {
      return 'maz:text-xl'
    }
    case 'sm': {
      return 'maz:text-base'
    }
    case 'xs': {
      return 'maz:text-sm'
    }
    case 'mini': {
      return 'maz:text-xs'
    }
    default: {
      return 'maz:text-lg'
    }
  }
})

const checkIconColor = computed(() => {
  if (color === 'contrast') {
    return 'var(--maz-surface)'
  }

  if (color === 'neutral') {
    return 'var(--maz-neutral)'
  }

  return `var(--maz-${color}-foreground)`
})
const checkboxSelectedColor = computed(() => {
  if (color === 'contrast') {
    return 'var(--maz-contrast)'
  }

  if (color === 'neutral') {
    return 'var(--maz-neutral-foreground)'
  }

  return `var(--maz-${color})`
})
const checkboxBoxShadow = computed(() => {
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

function getNewValue(newValue: boolean | string | number) {
  if (
    typeof newValue === 'boolean'
    && (typeof modelValue === 'boolean'
      || modelValue === undefined
      || modelValue === null)
  ) {
    return !modelValue
  }
  else if (Array.isArray(modelValue) && typeof newValue !== 'boolean') {
    return modelValue.includes(newValue)
      ? modelValue.filter(v => v !== newValue)
      : [...modelValue, newValue]
  }
  else {
    return [newValue]
  }
}

function emitValue(value: boolean | string | number) {
  const newValue = getNewValue(value)

  emits('update:model-value', newValue as T)
  emits('change', newValue as T)
  nextTick(syncIndeterminate)
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
    class="m-checkbox m-reset-css maz:relative maz:inline-flex maz:items-center maz:gap-2 maz:align-top maz:outline-hidden"
    :class="[
      { '--indeterminate': indeterminate, '--error': error, '--warning': warning, '--success': success, 'maz:disabled-cursor maz:text-muted': disabled, 'maz:cursor-interactive': !disabled },
      classProp,
    ]"
    :style="[style, { '--checkbox-selected-color': checkboxSelectedColor, '--checkbox-box-shadow-color': checkboxBoxShadow }]"
  >
    <input
      :id="instanceId"
      ref="inputRef"
      :checked="isChecked"
      v-bind="$attrs"
      :aria-checked="indeterminate ? 'mixed' : undefined"
      :disabled
      :name
      type="checkbox"
      @change="emitValue(value ?? ($event?.target as HTMLInputElement)?.checked)"
      @blur="onBlur"
      @focus="onFocus"
    >
    <span :style="{ width: checkboxSize, height: checkboxSize }">
      <MazDrawnIcon
        :name="indeterminate ? 'minus' : 'check'"
        :drawn="isChecked || indeterminate"
        :stroke-width="2.5"
        class="check-icon maz:relative"
        :class="[isChecked || indeterminate ? 'maz:scale-100' : 'maz:scale-0', checkIconSize]"
        :style="{ color: checkIconColor }"
      />
    </span>
    <div v-if="label || hasSlotContent($slots.default) || hint" class="m-checkbox__text maz:flex maz:flex-col maz:gap-0">
      <slot :value>
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-checkbox__hint maz:text-body-sm" :class="{
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

.m-checkbox {
  --m-checkbox-fast: calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1));
  --m-checkbox-normal: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));

  > span {
    @apply maz:relative maz:flex maz:rounded-sm maz:border maz:border-divider maz:dark:border-divider-400 maz:flex-center;

    transition:
      border-color var(--m-checkbox-fast) var(--maz-easing-out, ease-out),
      box-shadow var(--m-checkbox-fast) var(--maz-easing-out, ease-out);

    /* The ink grows from the center when checked and shrinks faster when unchecked */
    &::before {
      position: absolute;
      inset: calc(var(--maz-border-width, 1px) * -1);
      border-radius: inherit;
      background-color: var(--checkbox-selected-color);
      content: '';
      scale: 0;
      transition: scale calc(var(--m-checkbox-normal) * 0.7) var(--maz-easing-in, ease-in);
    }
  }

  input {
    @apply maz:sr-only maz:outline-hidden;

    &:not(:checked) ~ span {
      @apply maz:bg-input;
    }

    &:checked ~ span,
    &[aria-checked='mixed'] ~ span {
      border-color: var(--checkbox-selected-color);

      &::before {
        scale: 1;
        transition-duration: var(--m-checkbox-normal);
        transition-timing-function: var(--maz-easing-out, ease-out);
      }
    }

    &:disabled ~ span {
      @apply maz:bg-surface-600 maz:dark:bg-surface-300;

      &::before {
        display: none;
      }
    }

    &:focus-visible ~ span {
      outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
      outline-offset: var(--maz-focus-ring-offset, 2px);
    }
  }

  &:has(input:disabled) {
    svg {
      @apply maz:text-muted!;
    }

    input:checked ~ span,
    input[aria-checked='mixed'] ~ span {
      @apply maz:border-divider;

      .check-icon {
        @apply maz:text-muted;
      }
    }
  }

  &:not(:has(input:disabled)) {
    &:hover > span,
    &.--error > span,
    &.--warning > span,
    &.--success > span {
      box-shadow: 0 0 0 0.125rem var(--checkbox-box-shadow-color);
    }
  }
}
</style>
