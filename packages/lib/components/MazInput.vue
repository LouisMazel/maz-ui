<template>
  <div
    class="m-input"
    :class="[
      {
        '--is-focused': isFocused || borderActive,
        '--should-up': shouldUp,
        '--has-label': hasLabel,
        '--is-disabled': disabled,
        '--is-readonly': readonly,
        '--has-z-2': error || warning || success,
        '--has-state': error || warning || success,
      },
      props.class,
      `--${color}`,
      `--${size}`,
    ]"
    :style="style"
  >
    <div class="m-input-wrapper" :class="[inputClasses, borderStyle, { 'maz-rounded': !noRadius }]">
      <div v-if="hasLeftPart()" class="m-input-wrapper-left">
        <!--
          @slot left-icon - The icon to display on the left of the input
        -->
        <slot v-if="$slots['left-icon'] || leftIcon" name="left-icon">
          <MazIcon
            v-if="typeof leftIcon === 'string'"
            :name="leftIcon"
            class="maz-text-xl maz-text-muted"
          />
          <Component :is="leftIcon" v-else-if="leftIcon" class="maz-text-xl maz-text-muted" />
        </slot>
      </div>

      <div class="m-input-wrapper-input">
        <input
          :id="instanceId"
          ref="input"
          v-model="inputValue"
          :type="inputType"
          :name="name"
          v-bind="$attrs"
          :inputmode="inputmode"
          :placeholder="computedPlaceholder"
          :aria-label="label || placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          class="m-input-input"
          v-on="{
            blur,
            focus,
            change,
          }"
          @click="$emit('click', $event)"
        />

        <span
          v-if="label || hint"
          ref="label"
          class="m-input-label"
          :class="[
            {
              'maz-text-danger-600': error,
              'maz-text-success-600': success,
              'maz-text-warning-600': warning,
            },
          ]"
        >
          {{ hint || label }}
          <sup v-if="required">*</sup>
        </span>
      </div>

      <div v-if="hasRightPart()" class="m-input-wrapper-right">
        <!--
          @slot right-icon - The icon to display on the right of the input
        -->
        <slot v-if="$slots['right-icon'] || rightIcon" name="right-icon">
          <MazIcon
            v-if="typeof rightIcon === 'string'"
            :name="rightIcon"
            class="maz-text-xl maz-text-muted"
          />
          <Component :is="rightIcon" v-else-if="rightIcon" class="maz-text-xl maz-text-muted" />
        </slot>

        <MazBtn
          v-if="isPasswordType"
          color="transparent"
          tabindex="-1"
          size="mini"
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
            color="transparent"
            :disabled="disabled"
            tabindex="-1"
            :loading="validButtonLoading"
            class="m-input-valid-button"
            size="mini"
            type="submit"
          >
            <CheckIcon class="maz-text-2xl maz-text-normal" />
          </MazBtn>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    onMounted,
    ref,
    getCurrentInstance,
    defineAsyncComponent,
    useSlots,
    type HTMLAttributes,
    type FunctionalComponent,
    type ComponentPublicInstance,
    type Component,
    type SVGAttributes,
  } from 'vue'

  import { debounce as debounceFn } from './../modules/helpers/debounce'
  import { useInstanceUniqId } from '../modules/composables/use-instance-uniq-id'

  import type { Color, ModelValueSimple, Size } from './types'
  export type { Color, Size, ModelValueSimple } from './types'

  const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
  const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

  const EyeOffIcon = defineAsyncComponent(() => import('./../icons/eye-slash.svg'))
  const EyeIcon = defineAsyncComponent(() => import('./../icons/eye.svg'))
  const CheckIcon = defineAsyncComponent(() => import('./../icons/check.svg'))

  type Icon = FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component

  defineOptions({
    inheritAttrs: false,
  })

  /**
   * The value of the input
   * @model
   */
  const model = defineModel<ModelValueSimple>({
    default: undefined,
  })

  export type Props = {
    /** The style of the component */
    style?: HTMLAttributes['style']
    /** The class of the component */
    class?: HTMLAttributes['class']
    /** The placeholder of the input */
    placeholder?: string
    /** The label of the component */
    label?: string
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
    noBorder?: boolean
    /** Remove the radius of the input */
    noRadius?: boolean
    /** The attribut inputmode of the input */
    inputmode?: HTMLAttributes['inputmode']
    /** The size of the component */
    size?: Size
    /** Enable debounce on input */
    debounce?: boolean
    /** The delay of the debounce */
    debounceDelay?: number
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
  }

  const props = withDefaults(defineProps<Props>(), {
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
    noBorder: false,
    noRadius: false,
    inputmode: 'text',
    size: 'md',
    debounce: false,
    debounceDelay: 500,
    validButton: false,
    validButtonLoading: false,
    autoFocus: false,
    borderActive: false,
    leftIcon: undefined,
    rightIcon: undefined,
  })

  const emits = defineEmits<{
    /**
     * Event emitted when the input is focused
     * @property {Event} event - focus event
     */
    (eventName: 'focus', event: Event): void
    /**
     * Event emitted when the input is blurred
     * @property {Event} event - blur event
     */
    (eventName: 'blur', event: Event): void
    /**
     * Event emitted when the input is clicked
     * @property {Event} event - click event
     */
    (eventName: 'click', event: Event): void
    /**
     * Event emitted when the input is changed
     * @property {Event} event - change event
     */
    (eventName: 'change', event: Event): void
  }>()

  const hasPasswordVisible = ref(false)
  const isFocused = ref(false)
  const input = ref<HTMLElement | undefined>()

  const instance = getCurrentInstance()

  const instanceId = useInstanceUniqId({
    componentName: 'MazInput',
    instance,
    providedId: props.id,
  })

  onMounted(() => {
    if (props.autoFocus) {
      input.value?.focus()
    }
  })

  const isPasswordType = computed(() => props.type === 'password')

  const inputType = computed(() => (hasPasswordVisible.value ? 'text' : props.type))

  const borderStyle = computed(() => {
    if (props.noBorder) return undefined
    if (props.error) return 'maz-border-danger'
    if (props.success) return 'maz-border-success'
    if (props.warning) return 'maz-border-warning'
    if (isFocused.value || props.borderActive) {
      if (props.color === 'black') return 'maz-border-black'
      if (props.color === 'danger') return 'maz-border-danger'
      if (props.color === 'info') return 'maz-border-info'
      if (props.color === 'primary') return 'maz-border-primary'
      if (props.color === 'secondary') return 'maz-border-secondary'
      if (props.color === 'success') return 'maz-border-success'
      if (props.color === 'warning') return 'maz-border-warning'
      if (props.color === 'white') return 'maz-border-white'
    }
    return '--default-border'
  })

  const slots = useSlots()

  const computedPlaceholder = computed(() => {
    const { required, placeholder } = props
    if (!placeholder) return undefined
    return required ? `${placeholder} *` : placeholder
  })

  const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== '')

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value: unknown) => emitValue(value),
  })

  const shouldUp = computed(() => {
    return (
      (!!props.label || !!props.hint) &&
      (isFocused.value ||
        !!hasValue.value ||
        !!props.placeholder ||
        ['date', 'month', 'week'].includes(props.type))
    )
  })

  const hasLabel = computed(() => !!props.label || !!props.hint)

  const hasRightPart = (): boolean => {
    return (
      !!slots['right-icon'] ||
      isPasswordType.value ||
      !!slots['valid-button'] ||
      props.validButton ||
      !!props.rightIcon
    )
  }

  const hasLeftPart = (): boolean => {
    return !!slots['left-icon'] || !!props.leftIcon
  }

  const focus = (event: Event) => {
    emits('focus', event)
    isFocused.value = true
  }

  const blur = (event: Event) => {
    emits('blur', event)
    isFocused.value = false
  }

  const change = (event: Event) => emits('change', event)

  const debounceEmitValue = debounceFn((value?: ModelValueSimple) => {
    model.value = value
  }, props.debounceDelay)

  const emitValue = (value) => {
    if (props.debounce) return debounceEmitValue(value)
    model.value = value
  }
</script>

<style lang="postcss" scoped>
  .m-input {
    @apply maz-flex maz-flex-col;

    &.--xl {
      @apply maz-h-16;

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-xl;
      }
    }

    &.--lg {
      @apply maz-h-14;

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-lg;
      }
    }

    &.--md {
      @apply maz-h-12;
    }

    &.--sm {
      @apply maz-h-10;

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-sm;
      }
    }

    &.--xs {
      @apply maz-h-8;

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-xs;
      }
    }

    &.--mini {
      @apply maz-h-6;

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-xs;
      }
    }

    &-wrapper {
      @apply maz-relative maz-z-1 maz-flex maz-flex-1 maz-overflow-hidden maz-border maz-border-solid maz-bg-color maz-transition-colors maz-duration-300;

      &.--default-border {
        @apply maz-border-gray-200 dark:maz-border-color-lighter;
      }

      &-input {
        @apply maz-relative maz-flex maz-w-full maz-max-w-full maz-flex-1 maz-items-center;
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
    }

    &-input {
      @apply maz-m-0 maz-block maz-h-full maz-w-full maz-appearance-none maz-truncate maz-border-none maz-bg-transparent maz-px-4 maz-py-0 maz-text-normal maz-shadow-none maz-outline-none;

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
      @apply maz-pointer-events-none maz-absolute maz-left-3 maz-block maz-w-full maz-origin-top-left maz-items-center maz-overflow-hidden maz-truncate maz-whitespace-nowrap maz-text-left maz-leading-6;

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
      .m-input-input {
        @apply maz-px-3 maz-pt-4;
      }
    }
  }

  html.dark {
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
