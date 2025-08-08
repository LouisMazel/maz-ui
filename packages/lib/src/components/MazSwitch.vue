<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { computed, ref } from 'vue'

import { useInstanceUniqId } from '../composables/useInstanceUniqId'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazSwitchProps>(), {
  style: undefined,
  class: undefined,
  modelValue: false,
  id: undefined,
  disabled: false,
  name: undefined,
  color: 'primary',
})

const emits = defineEmits<{
  /**
   * Emitted when the model value changes
   * @property {boolean} value - The new value
   */
  'update:model-value': [value: boolean]
  /**
   * Emitted when the model value changes
   * @property {boolean} value - The new value
   */
  'change': [value: boolean]
  /**
   * Emitted when the switch lost focus
   * @property {FocusEvent} value - The focus event
   */
  'blur': [value: FocusEvent]
  /**
   * Emitted when the switch is focused
   * @property {FocusEvent} value - The focus event
   */
  'focus': [value: FocusEvent]
}>()

export interface MazSwitchProps {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** The model value of the switch */
  modelValue?: boolean
  /** The id of the switch */
  id?: string
  /** If the switch is disabled */
  disabled?: boolean
  /** The name of the switch */
  name?: string
  /** Text label */
  label?: string
  /** The color of the switch */
  color?: MazColor
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
  componentName: 'MazSwitch',
  providedId: props.id,
})

const bgColorClassVar = computed(() => {
  return `hsl(var(--maz-${props.color}))`
})

function emit() {
  emits('update:model-value', !props.modelValue)
  emits('change', !props.modelValue)
}

const inputRef = ref<HTMLInputElement>()

function keyboardHandler(event: KeyboardEvent) {
  if (['Space'].includes(event.code)) {
    event.preventDefault()
    emit()
  }
}

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
    class="m-switch m-reset-css"
    :class="[{ '--is-disabled': disabled }, props.class]"
    role="switch"
    :style="[style, { '--switch-color': bgColorClassVar }]"
    :aria-checked="modelValue"
    tabindex="0"
    @blur="onBlur"
    @focus="onFocus"
    @keydown="keyboardHandler"
  >
    <input
      :id="instanceId"
      v-bind="$attrs"
      ref="inputRef"
      type="checkbox"
      :name="name"
      tabindex="-1"
      :checked="modelValue"
      :aria-label="label"
      :disabled="disabled"
      class="m-switch__input"
      @change="emit"
    >
    <span class="m-switch__toggle" />

    <span v-if="$slots.default || label || hint" class="m-switch__text">
      <!--
        @slot The label of the switch
          @binding {Boolean} value - The value of the switch
      -->
      <slot :value="modelValue">
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-switch__hint" :class="{
          '--error': error,
          '--success': success,
          '--warning': warning,
        }"
      >{{ hint }}</span>
    </span>
  </label>
</template>

<style lang="postcss">
  .m-switch {
  @apply maz-relative maz-inline-flex maz-cursor-pointer maz-items-center maz-gap-2 maz-align-top;

  &:has(input:disabled) {
    @apply maz-cursor-not-allowed;
  }

  &__input {
    @apply maz-absolute;

    left: -9999px;
  }

  &__toggle {
    @apply maz-h-6 maz-w-12 maz-relative;

    &::before {
      content: '';
      transition: all 200ms ease-in-out;

      @apply maz-relative maz-left-0 maz-top-0.5 maz-block maz-h-6 maz-w-[3rem] maz-rounded-full;
      @apply maz-bg-surface-600 dark:maz-bg-surface-400 maz-border maz-border-solid maz-border-divider;
    }

    &::after {
      content: '';

      @apply maz-absolute maz-left-0.5 maz-top-1 maz-block maz-h-5 maz-w-5 maz-rounded-full maz-bg-surface;

      box-shadow: 0 0 4px 0 hsl(0deg 0% 0% / 20%);
      transition: all 200ms ease-in-out;
    }
  }

  &__input:checked + .m-switch__toggle {
    &::after {
      @apply maz-translate-x-6;
    }

    &::before {
      background-color: var(--switch-color);
    }
  }

  &__input:disabled {
    + .m-switch__toggle {
      &::before {
        @apply maz-bg-surface-600 dark:maz-bg-surface-400;
      }

      &::after {
        @apply maz-bg-surface-700 dark:maz-bg-surface-300;

        box-shadow: none;
      }
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
}
</style>
