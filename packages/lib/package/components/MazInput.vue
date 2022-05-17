<template>
  <div
    class="m-input"
    :class="[
      {
        '--is-focused': isFocused,
        '--should-up': shouldUp,
        '--has-label': hasLabel,
        '--is-disabled': disabled,
        '--is-readonly': readonly,
        '--has-z-2': error || warning || success,
        '--has-state': error || warning || success,
      },
      $attrs.class,
      `--${color}`,
      `--${size}`,
    ]"
    @click="$emit('click', $event)"
  >
    <div
      class="m-input-wrapper maz-border"
      :class="[inputClasses, borderStyle, { 'maz-rounded-lg': !noRadius }]"
    >
      <div v-if="hasLeftPart()" class="m-input-wrapper-left">
        <slot v-if="$slots['left-icon'] || leftIcon" name="left-icon">
          <MazIcon :name="leftIcon" class="maz-text-muted" />
        </slot>
      </div>

      <div class="m-input-wrapper-input">
        <input
          :id="id"
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
        />

        <label
          v-if="label || hint"
          ref="label"
          :for="id"
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
        </label>
      </div>

      <div v-if="hasRightPart()" class="m-input-wrapper-right">
        <slot v-if="$slots['right-icon'] || rightIcon" name="right-icon">
          <MazIcon :name="rightIcon" class="maz-text-muted" />
        </slot>

        <MazBtn
          v-if="isPasswordType"
          color="transparent"
          tabindex="-1"
          size="mini"
          @click.stop="hasPasswordVisible = !hasPasswordVisible"
        >
          <MazIcon
            v-if="hasPasswordVisible"
            :src="EyeOffIcon"
            class="maz-text-muted"
          />
          <MazIcon v-else :src="EyeIcon" class="maz-text-muted" />
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
            <MazIcon :src="CheckIcon" class="maz-text-normal" />
          </MazBtn>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, type PropType } from 'vue'
  import { debounce } from '../helpers/debounce'
  import MazBtn from './MazBtn.vue'
  import MazIcon from './MazIcon.vue'
  import type { Color, Size } from './types'
  export type { Color, Size } from './types'
  import EyeOffIcon from '@package/icons/eye-off.svg'
  import EyeIcon from '@package/icons/eye.svg'
  import CheckIcon from '@package/icons/check.svg'

  export default defineComponent({
    components: { MazBtn, MazIcon },
    inheritAttrs: false,
    props: {
      modelValue: {
        type: [String, Number] as PropType<
          string | number | null | undefined | boolean
        >,
        default: undefined,
      },
      placeholder: { type: String, default: undefined },
      color: {
        type: String as PropType<Color>,
        default: 'primary',
        validator: (value: string) => {
          return [
            'primary',
            'secondary',
            'warning',
            'danger',
            'info',
            'success',
            'white',
            'black',
            'transparent',
          ].includes(value)
        },
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
      id: { type: String, default: 'MazInput' },
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
      leftIcon: { type: String, default: undefined },
      rightIcon: { type: String, default: undefined },
    },
    emits: ['focus', 'blur', 'update:model-value', 'click', 'change', 'update'],
    setup(props, { emit, slots }) {
      const hasPasswordVisible = ref(false)
      const isFocused = ref(false)
      const input = ref<HTMLElement | undefined>()

      onMounted(() => {
        if (props.autoFocus) {
          input.value?.focus()
        }
      })

      const isPasswordType = computed(() => props.type === 'password')

      const inputType = computed(() =>
        hasPasswordVisible.value ? 'text' : props.type,
      )

      const borderStyle = computed(() => {
        if (props.noBorder) return undefined
        if (props.error) return 'maz-border-danger'
        if (props.success) return 'maz-border-success'
        if (props.warning) return 'maz-border-warning'
        if (isFocused.value) {
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

      const computedPlaceholder = computed(() => {
        const { required, placeholder } = props
        if (!placeholder) return undefined
        return required ? `${placeholder} *` : placeholder
      })

      const hasValue = computed(
        () => props.modelValue !== undefined && props.modelValue !== '',
      )

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
        emit('focus', event)
        isFocused.value = true
      }

      const blur = (event: Event) => {
        emit('blur', event)
        isFocused.value = false
      }

      const change = (event: Event) => emit('change', event)

      const debounceEmitValue = debounce((value: unknown) => {
        emit('update:model-value', value)
      }, props.debounceDelay)

      const emitValue = (value: unknown) => {
        if (props.debounce) return debounceEmitValue(value)

        emit('update:model-value', value)
      }

      return {
        inputValue,
        shouldUp,
        hasLabel,
        computedPlaceholder,
        isPasswordType,
        inputType,
        input,
        isFocused,
        hasPasswordVisible,
        borderStyle,
        focus,
        blur,
        change,
        emitValue,
        hasRightPart,
        hasLeftPart,
        EyeOffIcon,
        EyeIcon,
        CheckIcon,
      }
    },
  })
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
      @apply maz-relative maz-z-1 maz-flex maz-flex-1 maz-overflow-hidden
        maz-border-solid maz-bg-color maz-transition-colors maz-duration-300;

      &.--default-border {
        @apply maz-border-gray-200;
      }

      &-input {
        @apply maz-relative maz-flex maz-flex-1 maz-items-center;
      }

      &-right,
      &-left {
        @apply maz-relative maz-z-1 maz-flex maz-space-x-1 maz-py-1 maz-flex-center;
      }

      &-right {
        @apply maz-px-1;
      }

      &-left {
        @apply maz-left-1;
      }
    }

    &-input {
      @apply maz-outline-none maz-m-0 maz-block maz-h-full maz-w-full maz-appearance-none
        maz-border-none maz-bg-transparent maz-py-0 maz-px-4 maz-text-normal maz-shadow-none;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--maz-color-text);
        box-shadow: 0 0 0 1000px var(--maz-color-primary-50) inset;
        transition: background-color 5000s ease-in-out 0s;
      }
    }

    &-label {
      @apply maz-pointer-events-none maz-absolute maz-block maz-w-max maz-origin-top-left maz-truncate;
      @apply maz-left-4 maz-leading-6;

      transition: transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    &:not(.--has-state) {
      @apply maz-text-muted;
    }

    &.--has-z-2 {
      & .m-input-wrapper {
        @apply maz-z-2;
      }
    }

    &.--should-up {
      & .m-input-label {
        transform: scale(0.8) translateY(-0.65rem);
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

    &.--is-focused {
      & .m-input-wrapper {
        @apply maz-z-3;
      }
    }

    &.--has-label {
      .m-input-input {
        @apply maz-px-4 maz-pt-4;
      }
    }
  }

  html.dark {
    & .m-input:not(.--is-disabled) {
      & .m-input-wrapper {
        @apply maz-bg-color-light;
      }
    }

    & .m-input:not(.--is-focused):not(.--has-state) {
      & .m-input-wrapper.--default-border {
        @apply maz-border-color-lighter;
      }
    }

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
