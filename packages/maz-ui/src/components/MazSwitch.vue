<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { computed } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

import { hasSlotContent } from '../utils/hasSlotContent'

defineOptions({
  inheritAttrs: false,
})

const {
  style,
  class: classProp,
  modelValue = false,
  id,
  disabled,
  name,
  color = 'primary',
  label,
  error,
  success,
  warning,
  hint,
} = defineProps<MazSwitchProps>()

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
  providedId: id,
})

const bgColorClassVar = computed(() => {
  return `var(--maz-${color})`
})

const fgColorClassVar = computed(() => {
  return `var(--maz-${color}-foreground, var(--maz-foreground))`
})

function emit() {
  emits('update:model-value', !modelValue)
  emits('change', !modelValue)
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
}
function onFocus(event: FocusEvent) {
  emits('focus', event)
}
</script>

<template>
  <label
    :for="instanceId"
    class="m-switch m-reset-css maz:relative maz:inline-flex maz:cursor-interactive maz:items-center maz:gap-2 maz:align-top"
    :class="[{ '--is-disabled': disabled, 'maz:disabled-cursor': disabled }, classProp]"
    :style="[style, { '--switch-color': bgColorClassVar, '--switch-foreground': fgColorClassVar }]"
  >
    <input
      :id="instanceId"
      v-bind="$attrs"
      type="checkbox"
      role="switch"
      :name="name"
      :checked="modelValue"
      :aria-label="$attrs['aria-label'] as string ?? label"
      :disabled="disabled"
      class="m-switch__input maz:absolute"
      @change="emit"
      @blur="onBlur"
      @focus="onFocus"
    >
    <span class="m-switch__toggle maz:relative maz:h-6 maz:w-12" />

    <span v-if="hasSlotContent($slots.default) || label || hint" class="m-switch__text maz:flex maz:flex-col maz:gap-0">
      <!--
        @slot The label of the switch
          @binding {Boolean} value - The value of the switch
      -->
      <slot :value="modelValue">
        {{ label }}
      </slot>

      <span
        v-if="hint"
        class="m-switch__hint maz:text-body-sm" :class="{
          '--error': error,
          '--success': success,
          '--warning': warning,
          'maz:text-destructive-600': error,
          'maz:text-success-600': success,
          'maz:text-warning-600': warning,
          'maz:text-muted': !error && !success && !warning,
        }"
      >{{ hint }}</span>
    </span>
  </label>
</template>

<style>
@reference "../tailwindcss/tailwind.css";

.m-switch.--is-disabled {
  @apply maz:disabled-opacity;
}

.m-switch__input:focus-visible + .m-switch__toggle::before {
  outline: var(--maz-border-width) solid var(--switch-color);
  outline-offset: 2px;
}

.m-switch:not(.--is-disabled):hover .m-switch__input:not(:checked) + .m-switch__toggle::before {
  box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--switch-color) 60%, transparent);
}

.m-switch__input:checked + .m-switch__toggle {
  &::after {
    @apply maz:translate-x-6;

    background-color: var(--switch-foreground);
  }

  &::before {
    border-color: var(--switch-color);
    background-color: var(--switch-color);
  }
}

.m-switch__toggle {
  &::before {
    content: '';
    transition: all 200ms ease-in-out;

    @apply maz:relative maz:left-0 maz:top-0.5 maz:block maz:h-6 maz:w-12 maz:rounded-full;
    @apply maz:border maz:border-solid;

    /* Translucent foreground so the track stays visible on any background, in both modes */
    border-color: transparent;
    background-color: light-dark(
      color-mix(in oklab, var(--maz-foreground) 16%, transparent),
      color-mix(in oklab, var(--maz-foreground) 24%, transparent)
    );
  }

  &::after {
    content: '';

    @apply maz:absolute maz:left-0.5 maz:top-1 maz:block maz:h-5 maz:w-5 maz:rounded-full;

    background-color: light-dark(oklch(100% 0 0deg), var(--maz-foreground));
    box-shadow: 0 1px 3px 0 hsl(0deg 0% 0% / 25%);
    transition: all 200ms ease-in-out;
  }
}

.m-switch__input {
  inset-inline-start: -9999px;
}
</style>
