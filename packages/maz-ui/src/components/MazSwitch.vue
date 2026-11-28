<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types.ts'
import { computed } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'

import { hasSlotContent } from '../utils/hasSlotContent.ts'

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
  /**
   * The size of the switch, same scale as MazCheckbox
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   * @default 'md'
   */
  size?: MazSize
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

const { size } = useGlobalConfig<{ size: MazSize }>('MazSwitch', { size: 'md' })

const SWITCH_HEIGHT: Record<MazSize, string> = {
  xl: '2rem',
  lg: '1.75rem',
  md: '1.5rem',
  sm: '1.25rem',
  xs: '1rem',
  mini: '0.75rem',
}

const bgColorClassVar = computed(() => {
  return color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})`
})

const fgColorClassVar = computed(() => {
  return color === 'neutral' ? 'var(--maz-neutral)' : `var(--maz-${color}-foreground, var(--maz-foreground))`
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
    :style="[style, { '--switch-color': bgColorClassVar, '--switch-foreground': fgColorClassVar, '--switch-height': SWITCH_HEIGHT[size] }]"
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
    <span class="m-switch__toggle maz:relative" />

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
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--switch-color));
  outline-offset: var(--maz-focus-ring-offset, 2px);
}

.m-switch:not(.--is-disabled):hover .m-switch__input:not(:checked) + .m-switch__toggle::before {
  box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--switch-color) 60%, transparent);
}

.m-switch__input:checked + .m-switch__toggle {
  &::after {
    translate: var(--switch-height) 0;
    transform-origin: 100% 50%;
    background-color: var(--switch-foreground);
  }

  &::before {
    border-color: var(--switch-color);
    background-color: var(--switch-color);
  }
}

:where([dir='rtl']) .m-switch__input:checked + .m-switch__toggle::after {
  translate: calc(var(--switch-height) * -1) 0;
  transform-origin: 0% 50%;
}

:where([dir='rtl']) .m-switch__input:not(:checked) + .m-switch__toggle::after {
  transform-origin: 100% 50%;
}

/* The thumb stretches toward the other side while pressed, then springs back into place */
.m-switch:not(.--is-disabled):active .m-switch__toggle::after,
.m-switch__input:not(:disabled):active + .m-switch__toggle::after {
  scale: 1.3 1;
  transition-duration: calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1));
  transition-timing-function: var(--maz-easing-out, ease-out);
}

.m-switch__toggle {
  inline-size: calc(var(--switch-height) * 2);
  block-size: var(--switch-height);

  /* No light-dark() here: the build rewrites it into variables that only exist with a color-scheme rule */
  --m-switch-track: color-mix(in srgb, var(--maz-foreground) 16%, transparent);
  --m-switch-thumb: oklch(100% 0 0deg);

  @variant dark {
    --m-switch-track: color-mix(in srgb, var(--maz-foreground) 24%, transparent);
    --m-switch-thumb: var(--maz-foreground);
  }

  &::before {
    content: '';
    transition:
      background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
      border-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
      box-shadow calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

    @apply maz:absolute maz:inset-0 maz:rounded-full;
    @apply maz:border maz:border-solid;

    /* Translucent foreground so the track stays visible on any background, in both modes */
    border-color: transparent;
    background-color: var(--m-switch-track);
  }

  &::after {
    content: '';

    @apply maz:absolute maz:rounded-full;

    inset-block-start: 0.125rem;
    inset-inline-start: 0.125rem;
    inline-size: calc(var(--switch-height) - 0.25rem);
    block-size: calc(var(--switch-height) - 0.25rem);
    background-color: var(--m-switch-thumb);
    box-shadow: 0 1px 3px 0 hsl(0deg 0% 0% / 25%);
    translate: 0 0;
    transform-origin: 0% 50%;
    transition:
      translate calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
        var(--maz-easing-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
      scale calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
        var(--maz-easing-bounce, cubic-bezier(0.34, 1.56, 0.64, 1)),
      background-color calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
  }
}

.m-switch__input {
  inset-inline-start: -9999px;
}
</style>
