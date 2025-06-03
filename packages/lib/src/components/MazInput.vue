<script lang="ts" setup generic="T extends ModelValueSimple">
import type { HTMLAttributes } from 'vue'
import type { Color, Icon, ModelValueSimple, Size } from './types'
import {
  computed,
  defineAsyncComponent,

  onMounted,
  ref,
  useSlots,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { debounce as debounceFn } from '../helpers/debounce'

export interface MazInputProps<T = ModelValueSimple> {
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /**
   * The value of the input
   * @model
   */
  modelValue?: T | undefined
  /** The placeholder of the input */
  placeholder?: string
  /**
   * The label of the component
   * This label will be displayed inside the input and will be up when the input is focused
   */
  label?: string
  /**
   * The top label of the component
   * This label will be displayed above the input
   */
  topLabel?: string
  /**
   * The additional text of the component
   * This text will be displayed below the input
   */
  assistiveText?: string
  /** The attribut name of the input */
  name?: string
  /** The color of the component */
  color?: Color
  /** The attribut type of the input */
  type?:
    | 'text'
    | 'date'
    | 'number'
    | 'tel'
    | 'search'
    | 'url'
    | 'password'
    | 'month'
    | 'time'
    | 'week'
    | 'email'
  /** The attribut required of the input */
  required?: boolean
  /** The attribut disabled of the input */
  disabled?: boolean
  /** The attribut readonly of the input */
  readonly?: boolean
  /** The attribut id of the input */
  id?: string
  /** Enable error state UI */
  error?: boolean
  /** Enable success state UI */
  success?: boolean
  /** Enable warning state UI */
  warning?: boolean
  /** The hint will replace the label */
  hint?: string
  /** The class of the input wrapper div element */
  inputClasses?: string
  /** Remove the border of the input */
  border?: boolean
  /** The attribut inputmode of the input */
  inputmode?: HTMLAttributes['inputmode']
  /** The size of the component */
  size?: Size
  /** Enable debounce on input - can be `boolean | number`, if it is a number, it is used for the debounce delay - if `true`, the delay is 500ms */
  debounce?: boolean | number
  /** Display the valid button - this button has type="submit"  */
  validButton?: boolean
  /** Display the loading state on the valid button */
  validButtonLoading?: boolean
  /** if true the input will be focus on render */
  autoFocus?: boolean
  /** if true the component has the colorized border by default, not only on focus */
  borderActive?: boolean
  /**
   * The left icon of the input
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  leftIcon?: string | Icon
  /**
   * The right icon of the input
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  rightIcon?: string | Icon
  /**
   * Size radius of the component's border
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'lg'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** The input will be displayed in full width */
  block?: boolean
  /** The attribut autocomplete of the input */
  autocomplete?: string
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
  name: undefined,
  id: undefined,
  color: 'primary',
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  error: false,
  success: false,
  warning: false,
  hint: undefined,
  inputClasses: undefined,
  border: true,
  inputmode: 'text',
  size: 'md',
  debounce: false,
  validButton: false,
  validButtonLoading: false,
  autoFocus: false,
  borderActive: false,
  leftIcon: undefined,
  rightIcon: undefined,
  roundedSize: 'lg',
})

const emits = defineEmits<{
  /**
   * Event emitted when the input value change
   * @property {string | number | null | undefined | boolean} value - the new value
   */
  'update:model-value': [value?: T]
  /**
   * Event emitted when the input is focused
   * @property {Event} event - focus event
   */
  'focus': [event: Event]
  /**
   * Event emitted when the input is blurred
   * @property {Event} event - blur event
   */
  'blur': [event: Event]
  /**
   * Event emitted when the input is clicked
   * @property {Event} event - click event
   */
  'click': [event: Event]
  /**
   * Event emitted when the input is changed
   * @property {Event} event - change event
   */
  'change': [event: Event]
  /**
   * Event emitted when the input is changed
   * @property {Event} event - change event
   */
  'input': [event: Event]
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const EyeOffIcon = defineAsyncComponent(() => import('../../icons/eye-slash.svg'))
const EyeIcon = defineAsyncComponent(() => import('../../icons/eye.svg'))
const CheckIcon = defineAsyncComponent(() => import('../../icons/check.svg'))

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
  if (props.error)
    return 'maz-border-danger'
  if (props.success)
    return 'maz-border-success'
  if (props.warning)
    return 'maz-border-warning'

  if (isFocused.value || props.borderActive) {
    if (props.color === 'black')
      return 'maz-border-black'
    if (props.color === 'danger')
      return 'maz-border-danger'
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
    if (props.color === 'white')
      return 'maz-border-white'
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
    || !!slots['valid-button']
    || props.validButton
    || !!props.rightIcon
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
</script>

<template>
  <div
    class="m-input" :class="[
      {
        '--is-focused': isFocused || borderActive,
        '--should-up': shouldUp,
        '--has-label': hasLabel,
        '--is-disabled': disabled,
        '--is-readonly': readonly,
        '--has-z-2': error || warning || success,
        '--has-state': error || warning || success,
        '--block': block,
      },
      props.class,
      `--${color}`,
    ]" :style
  >
    <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
    <label v-if="topLabel" :for="instanceId" class="m-input-top-label">{{ topLabel }}</label>

    <div
      class="m-input-wrapper m-reset-css"
      :class="[
        inputClasses,
        borderStyle,
        `--rounded-${roundedSize}`,
        { '--block': block },
      ]"
    >
      <div v-if="hasLeftPart()" class="m-input-wrapper-left">
        <!--
          @slot left-icon - The icon to display on the left of the input
        -->
        <slot v-if="$slots['left-icon'] || leftIcon" name="left-icon">
          <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" class="maz-text-xl maz-text-muted" />
          <Component :is="leftIcon" v-else-if="leftIcon" class="maz-text-xl maz-text-muted" />
        </slot>
      </div>

      <div class="m-input-wrapper-input" :class="[`--${size}`, { '--top-label': !!topLabel }]">
        <input
          :id="instanceId"
          v-bind="$attrs"
          ref="input"
          v-model="model"
          :name
          :placeholder
          :aria-label="label || placeholder"
          :type="inputType"
          :inputmode
          :disabled
          :readonly
          :autocomplete
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
          v-if="label || hint" class="m-input-label" :class="[
            {
              'maz-text-danger-600': error,
              'maz-text-success-600': success,
              'maz-text-warning-600': warning,
            },
          ]"
        >
          {{ hint || label }}
        </span>
      </div>

      <div v-if="hasRightPart()" class="m-input-wrapper-right">
        <!--
          @slot right-icon - The icon to display on the right of the input
        -->
        <slot v-if="$slots['right-icon'] || rightIcon" name="right-icon">
          <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" class="maz-text-xl maz-text-muted" />
          <Component :is="rightIcon" v-else-if="rightIcon" class="maz-text-xl maz-text-muted" />
        </slot>

        <MazBtn
          v-if="isPasswordType" color="transparent" tabindex="-1" size="mini"
          @click.stop="hasPasswordVisible = !hasPasswordVisible"
        >
          <EyeOffIcon v-if="hasPasswordVisible" class="maz-text-xl maz-text-muted" />
          <EyeIcon v-else class="maz-text-xl maz-text-muted" />
        </MazBtn>

        <!--
          @slot valid-button - Replace the valid button by your own
        -->
        <slot v-if="$slots['valid-button'] || validButton" name="valid-button">
          <MazBtn
            color="transparent" :disabled="disabled" tabindex="-1" :loading="validButtonLoading"
            class="m-input-valid-button" size="mini" type="submit"
          >
            <CheckIcon class="maz-text-2xl maz-text-normal" />
          </MazBtn>
        </slot>
      </div>
    </div>

    <div
      v-if="assistiveText" class="m-input-bottom-text" :class="[
        {
          'maz-text-danger-600': error,
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
    @apply maz-mb-2 maz-text-normal;
  }

  &-bottom-text {
    @apply maz-mt-1 maz-text-sm;
  }

  &-wrapper {
    @apply maz-relative maz-z-1 maz-flex maz-flex-1 maz-overflow-hidden maz-border maz-border-solid maz-bg-color maz-transition-colors maz-duration-300;

    &.--block {
      @apply maz-w-full;
    }

    &.--default-border {
      @apply maz-border-border dark:maz-border-color-lighter;
    }

    &-input {
      @apply maz-relative maz-flex maz-w-full maz-max-w-full maz-flex-1 maz-items-center;

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
    @apply maz-m-0 maz-h-full maz-w-full maz-appearance-none maz-truncate maz-border-none maz-bg-transparent maz-px-4 maz-py-0 maz-text-normal maz-shadow-none maz-outline-none;

    transition: padding 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: var(--maz-color-text);
      box-shadow: 0 0 0 1000px var(--maz-color-primary-50) inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &::placeholder {
      @apply maz-text-muted;
    }
  }

  &-label {
    @apply maz-pointer-events-none maz-absolute maz-left-3 maz-w-full maz-origin-top-left maz-items-center maz-overflow-hidden maz-truncate maz-whitespace-nowrap maz-text-start maz-leading-6;

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

  &.--is-disabled {
    & .m-input-wrapper {
      @apply maz-bg-color-lighter maz-text-muted;
    }

    & .m-input-input {
      @apply maz-cursor-not-allowed maz-text-muted;
    }
  }

  &:not(.--is-disabled) {
    & .m-input-wrapper {
      @apply dark:maz-bg-color-light;
    }
  }

  &.--is-focused {
    & .m-input-wrapper {
      @apply maz-z-3;
    }
  }

  &.--has-label {
    .m-input-label {
      @apply maz-pr-3;

      [dir='rtl'] & {
        @apply maz-pr-0 maz-pl-3;
      }
    }

    .m-input-input {
      @apply maz-px-3;
    }
  }
}

html.dark,
.m-input.dark {
  & .m-input-input {
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: var(--maz-color-text);
      box-shadow: 0 0 0 1000px var(--maz-color-bg-lighter) inset;
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}
</style>
