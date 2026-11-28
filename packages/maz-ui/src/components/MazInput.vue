<script lang="ts" setup generic="T extends MazInputValue">
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { MazEye } from '@maz-ui/icons/lazy/MazEye'
import { MazEyeSlash } from '@maz-ui/icons/lazy/MazEyeSlash'
import { MazXMark } from '@maz-ui/icons/lazy/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { debounce as debounceFn } from '@maz-ui/utils/helpers/debounce'
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useSlots,
} from 'vue'
import { useFieldTopLabel, useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useMazIconProps } from '../composables/useMazIconProps.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { onAutofillSync, readInitialAutofillValue } from '../utils/autofillSync.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { ROUNDED_SIZE_CLASS, SIZE_TEXT_CLASS } from './constants.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'
import MazFieldMessage from './MazField/MazFieldMessage.vue'
import { getFieldFocusColor, useFieldState } from './MazField/useFieldState.ts'

export type MazInputValue = string | number | null | undefined | boolean

export interface MazInputProps<T = MazInputValue> {
  /**
   * Inline styles to apply to the component root element
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']
  /**
   * CSS classes to apply to the component root element
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']
  /**
   * The current value of the input field. This prop is used for two-way data binding with v-model
   * @model
   * @type {T}
   * @example <MazInput v-model="inputValue" />
   */
  modelValue?: T
  /**
   * Text displayed when the input is empty to guide the user
   * @type {string}
   * @example "Enter your email address"
   */
  placeholder?: InputHTMLAttributes['placeholder']
  /**
   * Floating label that appears inside the input and moves up when focused or filled.
   * Provides better UX than traditional placeholders
   * @type {string}
   * @example "Email Address"
   */
  label?: string
  /**
   * Static label displayed above the input field. Unlike the floating label, this remains fixed
   * @type {string}
   * @example "User Information"
   */
  topLabel?: string
  /**
   * Helper text displayed below the input to provide additional context or validation feedback
   * @type {string}
   * @example "Must contain at least 8 characters"
   */
  assistiveText?: string
  /**
   * Theme color that affects the border and focus states of the input
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral
   * @type {MazColor}
   * @example "primary"
   */
  color?: MazColor
  /**
   * HTML input type attribute that determines the input behavior and validation
   * @type {InputHTMLAttributes['type']}
   * @values text, password, email, number, tel, url, search, date, time, datetime-local, month, week
   * @example "email"
   */
  type?: InputHTMLAttributes['type']
  /**
   * Makes the input field mandatory for form submission
   * @type {boolean}
   * @example true
   */
  required?: boolean
  /**
   * Disables the input field, preventing user interaction and form submission
   * @type {boolean}
   * @example false
   */
  disabled?: boolean
  /**
   * Makes the input field read-only, allowing selection but preventing modification
   * @type {boolean}
   * @example false
   */
  readonly?: boolean
  /**
   * Unique identifier for the input element, used for form labels and accessibility
   * @type {string}
   * @example "user-email"
   */
  id?: string
  /**
   * Applies error styling (red border and text) to indicate validation failure
   * @type {boolean}
   * @example true
   */
  error?: boolean
  /**
   * Applies success styling (green border and text) to indicate successful validation
   * @type {boolean}
   * @example true
   */
  success?: boolean
  /**
   * Applies warning styling (orange border and text) to indicate potential issues
   * @type {boolean}
   * @example true
   */
  warning?: boolean
  /**
   * Alternative text that replaces the label when provided. Useful for contextual hints
   * @type {string}
   * @example "Optional field"
   */
  hint?: string
  /**
   * Additional CSS classes to apply specifically to the input wrapper element
   * @type {string}
   * @example "custom-input-wrapper"
   */
  inputClasses?: string
  /**
   * Controls whether the input has a visible border. Set to false for borderless inputs
   * @type {boolean}
   * @example true
   */
  bordered?: boolean
  /**
   * Controls whether the input has a visible border
   * @deprecated Use `bordered` instead
   * @type {boolean}
   * @example true
   */
  border?: boolean
  /**
   * HTML inputmode attribute that provides hints for virtual keyboards on mobile devices
   * @type {InputHTMLAttributes['inputmode']}
   * @values text, numeric, decimal, tel, search, email, url
   * @example "numeric"
   */
  inputmode?: InputHTMLAttributes['inputmode']
  /**
   * Controls the height and text size of the input component
   * @values xs, sm, md, lg, xl, mini
   * @type {MazSize}
   * @example "md"
   */
  size?: MazSize
  /**
   * Enables input debouncing to limit the frequency of value updates.
   * When true, uses 500ms delay. When a number, uses that value as delay in milliseconds
   * @type {boolean | number}
   * @example true
   * @example 300
   */
  debounce?: boolean | number
  /**
   * Automatically focuses the input when the component mounts
   * @type {boolean}
   * @example false
   */
  autoFocus?: boolean
  /**
   * When true, shows the colored border immediately instead of only on focus
   * @type {boolean}
   * @example false
   */
  borderActive?: boolean
  /**
   * Icon displayed on the inline-start edge of the input (left in LTR, right
   * in RTL). Accepts a bare value (Vue component, raw SVG string, URL or
   * `data:` URI) or a full `MazIconProps` object for fine-grained control
   * (size, title, svgAttributes, fallback, …).
   */
  startIcon?: MazIconLike
  /**
   * Icon displayed on the inline-end edge of the input (right in LTR, left
   * in RTL). Accepts a bare value or a full `MazIconProps` object.
   */
  endIcon?: MazIconLike
  /**
   * Controls the border radius of the input component
   * @values none, sm, md, lg, xl, full
   * @type {MazRoundedSize}
   * @default 'md'
   * @example "lg"
   */
  roundedSize?: MazRoundedSize
  /**
   * Makes the input expand to the full width of its container
   * @type {boolean}
   * @example false
   */
  block?: boolean
  /**
   * The name of the input field. Used for form submission and validation
   * @type {string}
   * @example "email"
   */
  name?: string
  /**
   * The autocomplete attribute for the input field. Used for form submission and validation
   * @type {string}
   * @example "email"
   */
  autocomplete?: string

  /**
   * Loading state for the input field. Used to show a loading spinner
   * @note Spinner can be replace with the `loader` slot
   * @default false
   */
  loading?: boolean
  /**
   * Shows a button that clears the value, once the field has one
   * @default false
   */
  clearable?: boolean
  /**
   * Accessible name of the clear button
   * @default Translated `Clear`
   */
  clearLabel?: string
  /**
   * Animates the field: the check drawn when `success`, the clear button that appears and the message that
   * gives way to the next one. Set to `false` to keep the field as it was (no check, no animation)
   * @default true
   */
  animated?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const {
  style: styleProp,
  class: classProp,
  modelValue,
  placeholder,
  label,
  topLabel,
  assistiveText,
  id,
  color = 'primary',
  type = 'text',
  required = false,
  disabled = false,
  readonly,
  error = false,
  success = false,
  warning = false,
  hint,
  inputClasses,
  border = true,
  bordered = undefined,
  inputmode = 'text',
  debounce = false,
  autoFocus = false,
  borderActive = false,
  startIcon,
  endIcon,
  block,
  name,
  autocomplete,
  loading = false,
  clearable = false,
  clearLabel,
  animated = true,
} = defineProps<MazInputProps<T>>()

const emits = defineEmits<{
  /**
   * Triggered when the input value changes, used for v-model two-way binding.
   * This event is debounced if the debounce prop is enabled
   * @property {T} value - The new input value (string, number, boolean, null, or undefined)
   * @example
   * <MazInput @update:model-value="handleValueChange" />
   */
  'update:model-value': [value?: T]
  /**
   * Triggered when the input field gains focus (user clicks or tabs into the field)
   * @arg {Event} event - The native focus event object
   * @example
   * <MazInput @focus="onInputFocus" />
   */
  'focus': [event: Event]
  /**
   * Triggered when the input field loses focus (user clicks outside or tabs away)
   * @arg {Event} event - The native blur event object
   * @example
   * <MazInput @blur="onInputBlur" />
   */
  'blur': [event: Event]
  /**
   * Triggered when the user clicks on the input field
   * @arg {Event} event - The native click event object
   * @example
   * <MazInput @click="onInputClick" />
   */
  'click': [event: Event]
  /**
   * Triggered when the input value changes and the field loses focus.
   * Different from input event which fires on every keystroke
   * @arg {Event} event - The native change event object
   * @example
   * <MazInput @change="onInputChange" />
   */
  'change': [event: Event]
  /**
   * Triggered on every keystroke or input interaction (real-time input changes).
   * This is the raw input event, not debounced
   * @arg {Event} event - The native input event object
   * @example
   * <MazInput @input="onInputType" />
   */
  'input': [event: Event]
  /**
   * Triggered when the user clicks on the clear button (`clearable`). The value is reset to an empty string
   * @example
   * <MazInput clearable @clear="onClear" />
   */
  'clear': []
}>()

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: MazRoundedSize }>('MazInput', { size: 'md', roundedSize: 'md' })

const attrs = useAttrs()
const { shouldReduceMotion } = useReducedMotion()
const { t } = useTranslations()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const { iconProps: startIconProps } = useMazIconProps(() => startIcon)
const { iconProps: endIconProps } = useMazIconProps(() => endIcon)

const hasPasswordVisible = ref(false)
const input = ref<HTMLInputElement | undefined>()

const instanceId = useInstanceUniqId({
  componentName: 'MazInput',
  providedId: id,
})

const initialAutofillValue = readInitialAutofillValue(instanceId.value)

let autofillCleanup: (() => void) | undefined

onMounted(() => {
  if (autoFocus) {
    input.value?.focus()
  }

  if (input.value) {
    if (initialAutofillValue && input.value.value !== initialAutofillValue) {
      input.value.value = initialAutofillValue
      if (initialAutofillValue !== modelValue)
        emits('update:model-value', initialAutofillValue as T)
    }

    autofillCleanup = onAutofillSync(input.value, (value) => {
      if (value !== modelValue) {
        emits('update:model-value', value as T)
      }
    })
  }
})

onBeforeUnmount(() => {
  autofillCleanup?.()
})

const isPasswordType = computed(() => type === 'password')

const inputType = computed(() => (hasPasswordVisible.value ? 'text' : type))

// Removed in v6 (plans/ROADMAP.md): `border` is an alias of `bordered`
const hasBorder = computed(() => bordered ?? border)

const { state, hasState, borderClass, importantTextClass: stateColor } = useFieldState(() => ({ error, success, warning }))

const borderStyle = computed(() => (hasBorder.value ? borderClass.value : undefined))

const { labelOnTop, topLabelText } = useFieldTopLabel(() => ({ label, topLabel }))

const floatingText = computed(() => hint || (labelOnTop.value ? undefined : label))

const messageId = computed(() => `${instanceId.value}-message`)

// A function, not a computed: the attributes are not reactive
function getDescribedBy() {
  return (attrs['aria-describedby'] as string | undefined) ?? (assistiveText ? messageId.value : undefined)
}

const slots = useSlots()

const debounceEmitValue = debounceFn(
  (value?: T) => {
    emits('update:model-value', value)
  },
  typeof debounce === 'number'
    ? debounce
    : 500,
)

function emitValue(value?: T) {
  if (debounce)
    return debounceEmitValue(value)
  emits('update:model-value', value)
}

const model = computed({
  get: () => modelValue,
  set: (value?: T) => emitValue(value),
})

const hasLabel = computed(() => !!floatingText.value)

const alwaysUp = computed(() => ['date', 'month', 'week'].includes(type))

const showValidCheck = computed(() => animated && success && !error)

const canClear = computed(() => clearable && !disabled && !readonly && modelValue !== undefined && modelValue !== null && modelValue !== '')

function hasEndPart(): boolean {
  return (
    hasSlotContent(slots['end-icon'])
    || isPasswordType.value
    || !!endIcon
    || loading
    || clearable
    || showValidCheck.value
  )
}

function clear() {
  debounceEmitValue.cancel()
  emits('update:model-value', '' as T)
  emits('clear')
  input.value?.focus()
}

function hasStartPart(): boolean {
  return hasSlotContent(slots['start-icon']) || !!startIcon
}

function focus(event: Event) {
  emits('focus', event)
}

function blur(event: Event) {
  emits('blur', event)
}

function change(event: Event) {
  return emits('change', event)
}
function emitInputEvent(event: Event) {
  return emits('input', event)
}

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS
</script>

<template>
  <div
    class="m-input m-reset-css maz:inline-flex maz:h-fit maz:flex-col maz:items-start maz:align-top maz:text-foreground" :class="[
      {
        '--border-active': borderActive,
        '--always-up': alwaysUp,
        '--has-placeholder': !!placeholder,
        '--has-label': hasLabel,
        '--is-readonly': readonly,
        '--has-z-2': hasState,
        '--has-state': hasState,
        '--block': block,
        'maz:w-full': block,
      },
      classProp,
      `--${color}`,
      SIZE_TEXT_CLASS[size],
    ]" :style="[styleProp, { '--m-input-tint-bg': `var(--maz-${color})`, '--m-field-color': getFieldFocusColor(color, state) }]"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label
      v-if="topLabelText"
      :for="instanceId"
      class="m-input-top-label maz:mb-2"
      :style="{ fontWeight: 'var(--maz-input-top-label-font-weight, 600)' }"
      :class="stateColor"
    >
      {{ topLabelText }}
    </label>

    <div
      class="m-input-wrapper maz:relative maz:z-1 maz:flex maz:size-full maz:flex-1 maz:overflow-hidden maz:bg-input"
      :class="[
        inputClasses,
        borderStyle,
        ROUNDED_CLASS[roundedSize],
        `--rounded-${roundedSize}`,
        { '--block': block, '--border': hasBorder, 'maz:w-full': block, 'maz:border maz:border-solid maz:field-focus': hasBorder, 'maz:focus-within-ring maz:field-transition': !hasBorder },
      ]"
    >
      <div v-if="hasStartPart()" class="m-input-wrapper-start maz:relative maz:z-1 maz:flex maz:flex-center maz:space-x-1 maz:py-1 maz:ps-2">
        <!--
          @slot Custom content for the inline-start edge of the input field (left in LTR, right in RTL).
          Typically used for icons, buttons, or text. Overrides the startIcon prop when used
        -->
        <slot v-if="hasSlotContent(slots['start-icon']) || startIcon" name="start-icon">
          <MazIcon v-if="startIconProps" v-bind="startIconProps" class="maz:text-xl" :class="stateColor || 'maz:text-muted'" />
        </slot>
      </div>

      <div
        class="m-input-wrapper-input maz:relative maz:flex maz:w-full maz:max-w-full maz:flex-1 maz:items-center"
        :class="[
          `--${size}`,
          { '--top-label': !!topLabelText,
            '--has-start-icon': hasStartPart(),
            '--has-end-icon': hasEndPart(),
          },
        ]"
      >
        <input
          :id="instanceId"
          v-bind="$attrs"
          ref="input"
          v-model="model"
          :aria-invalid="error || undefined"
          :aria-describedby="getDescribedBy()"
          :placeholder="placeholder || ' '"
          :aria-label="label || placeholder"
          :type="inputType"
          :inputmode
          :name
          :autocomplete
          :disabled
          :readonly
          :required
          class="m-input-input maz:m-0 maz:size-full maz:appearance-none maz:truncate maz:border-none maz:bg-transparent maz:px-(--maz-control-padding-x-md,1rem) maz:py-0 maz:text-foreground maz:shadow-none maz:outline-hidden"
          :class="[{ 'maz:ps-2!': hasStartPart(), 'maz:pe-2!': hasEndPart() }]"
          v-on="{
            blur,
            focus,
            change,
            input: emitInputEvent,
          }"
          @click="$emit('click', $event)"
        >

        <span
          v-if="floatingText" class="m-input-label maz:pointer-events-none maz:absolute maz:inset-s-(--maz-control-padding-x-md,1rem) maz:w-full maz:origin-top-left maz:items-center maz:truncate maz:overflow-hidden maz:text-start maz:leading-6 maz:whitespace-nowrap" :class="[stateColor, { 'maz:inset-s-2!': hasStartPart(), 'maz:pe-3!': hasLabel }]"
        >
          {{ floatingText }}
        </span>
      </div>

      <div v-if="hasEndPart()" class="m-input-wrapper-end maz:relative maz:z-1 maz:flex maz:flex-center maz:space-x-1 maz:py-1 maz:pe-2">
        <!--
          @slot Custom content for the inline-end edge of the input field (right in LTR, left in RTL).
          Typically used for icons, buttons, or action elements. Overrides the endIcon prop when used.
          Note: For password inputs, the visibility toggle button will appear after this slot content
        -->
        <slot v-if="hasSlotContent(slots['end-icon']) || endIcon" name="end-icon">
          <MazIcon v-if="endIconProps" v-bind="endIconProps" class="maz:text-xl" :class="stateColor || 'maz:text-muted'" />
        </slot>

        <Transition name="m-input-end-action" :css="animated && !shouldReduceMotion">
          <button
            v-if="canClear"
            type="button"
            class="m-input-clear maz:flex maz:cursor-pointer maz:rounded-full maz:border-none maz:bg-transparent maz:p-0.5 maz:text-muted maz:focus-ring maz:hover:text-foreground"
            :aria-label="clearLabel || t('input.clear')"
            @click.stop="clear"
          >
            <MazXMark class="maz:text-xl" />
          </button>
        </Transition>

        <MazDrawnIcon v-if="showValidCheck" name="check" class="m-input-valid maz:text-xl maz:text-success-600" />

        <MazBtn
          v-if="isPasswordType" color="transparent" tabindex="-1" size="mini"
          @click.stop="hasPasswordVisible = !hasPasswordVisible"
        >
          <MazEyeSlash v-if="hasPasswordVisible" class="maz:text-xl maz:text-muted" />
          <MazEye v-else class="maz:text-xl maz:text-muted" />
        </MazBtn>

        <template v-if="loading">
          <!--
            @slot Loader slot.
            @default `<MazSpinner :color="color" />`
            Typically used to show a loading spinner or indicator.
          -->
          <slot name="loader">
            <MazSpinner :color="color" />
          </slot>
        </template>
      </div>
    </div>

    <MazFieldMessage
      v-if="assistiveText"
      :id="messageId"
      :text="assistiveText"
      :state
      :animated
      class="m-input-bottom-text maz:mt-1"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-input {
  /* Tint variant derived from --m-input-tint-bg via OKLCh lightness offset
   * (mirrors SCALE_OFFSETS step -100). */
  --maz-input-color: oklch(from var(--m-input-tint-bg) clamp(0, calc(l + 0.32), 1) calc(c * 0.35) h); /* ↔ scale -100 */

  &.--always-up .m-input-label,
  &.--has-placeholder .m-input-label,
  & .m-input-input:not(:placeholder-shown) ~ .m-input-label,
  & .m-input-input:-webkit-autofill ~ .m-input-label {
    @apply maz:text-xs;

    transform: translateY(-1em);
  }

  &.--always-up .m-input-input,
  &.--has-placeholder.--has-label .m-input-input,
  &.--has-label .m-input-input:not(:placeholder-shown),
  &.--has-label .m-input-input:-webkit-autofill {
    @apply maz:pt-4;
  }

  &:not(.--has-state) .m-input-wrapper {
    @apply maz:text-muted;
  }

  &.--has-z-2 {
    & .m-input-wrapper {
      @apply maz:z-2;
    }
  }

  &.--is-readonly {
    & .m-input-input {
      @apply maz:cursor-default;
    }
  }

  &:has(input:disabled) {
    & .m-input-wrapper {
      @apply maz:bg-surface-600 maz:text-muted maz:dark:bg-surface-300;
    }

    & .m-input-input {
      @apply maz:disabled-cursor maz:text-muted;
    }
  }

  & .m-input-wrapper:focus-within,
  &.--border-active .m-input-wrapper {
    @apply maz:z-3;
  }

  &.--border-active .m-input-wrapper.--border {
    @apply maz:field-focused;
  }
}

.m-input-label {
  transition: transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1));
}

/* The browsers only paint the autofilled <input>: the whole field gets an autofill tint instead */
.m-input-wrapper:has(.m-input-input:-webkit-autofill) {
  background-color: color-mix(in oklab, var(--maz-primary) 12%, var(--maz-input-bg, var(--maz-surface)));
}

.m-input-input {
  transition: padding calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1));

  &:-webkit-autofill {
    -webkit-text-fill-color: var(--maz-foreground);
    caret-color: var(--maz-foreground);
    transition:
      padding calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
        var(--maz-easing-out, cubic-bezier(0, 0, 0.2, 1)),
      background-color 0s 600000s,
      color 0s 600000s;
  }

  &::placeholder {
    @apply maz:text-muted;
  }
}

.m-input-wrapper-input {
  &.--xl {
    block-size: calc(var(--maz-control-height-xl, 4rem) - (var(--maz-border-width) * 2));
  }

  &.--lg {
    block-size: calc(var(--maz-control-height-lg, 3.5rem) - (var(--maz-border-width) * 2));
  }

  &.--md {
    block-size: calc(var(--maz-control-height-md, 3rem) - (var(--maz-border-width) * 2));
  }

  &.--sm {
    block-size: calc(var(--maz-control-height-sm, 2.5rem) - (var(--maz-border-width) * 2));
  }

  &.--xs {
    block-size: calc(var(--maz-control-height-xs, 2rem) - (var(--maz-border-width) * 2));
  }

  &.--mini {
    block-size: calc(var(--maz-control-height-mini, 1.5rem) - (var(--maz-border-width) * 2));
  }
}

.m-input-end-action-enter-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out);
}

.m-input-end-action-leave-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    transform calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.m-input-end-action-enter-from,
.m-input-end-action-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
