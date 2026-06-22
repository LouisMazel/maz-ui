<script lang="ts">
import type { MazColor, MazRoundedSize, MazSize } from './types'

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
   * @type {MazRoundedSize}
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * Controls the padding (height) and text size of the textarea, mirroring MazInput sizes.
   * Combined with `minRows`, e.g. `size="md" :min-rows="1"` matches a regular input height.
   * @values mini, xs, sm, md, lg, xl
   * @type {MazSize}
   * @default 'md'
   */
  size?: MazSize
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
   * Minimum number of rows displayed by the textarea (initial/minimum height).
   * With autogrow enabled, the textarea still grows beyond this with its content.
   * @default 3
   */
  minRows?: number
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
  /**
   * Helper text displayed below the input to provide additional context or validation feedback
   * @type {string}
   * @example "Must contain at least 8 characters"
   */
  assistiveText?: string
}
</script>

<script lang="ts" setup generic="T extends string | undefined | null">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { onAutofillSync, readInitialAutofillValue } from '../utils/autofillSync'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  modelValue,
  id,
  name = 'MazTextarea',
  label,
  required = false,
  disabled = false,
  readonly = false,
  error = false,
  success = false,
  warning = false,
  hint,
  color = 'primary',
  padding = true,
  transparent = false,
  border = true,
  autogrow = true,
  minRows = 3,
  appendJustify = 'end',
} = defineProps<MazTextareaProps<T>>()

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

const { roundedSize, size } = useGlobalConfig<{ roundedSize: MazRoundedSize, size: MazSize }>('MazTextarea', { roundedSize: 'md', size: 'md' })

const instanceId = useInstanceUniqId({
  componentName: 'MazTextarea',
  providedId: id,
})

const initialAutofillValue = readInitialAutofillValue(instanceId.value)

const textarea = ref<HTMLTextAreaElement | undefined>()

const inputValue = computed({
  get: () => modelValue,
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

const hasLabelOrHint = computed(() => label || hint || !!slots.label)

const hasAppend = computed(() => !!slots.append)

const borderStyle = computed(() => {
  if (error)
    return 'maz:border-destructive'
  if (success)
    return 'maz:border-success'
  if (warning)
    return 'maz:border-warning'
  return '--default-border maz:border-divider maz:dark:border-divider-400'
})

let autofillCleanup: (() => void) | undefined

onMounted(() => {
  if (textarea.value) {
    if (initialAutofillValue && textarea.value.value !== initialAutofillValue) {
      textarea.value.value = initialAutofillValue
      if (initialAutofillValue !== modelValue)
        emits('update:model-value', initialAutofillValue as T)
    }

    autofillCleanup = onAutofillSync(textarea.value, (value) => {
      if (value !== modelValue) {
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

const SIZE_TEXT_CLASS = {
  xl: 'maz:text-xl',
  lg: 'maz:text-lg',
  md: '',
  sm: 'maz:text-sm',
  xs: 'maz:text-xs',
  mini: 'maz:text-xs',
} as const

const SIZE_CONFIG = {
  xl: { height: '4rem', lineHeight: '1.75rem', paddingInline: '1.25rem' },
  lg: { height: '3.5rem', lineHeight: '1.75rem', paddingInline: '1rem' },
  md: { height: '3rem', lineHeight: '1.5rem', paddingInline: '1rem' },
  sm: { height: '2.5rem', lineHeight: '1.25rem', paddingInline: '0.75rem' },
  xs: { height: '2rem', lineHeight: '1rem', paddingInline: '0.625rem' },
  mini: { height: '1.5rem', lineHeight: '1rem', paddingInline: '0.5rem' },
} as const

const sizeTextClass = computed(() => SIZE_TEXT_CLASS[size.value])

const sizeVars = computed(() => {
  const config = SIZE_CONFIG[size.value]
  return {
    '--mt-height': config.height,
    '--mt-line-height': config.lineHeight,
    '--mt-padding-inline': config.paddingInline,
  }
})

const stateLabelColor = computed(() => [
  {
    'maz:text-destructive-600': error,
    'maz:text-success-600': success,
    'maz:text-warning-600': warning,
  },
])
</script>

<template>
  <div class="m-textarea-wrapper m-reset-css maz:flex maz:flex-col maz:gap-2" :class="classProp" :style>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabel"
      :for="instanceId"
      class="m-textarea__top-label"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
      :class="stateLabelColor"
    >
      {{ topLabel }}
    </label>
    <label
      class="m-textarea maz:relative maz:flex maz:flex-col maz:align-top maz:text-foreground"
      :for="instanceId"
      :class="[
        {
          '--is-disabled': disabled,
          '--has-label': hasLabelOrHint,
          '--background-transparent': transparent,
          '--has-placeholder': !!placeholder,
          '--autogrow': autogrow,
          '--padding': padding,
          'maz:border maz:border-solid': border && !disabled,
          'maz:bg-input': !transparent && !disabled,
          'maz:disabled-cursor maz:border-divider maz:bg-surface-600 maz:text-muted maz:dark:border-divider-400 maz:dark:bg-surface-400': disabled,
        },
        sizeTextClass,
        borderStyle,
        ROUNDED_CLASS[roundedSize],
        `--${color}`,
      ]"
      :style="[`--append-justify: ${appendJustify}`, `--maz-textarea-min-rows: ${minRows}`, sizeVars]"
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
        :rows="minRows"
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

    <div
      v-if="assistiveText" class="m-textarea__bottom-text maz:-mt-1 maz:text-sm" :class="[
        {
          'maz:text-destructive-600': error,
          'maz:text-success-600': success,
          'maz:text-warning-600': warning,
          'maz:text-muted': !error && !success && !warning,
        },
      ]"
    >
      {{ assistiveText }}
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-textarea {
  --mt-padding-block: calc(
    (var(--mt-height, 3rem) - var(--mt-line-height, 1.5rem) - (var(--maz-border-width) * 2)) / 2
  );

  &.--padding {
    padding-inline: var(--mt-padding-inline, 1rem);
    padding-block: var(--mt-padding-block);
  }

  &.--has-placeholder.--has-label textarea,
  &.--has-label:has(textarea:not(:placeholder-shown)) textarea,
  &.--has-label:has(textarea:-webkit-autofill) textarea {
    padding-block-start: calc(var(--mt-line-height, 1.5rem) * 0.6);
  }

  &__append {
    justify-content: var(--append-justify);
  }

  textarea {
    @apply maz:w-full maz:outline-hidden maz:bg-transparent;

    line-height: var(--mt-line-height, 1.5rem);
    transition: padding 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &.--has-append {
      @apply maz:pb-4;
    }
  }

  &.--is-disabled {
    & * {
      @apply maz:disabled-cursor maz:text-muted;
    }

    & > label {
      @apply maz:text-gray-300 maz:dark:text-gray-600;
    }
  }

  &__label {
    @apply maz:pointer-events-none maz:absolute maz:block maz:w-max maz:origin-top-left maz:truncate;
    @apply maz:flex maz:flex-center;

    inset-inline-start: var(--mt-padding-inline, 1rem);
    inset-block-start: var(--mt-padding-block);
    line-height: var(--mt-line-height, 1.5rem);
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &:not(.--has-state) {
      @apply maz:text-muted;
    }
  }

  &.--has-placeholder .m-textarea__label,
  &:has(textarea:not(:placeholder-shown)) .m-textarea__label,
  &:has(textarea:-webkit-autofill) .m-textarea__label {
    transform: scale(0.8) translateY(calc(-1 * var(--mt-padding-block)));
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
    min-block-size: calc(var(--maz-textarea-min-rows, 3) * 1lh);
  }

  &:not(.--autogrow) textarea {
    @apply maz:resize-y;
  }
}
</style>
