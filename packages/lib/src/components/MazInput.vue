<script lang="ts" setup generic="T extends MazInputValue">
import type { IconComponent } from '@maz-ui/icons'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import type { MazColor, MazSize } from './types'
import { MazEye, MazEyeSlash } from '@maz-ui/icons'
import { debounce as debounceFn } from '@maz-ui/utils/helpers/debounce'
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  useSlots,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

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
  modelValue?: T | undefined
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
   * @values primary, secondary, accent, info, success, warning, destructive, contrast
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
   * Icon displayed on the left side of the input. Can be an icon name string or icon component
   * @type {string | IconComponent}
   * @example "user"
   * @example UserIcon
   */
  leftIcon?: string | IconComponent
  /**
   * Icon displayed on the right side of the input. Can be an icon name string or icon component
   * @type {string | IconComponent}
   * @example "search"
   * @example SearchIcon
   */
  rightIcon?: string | IconComponent
  /**
   * Controls the border radius of the input component
   * @values none, sm, md, lg, xl, full
   * @type {'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'}
   * @example "lg"
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
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
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazInputProps<T>>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  placeholder: undefined,
  label: undefined,
  id: undefined,
  color: 'primary',
  type: 'text',
  required: false,
  disabled: false,
  error: false,
  success: false,
  warning: false,
  hint: undefined,
  inputClasses: undefined,
  border: true,
  inputmode: 'text',
  size: 'md',
  debounce: false,
  autoFocus: false,
  borderActive: false,
  leftIcon: undefined,
  rightIcon: undefined,
  roundedSize: 'lg',
  loading: false,
})

const emits = defineEmits<{
  /**
   * Triggered when the input value changes, used for v-model two-way binding.
   * This event is debounced if the debounce prop is enabled
   * @property {T} value - The new input value (string, number, boolean, null, or undefined)
   * @example
   * <MazInput @update:modelValue="handleValueChange" />
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
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const hasPasswordVisible = ref(false)
const isFocused = ref(false)
const input = ref<HTMLElement | undefined>()

const instanceId = useInstanceUniqId({
  componentName: 'MazInput',
  providedId: props.id,
})

onMounted(() => {
  if (props.autoFocus) {
    input.value?.focus()
  }
})

const isPasswordType = computed(() => props.type === 'password')

const inputType = computed(() => (hasPasswordVisible.value ? 'text' : props.type))

// eslint-disable-next-line sonarjs/cognitive-complexity
const borderStyle = computed(() => {
  if (!props.border)
    return undefined
  if (props.error && !isFocused.value)
    return 'maz-border-destructive'
  if (props.success && !isFocused.value)
    return 'maz-border-success'
  if (props.warning && !isFocused.value)
    return 'maz-border-warning'

  if (isFocused.value || props.borderActive) {
    if (props.color === 'destructive')
      return 'maz-border-destructive'
    if (props.color === 'info')
      return 'maz-border-info'
    if (props.color === 'primary')
      return 'maz-border-primary'
    if (props.color === 'secondary')
      return 'maz-border-secondary'
    if (props.color === 'success')
      return 'maz-border-success'
    if (props.color === 'warning')
      return 'maz-border-warning'
    if (props.color === 'accent')
      return 'maz-border-accent'
    if (props.color === 'contrast')
      return 'maz-border-contrast'
  }
  return '--default-border'
})

const slots = useSlots()

const debounceEmitValue = debounceFn(
  (value?: T) => {
    emits('update:model-value', value)
  },
  typeof props.debounce === 'number' ? props.debounce : 500,
)

function emitValue(value?: T) {
  if (props.debounce)
    return debounceEmitValue(value)
  emits('update:model-value', value)
}

const model = computed({
  get: () => props.modelValue,
  set: (value?: T) => emitValue(value),
})

const hasValue = computed(() => model.value !== undefined && model.value !== '')

const shouldUp = computed(() => {
  return (
    (!!props.label || !!props.hint)
    && (
      !!hasValue.value
      || !!props.placeholder
      || ['date', 'month', 'week'].includes(props.type)
    )
  )
})

const hasLabel = computed(() => !!props.label || !!props.hint)

function hasRightPart(): boolean {
  return (
    !!slots['right-icon']
    || isPasswordType.value
    || !!props.rightIcon
    || props.loading
  )
}

function hasLeftPart(): boolean {
  return !!slots['left-icon'] || !!props.leftIcon
}

function focus(event: Event) {
  emits('focus', event)
  isFocused.value = true
}

function blur(event: Event) {
  emits('blur', event)
  isFocused.value = false
}

function change(event: Event) {
  return emits('change', event)
}
function emitInputEvent(event: Event) {
  return emits('input', event)
}

const stateColor = computed(() => {
  if (props.error)
    return '!maz-text-destructive-600'
  if (props.success)
    return '!maz-text-success-600'
  if (props.warning)
    return '!maz-text-warning-600'
  return undefined
})
</script>

<template>
  <div
    class="m-input m-reset-css" :class="[
      {
        '--is-focused': isFocused || borderActive,
        '--should-up': shouldUp,
        '--has-label': hasLabel,
        '--is-readonly': readonly,
        '--has-z-2': error || warning || success,
        '--has-state': error || warning || success,
        '--block': block,
      },
      props.class,
      `--${color}`,
    ]" :style="[style, { '--maz-input-color': `hsl(var(--maz-${color}-100))` }]"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="topLabel" :for="instanceId" class="m-input-top-label" :class="stateColor">{{ topLabel }}</label>

    <div
      class="m-input-wrapper"
      :class="[
        inputClasses,
        borderStyle,
        `--rounded-${roundedSize}`,
        { '--block': block, '--border': border },
      ]"
    >
      <div v-if="hasLeftPart()" class="m-input-wrapper-left">
        <!--
          @slot Custom content for the left side of the input field.
          Typically used for icons, buttons, or text. Overrides the leftIcon prop when used
        -->
        <slot v-if="$slots['left-icon'] || leftIcon" name="left-icon">
          <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" class="maz-text-xl" :class="stateColor || 'maz-text-muted'" />
          <Component :is="leftIcon" v-else-if="leftIcon" class="maz-text-xl" :class="stateColor || 'maz-text-muted'" />
        </slot>
      </div>

      <div
        class="m-input-wrapper-input"
        :class="[
          `--${size}`,
          { '--top-label': !!topLabel,
            '--has-left-icon': hasLeftPart(),
            '--has-right-icon': hasRightPart(),
          },
        ]"
      >
        <input
          :id="instanceId"
          v-bind="$attrs"
          ref="input"
          v-model="model"
          :placeholder
          :aria-label="label || placeholder"
          :type="inputType"
          :inputmode
          :name
          :autocomplete
          :disabled
          :readonly
          :required
          class="m-input-input"
          v-on="{
            blur,
            focus,
            change,
            input: emitInputEvent,
          }"
          @click="$emit('click', $event)"
        >

        <span
          v-if="label || hint" class="m-input-label" :class="stateColor"
        >
          {{ hint || label }}
        </span>
      </div>

      <div v-if="hasRightPart()" class="m-input-wrapper-right">
        <!--
          @slot Custom content for the right side of the input field.
          Typically used for icons, buttons, or action elements. Overrides the rightIcon prop when used.
          Note: For password inputs, the visibility toggle button will appear after this slot content
        -->
        <slot v-if="$slots['right-icon'] || rightIcon" name="right-icon">
          <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" class="maz-text-xl" :class="stateColor || 'maz-text-muted'" />
          <Component :is="rightIcon" v-else-if="rightIcon" class="maz-text-xl" :class="stateColor || 'maz-text-muted'" />
        </slot>

        <MazBtn
          v-if="isPasswordType" color="transparent" tabindex="-1" size="mini"
          @click.stop="hasPasswordVisible = !hasPasswordVisible"
        >
          <MazEyeSlash v-if="hasPasswordVisible" class="maz-text-xl maz-text-muted" />
          <MazEye v-else class="maz-text-xl maz-text-muted" />
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

    <div
      v-if="assistiveText" class="m-input-bottom-text" :class="[
        {
          'maz-text-destructive-600': error,
          'maz-text-success-600': success,
          'maz-text-warning-600': warning,
          'maz-text-muted': !error && !success && !warning,
        },
      ]"
    >
      {{ assistiveText }}
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.m-input {
  @apply maz-inline-flex maz-flex-col maz-align-top maz-items-start;

  &.--block {
    @apply maz-w-full;
  }

  &-top-label {
    @apply maz-mb-2 maz-text-foreground;
  }

  &-bottom-text {
    @apply maz-mt-1 maz-text-sm;
  }

  &-wrapper {
    @apply maz-relative maz-z-1 maz-flex maz-flex-1 maz-overflow-hidden maz-bg-surface maz-transition-colors maz-duration-300 maz-size-full;

    &.--border {
      @apply maz-border maz-border-solid;
    }

    &.--block {
      @apply maz-w-full;
    }

    &.--default-border {
      @apply maz-border-divider dark:maz-border-divider-400;
    }

    &-input {
      @apply maz-relative maz-flex maz-w-full maz-max-w-full maz-flex-1 maz-items-center;

      &.--has-left-icon {
        .m-input-input {
          @apply maz-pl-2;
        }

        .m-input-label {
          @apply maz-left-2;
        }
      }

      &.--has-right-icon {
        .m-input-input {
          @apply maz-pr-2;
        }
      }

      &.--xl {
        height: calc(4rem - (var(--maz-border-width) * 2));

        & .m-input-input,
        & .m-input-label {
          @apply maz-text-xl;
        }
      }

      &.--lg {
        height: calc(3.5rem - (var(--maz-border-width) * 2));

        & .m-input-input,
        & .m-input-label {
          @apply maz-text-lg;
        }
      }

      &.--md {
        height: calc(3rem - (var(--maz-border-width) * 2));
      }

      &.--sm {
        height: calc(2.5rem - (var(--maz-border-width) * 2));

        & .m-input-input,
        & .m-input-label {
          @apply maz-text-sm;
        }
      }

      &.--xs {
        height: calc(2rem - (var(--maz-border-width) * 2));

        & .m-input-input,
        & .m-input-label {
          @apply maz-text-xs;
        }
      }

      &.--mini {
        height: calc(1.5rem - (var(--maz-border-width) * 2));

        & .m-input-input,
        & .m-input-label {
          @apply maz-text-xs;
        }
      }
    }

    &-right,
    &-left {
      @apply maz-relative maz-z-1 maz-flex maz-space-x-1 maz-py-1 maz-flex-center;
    }

    &-right {
      @apply maz-pr-2;
    }

    &-left {
      @apply maz-pl-2;
    }

    &.--rounded {
      &-sm {
        @apply maz-rounded-sm;
      }

      &-md {
        @apply maz-rounded-md;
      }

      &-lg {
        @apply maz-rounded;
      }

      &-xl {
        @apply maz-rounded-xl;
      }

      &-full {
        @apply maz-rounded-full;
      }
    }
  }

  &-input {
    @apply maz-m-0 maz-h-full maz-w-full maz-appearance-none maz-truncate maz-border-none maz-bg-transparent maz-py-0 maz-text-foreground maz-shadow-none maz-outline-none maz-px-4;

    transition: padding 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &::placeholder {
      @apply maz-text-muted;
    }
  }

  &-label {
    @apply maz-pointer-events-none maz-absolute maz-w-full maz-origin-top-left maz-items-center maz-overflow-hidden maz-truncate maz-whitespace-nowrap maz-text-start maz-leading-6 maz-left-4;

    width: calc(100% + 1.3rem);
    transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }

  &:not(.--should-up) {
    & .m-input-label {
      width: calc(100% - 0.75rem);
    }
  }

  &.--should-up {
    & .m-input-label {
      /* @apply maz-top-2; */
      transform: scale(0.8) translateY(-0.65em);
    }

    & .m-input-input {
      @apply maz-pt-4;
    }
  }

  &:not(.--has-state) {
    @apply maz-text-muted;
  }

  &.--has-z-2 {
    & .m-input-wrapper {
      @apply maz-z-2;
    }
  }

  &.--is-readonly {
    & .m-input-input {
      @apply maz-cursor-default;
    }
  }

  &:has(input:disabled) {
    & .m-input-wrapper {
      @apply maz-bg-surface-600 dark:maz-bg-surface-300 maz-text-muted;
    }

    & .m-input-input {
      @apply maz-cursor-not-allowed maz-text-muted;
    }
  }

  &:not(:has(input:disabled)) {
    & .m-input-wrapper {
      @apply dark:maz-bg-surface-400;
    }
  }

  &.--is-focused {
    & .m-input-wrapper {
      @apply maz-z-3;
    }
  }

  &.--has-label {
    .m-input-label {
      @apply maz-pe-3;
    }
  }
}
</style>
