<script lang="ts">
import type { MazColor } from './types'

export interface MazTextareaProps<T extends string | undefined | null> {
  /** Style attribut of the component root element */
  style?: HTMLAttributes['style']
  /** Class attribut of the component root element */
  class?: HTMLAttributes['class']
  /** @model The value of the textarea */
  modelValue?: T
  /** The id of the textarea */
  id?: string
  /** The name of the textarea */
  name?: string
  /** The label of the textarea */
  label?: string
  /** The placeholder of the textarea */
  placeholder?: string
  /** If the textarea is required */
  required?: boolean
  /** If the textarea is disabled */
  disabled?: boolean
  /** If the textarea is readonly */
  readonly?: boolean
  /** If the textarea has an error */
  error?: boolean
  /** If the textarea has a success */
  success?: boolean
  /** If the textarea has a warning */
  warning?: boolean
  /** The hint of the textarea */
  hint?: string
  /** The color of the textarea */
  color?: MazColor
  /**
   * Size radius of the component's border
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'md'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * If the textarea has a padding
   * @default true
   */
  padding?: boolean
  /**
   * If the textarea has a transparent background
   * @default false
   */
  transparent?: boolean
  /**
   * If the textarea has no border
   * @default false
   */
  border?: boolean
  /**
   * If the textarea should autogrow based on its content
   * @default true
   */
  autogrow?: boolean
  /**
   * The alignment of the append slot
   * @values `'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'`
   * @default 'end'
   */
  appendJustify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /**
   * Static label displayed above the textarea. Unlike the floating label, this remains fixed
   * @default undefined
   */
  topLabel?: string
}
</script>

<script lang="ts" setup generic="T extends string | undefined | null">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { onAutofillSync } from '../utils/autofillSync'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazTextareaProps<T>>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  id: undefined,
  name: 'MazTextarea',
  label: undefined,
  placeholder: undefined,
  required: false,
  disabled: false,
  readonly: false,
  error: false,
  success: false,
  warning: false,
  hint: undefined,
  color: 'primary',
  padding: true,
  transparent: false,
  border: true,
  autogrow: true,
  appendJustify: 'end',
  roundedSize: 'md',
  topLabel: undefined,
})

const emits = defineEmits<{
  /**
   * Emitted when the value of the textarea change
   * @property {string | undefined} value - The value of the textarea
   */
  (event: 'update:model-value', value?: T): void
  /**
   * Emitted when the value of the textarea change
   * @property {string | undefined} value - The value of the textarea
   */
  (event: 'input', value?: T): void
  /**
   * Emitted when the textarea is focused
   * @property {Event} value - The event
   */
  (event: 'focus', value: FocusEvent): void
  /**
   * Emitted when the textarea is blurred
   * @property {Event} value - The event
   */
  (event: 'blur', value: FocusEvent): void
  /**
   * Emitted when the textarea value change
   * @property {Event} value - The event
   */
  (event: 'change', value: Event): void
}>()

const instanceId = useInstanceUniqId({
  componentName: 'MazTextarea',
  providedId: props.id,
})

const textarea = ref<HTMLTextAreaElement | undefined>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits('update:model-value', value)
    emits('input', value)
  },
})

function focus(event: FocusEvent) {
  emits('focus', event)
}

function blur(event: FocusEvent) {
  emits('blur', event)
}

function change(event: Event) {
  emits('change', event)
}

const slots = useSlots()

const hasLabelOrHint = computed(() => props.label || props.hint || !!slots.label)

const hasAppend = computed(() => !!slots.append)

const borderStyle = computed(() => {
  if (props.error)
    return 'maz:border-destructive'
  if (props.success)
    return 'maz:border-success'
  if (props.warning)
    return 'maz:border-warning'
  return '--default-border maz:border-divider maz:dark:border-divider-400'
})

let autofillCleanup: (() => void) | undefined

onMounted(() => {
  if (textarea.value) {
    autofillCleanup = onAutofillSync(textarea.value, (value) => {
      if (value !== props.modelValue) {
        emits('update:model-value', value as T)
      }
    })
  }
})

onBeforeUnmount(() => {
  autofillCleanup?.()
})

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

const stateLabelColor = computed(() => [
  {
    'maz:text-destructive-600': props.error,
    'maz:text-success-600': props.success,
    'maz:text-warning-600': props.warning,
  },
])
</script>

<template>
  <div class="m-textarea-wrapper m-reset-css maz:flex maz:flex-col maz:gap-2" :class="props.class" :style>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="topLabel" :for="instanceId" class="m-textarea__top-label" :class="stateLabelColor">{{ topLabel }}</label>
    <label
      class="m-textarea maz:min-h-25 maz:relative maz:flex maz:flex-col maz:align-top maz:text-foreground"
      :for="instanceId"
      :class="[
        {
          '--is-disabled': disabled,
          '--has-label': hasLabelOrHint,
          '--background-transparent': transparent,
          '--has-placeholder': !!placeholder,
          '--autogrow': autogrow,
          'maz:px-4 maz:py-3': padding,
          'maz:border maz:border-solid': border && !disabled,
          'maz:bg-input': !transparent && !disabled,
          'maz:cursor-not-allowed maz:border-divider maz:dark:border-divider-400 maz:bg-surface-600 maz:dark:bg-surface-400 maz:text-muted': disabled,
        },
        borderStyle,
        ROUNDED_CLASS[roundedSize],
        `--${color}`,
      ]"
      :style="[`--append-justify: ${appendJustify}`]"
    >
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <label
        v-if="hasLabelOrHint"
        :for="instanceId"
        class="m-textarea__label"
        :class="[
          ...stateLabelColor,
          {
            '--has-state': error || warning || success,
          },
        ]"
      >
        <!-- @slot Label - Replace the label -->
        <slot v-if="!hint" name="label">
          {{ label }}
        </slot>
        <span v-else>
          {{ hint }}
        </span>
        <sup v-if="required">*</sup>
      </label>
      <!-- eslint-enable vuejs-accessibility/label-has-for -->

      <textarea
        :id="instanceId"
        ref="textarea"
        v-bind="$attrs"
        v-model="inputValue"
        :placeholder="placeholder || ' '"
        :name
        :disabled
        :readonly
        :required
        :class="{ '--has-append': hasAppend }"
        v-on="{
          blur,
          focus,
          change,
        }"
      />
      <div v-if="hasAppend" class="m-textarea__append maz:inline-flex">
        <!-- @slot Append - Replace the append -->
        <slot name="append" />
      </div>
    </label>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-textarea {
  &.--has-placeholder.--has-label textarea,
  &.--has-label:has(textarea:not(:placeholder-shown)) textarea,
  &.--has-label:has(textarea:-webkit-autofill) textarea {
    padding-block-start: 0.875rem;
  }

  &__append {
    justify-content: var(--append-justify);
  }

  textarea {
    @apply maz:w-full maz:outline-hidden maz:bg-transparent;

    transition: padding 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &.--has-append {
      @apply maz:pb-4;
    }
  }

  &.--is-disabled {
    & * {
      @apply maz:cursor-not-allowed maz:text-muted;
    }

    & > label {
      @apply maz:text-gray-300 maz:dark:text-gray-600;
    }
  }

  &__label {
    @apply maz:pointer-events-none maz:absolute maz:block maz:w-max maz:origin-top-left maz:truncate;
    @apply maz:left-4 maz:top-3 maz:leading-6;
    @apply maz:flex maz:flex-center;

    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &:not(.--has-state) {
      @apply maz:text-muted;
    }
  }

  &.--has-placeholder .m-textarea__label,
  &:has(textarea:not(:placeholder-shown)) .m-textarea__label,
  &:has(textarea:-webkit-autofill) .m-textarea__label {
    transform: scale(0.8) translateY(-0.65rem);
  }

  &.--primary:focus-within {
    @apply maz:border-primary;
  }

  &.--secondary:focus-within {
    @apply maz:border-secondary;
  }

  &.--accent:focus-within {
    @apply maz:border-accent;
  }

  &.--info:focus-within {
    @apply maz:border-info;
  }

  &.--success:focus-within {
    @apply maz:border-success;
  }

  &.--warning:focus-within {
    @apply maz:border-warning;
  }

  &.--destructive:focus-within {
    @apply maz:border-destructive;
  }

  &.--contrast:focus-within {
    @apply maz:border-contrast;
  }

  &.--autogrow textarea {
    @apply maz:resize-none;

    field-sizing: content;
    min-block-size: 3lh;
  }

  &:not(.--autogrow) textarea {
    @apply maz:resize-y;
  }
}
</style>
