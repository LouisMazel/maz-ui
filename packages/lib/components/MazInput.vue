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
        <slot v-if="$slots['left-icon'] || leftIcon" name="left-icon">
          <MazIcon :name="leftIcon" class="maz-text-xl maz-text-muted" />
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
        <slot v-if="$slots['right-icon'] || rightIcon" name="right-icon">
          <MazIcon :name="rightIcon" class="maz-text-xl maz-text-muted" />
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
    type PropType,
    getCurrentInstance,
    defineAsyncComponent,
    useSlots,
    type HTMLAttributes,
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

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    modelValue: {
      type: [String, Number, Boolean] as PropType<ModelValueSimple>,
      default: undefined,
    },
    placeholder: { type: String, default: undefined },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
    label: { type: String, default: undefined },
    name: { type: String, default: 'input' },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => {
        return [
          'text',
          'date',
          'number',
          'tel',
          'search',
          'url',
          'password',
          'month',
          'time',
          'week',
          'email',
        ].includes(value)
      },
    },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    id: { type: String, default: undefined },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    warning: { type: Boolean, default: false },
    hint: { type: String, default: undefined },
    inputClasses: { type: String, default: undefined },
    noBorder: { type: Boolean, default: false },
    noRadius: { type: Boolean, default: false },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    debounce: { type: Boolean, default: false },
    debounceDelay: { type: Number, default: 500 },
    validButton: { type: Boolean, default: false },
    validButtonLoading: { type: Boolean, default: false },
    autoFocus: { type: Boolean, default: false },
    borderActive: { type: Boolean, default: false },
    leftIcon: { type: String, default: undefined },
    rightIcon: { type: String, default: undefined },
  })

  const emits = defineEmits(['focus', 'blur', 'update:model-value', 'click', 'change', 'update'])

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

  const debounceEmitValue = debounceFn((value: unknown) => {
    emits('update:model-value', value)
  }, props.debounceDelay)

  const emitValue = (value: unknown) => {
    if (props.debounce) return debounceEmitValue(value)

    emits('update:model-value', value)
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

      & .m-input-input,
      & .m-input-label {
        @apply maz-text-base;
      }
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
