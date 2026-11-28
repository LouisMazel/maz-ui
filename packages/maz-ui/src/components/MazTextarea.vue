<script lang="ts">
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { ROUNDED_SIZE_CLASS, SIZE_TEXT_CLASS } from './constants.ts'

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
   * Draw the border of the textarea
   * @default true
   */
  bordered?: boolean
  /**
   * Draw the border of the textarea
   * @deprecated Use `bordered` instead
   * @default true
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
  /**
   * Shows the number of characters typed, with the `maxlength` set on the textarea (`n/max`),
   * and a ring that fills as the limit gets near
   * @default false
   */
  counter?: boolean
  /**
   * Animates the textarea: the check drawn when `success`, the ring of the counter and the message that
   * gives way to the next one. Set to `false` to keep the field as it was
   * @default true
   */
  animated?: boolean
}
</script>

<script lang="ts" setup generic="T extends string | undefined | null">
import type { HTMLAttributes } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { useGlobalConfig, useGlobalTopLabel } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { onAutofillSync, readInitialAutofillValue } from '../utils/autofillSync.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'
import MazFieldMessage from './MazField/MazFieldMessage.vue'
import { useFieldState } from './MazField/useFieldState.ts'

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
  bordered = undefined,
  autogrow = true,
  minRows = 3,
  appendJustify = 'end',
  topLabel,
  assistiveText,
  counter = false,
  animated = true,
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

const attrs = useAttrs()
const globalTopLabel = useGlobalTopLabel()
const { shouldReduceMotion } = useReducedMotion()

const labelOnTop = computed(() => !topLabel && !!label && globalTopLabel.value)

const topLabelText = computed(() => topLabel || (labelOnTop.value ? label : undefined))

const hasLabelOrHint = computed(() => hint || !!slots.label || (!labelOnTop.value && !!label))

const messageId = computed(() => `${instanceId.value}-message`)

const describedBy = computed(() => (attrs['aria-describedby'] as string | undefined) ?? (assistiveText ? messageId.value : undefined))

const { state, hasState, borderClass: borderStyle, textClass } = useFieldState(() => ({ error, success, warning }))

const showValidCheck = computed(() => animated && success && !error)

const maxLength = computed(() => {
  const value = Number(attrs.maxlength ?? attrs.maxLength)
  return Number.isFinite(value) && value > 0 ? value : undefined
})

const characterCount = computed(() => String(modelValue ?? '').length)

const counterRatio = computed(() => (maxLength.value ? Math.min(characterCount.value / maxLength.value, 1) : 0))

const counterState = computed(() => {
  if (counterRatio.value >= 1)
    return 'full'
  if (counterRatio.value >= 0.9)
    return 'near'
  return 'normal'
})

const counterLabel = computed(() => (maxLength.value ? `${characterCount.value}/${maxLength.value}` : `${characterCount.value}`))

const hasAppend = computed(() => !!slots.append)

// Removed in v6 (plans/ROADMAP.md): `border` is an alias of `bordered`
const hasBorder = computed(() => bordered ?? border)

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

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

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
    '--mt-control-height': `var(--maz-control-height-${size.value}, ${config.height})`,
    '--mt-line-height': config.lineHeight,
    '--mt-padding-inline': config.paddingInline,
  }
})

const stateLabelColor = computed(() => [textClass.value])

const supportsFieldSizing = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content')

function resizeToContent() {
  const element = textarea.value
  if (!element || supportsFieldSizing || !autogrow)
    return

  element.style.blockSize = 'auto'
  if (element.scrollHeight > 0)
    element.style.blockSize = `${element.scrollHeight}px`
}

onMounted(resizeToContent)

watch(() => modelValue, () => nextTick(resizeToContent))
</script>

<template>
  <div class="m-textarea-wrapper m-reset-css maz:flex maz:flex-col maz:gap-2" :class="[classProp, SIZE_TEXT_CLASS[size]]" :style>
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabelText"
      :for="instanceId"
      class="m-textarea__top-label"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
      :class="stateLabelColor"
    >
      {{ topLabelText }}
    </label>
    <label
      class="m-textarea maz:relative maz:flex maz:flex-col maz:align-top maz:text-foreground maz:focus-within-ring"
      :for="instanceId"
      :class="[
        {
          '--is-disabled': disabled,
          '--has-label': hasLabelOrHint,
          '--has-state': hasState,
          '--background-transparent': transparent,
          '--has-placeholder': !!placeholder,
          '--autogrow': autogrow,
          '--padding': padding,
          'maz:border maz:border-solid': hasBorder && !disabled,
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
            '--has-state': hasState,
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
        :aria-invalid="error || undefined"
        :aria-describedby="describedBy"
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
      <MazDrawnIcon v-if="showValidCheck" name="check" class="m-textarea__valid maz:text-xl maz:text-success-600" />
    </label>

    <div v-if="counter" class="m-textarea__footer maz:-mt-1 maz:flex maz:items-start maz:gap-2">
      <MazFieldMessage
        v-if="assistiveText"
        :id="messageId"
        :text="assistiveText"
        :state
        :animated
        class="m-textarea__bottom-text maz:flex-1"
      />
      <span v-else class="maz:flex-1" />
      <span class="m-textarea__counter maz:flex maz:items-center maz:gap-1 maz:text-body-sm" :class="`--${counterState}`">
        <svg v-if="maxLength" class="m-textarea__counter-ring" viewBox="0 0 24 24" fill="none" aria-hidden="true" :class="{ '--animated': animated && !shouldReduceMotion }">
          <circle class="m-textarea__counter-track" cx="12" cy="12" r="9" stroke-width="3" />
          <circle
            class="m-textarea__counter-progress"
            cx="12"
            cy="12"
            r="9"
            stroke-width="3"
            pathLength="1"
            stroke-linecap="round"
            :stroke-dashoffset="1 - counterRatio"
          />
        </svg>
        <span class="m-textarea__counter-text">{{ counterLabel }}</span>
      </span>
    </div>
    <MazFieldMessage
      v-else-if="assistiveText"
      :id="messageId"
      :text="assistiveText"
      :state
      :animated
      class="m-textarea__bottom-text maz:-mt-1"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-textarea {
  --mt-field-height: var(--mt-control-height, var(--mt-height, 3rem));
  --mt-padding-block: calc(
    (var(--mt-field-height) - var(--mt-line-height, 1.5rem) - (var(--maz-border-width) * 2)) / 2
  );

  &.--padding {
    padding-inline: calc(var(--mt-padding-inline, 1rem) * var(--maz-density-ratio, 1));
    padding-block: var(--mt-padding-block);
  }

  &.--has-placeholder.--has-label textarea,
  &.--has-label:has(textarea:not(:placeholder-shown)) textarea,
  &.--has-label:has(textarea:-webkit-autofill) textarea {
    padding-block-start: calc(var(--mt-line-height, 1.5rem) * 0.6);
  }

  textarea {
    @apply maz:w-full maz:outline-hidden maz:bg-transparent;

    line-height: var(--mt-line-height, 1.5rem);
    transition: padding calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1));

    &.--has-append {
      @apply maz:pb-4;
    }

    &:-webkit-autofill {
      -webkit-text-fill-color: var(--maz-foreground);
      transition:
        padding calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
          var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1)),
        background-color 0s 600000s,
        color 0s 600000s;
    }
  }

  /* The browsers only paint the autofilled <textarea>: the whole field gets an autofill tint instead */
  &:has(textarea:-webkit-autofill) {
    background-color: color-mix(in oklab, var(--maz-primary) 12%, var(--maz-input-bg, var(--maz-surface)));
  }

  &.--is-disabled {
    & * {
      @apply maz:disabled-cursor maz:text-muted;
    }

    & > label {
      @apply maz:text-gray-300 maz:dark:text-gray-600;
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

  &.--neutral:focus-within {
    border-color: var(--maz-neutral-foreground);
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

.m-textarea__label {
  @apply maz:pointer-events-none maz:absolute maz:block maz:w-max maz:origin-top-left maz:truncate;
  @apply maz:flex maz:flex-center;

  inset-inline-start: calc(var(--mt-padding-inline, 1rem) * var(--maz-density-ratio, 1));
  inset-block-start: var(--mt-padding-block);
  line-height: var(--mt-line-height, 1.5rem);
  transition: transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1));

  &:not(.--has-state) {
    @apply maz:text-muted;
  }
}

.m-textarea__valid {
  position: absolute;
  inset-block-start: var(--mt-padding-block);
  inset-inline-end: calc(var(--mt-padding-inline, 1rem) * var(--maz-density-ratio, 1));
  line-height: var(--mt-line-height, 1.5rem);
}

.m-textarea__counter {
  font-variant-numeric: tabular-nums;
  color: var(--maz-muted);

  &.--near {
    color: var(--maz-warning-600);
  }

  &.--full {
    color: var(--maz-destructive-600);
  }
}

.m-textarea__counter-ring {
  inline-size: 1.125rem;
  block-size: 1.125rem;
  transform: rotate(-90deg);

  & circle {
    stroke: currentcolor;
  }

  &.--animated .m-textarea__counter-progress {
    transition: stroke-dashoffset calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, ease-out);
  }
}

.m-textarea__counter-track {
  opacity: 0.2;
}

.m-textarea__counter-progress {
  stroke-dasharray: 1;
}

.m-textarea__append {
  justify-content: var(--append-justify);
}
</style>
