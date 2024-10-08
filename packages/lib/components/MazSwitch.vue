<script lang="ts" setup>
import type { Color } from './types'
import { computed, type HTMLAttributes, ref } from 'vue'
import { useInstanceUniqId } from '../modules/composables/useInstanceUniqId'

export type { Color }

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
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

export interface Props {
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
  color?: Color
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

const bgColorClassVar = computed(() => `var(--maz-color-${props.color}-alpha)`)

const bgColorStyle = computed<HTMLAttributes['class']>(() =>
  props.modelValue ? `var(--maz-color-${props.color})` : 'var(--maz-color-white)',
)

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
    class="m-switch"
    :class="[{ '--is-disabled': disabled }, props.class]"
    role="switch"
    :style="style"
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

  &.--is-disabled {
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

      @apply maz-relative maz-left-1 maz-top-1 maz-block maz-h-4 maz-w-10 maz-rounded-full;

      background-color: v-bind('bgColorClassVar');
    }

    &::after {
      content: '';

      @apply maz-absolute maz-left-0 maz-top-0 maz-block maz-h-6 maz-w-6 maz-rounded-full;

      background-color: v-bind('bgColorStyle');
      box-shadow: 0 2px 8px 0 hsl(0deg 0% 0% / 20%);
      transition: all 200ms ease-in-out;
    }
  }

  &__input:checked + .m-switch__toggle {
    &::after {
      @apply maz-translate-x-6;
    }
  }

  &__input:disabled {
    + .m-switch__toggle {
      &::after {
        @apply maz-bg-color-light dark:maz-bg-color-lighter;
      }

      &::before {
        @apply maz-bg-color-lighter dark:maz-bg-color-light;
      }
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
}
</style>
