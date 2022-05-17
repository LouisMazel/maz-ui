<template>
  <Component
    v-bind="$attrs"
    :is="component"
    :disabled="isDisabled"
    class="m-btn"
    :class="[
      `--${size}`,
      btnColorClass,
      cursorClass,
      variantClass,
      {
        '--block': block,
        '--no-underline': noUnderline,
        '--no-leading': noLeading,
        '--fab': fab,
        '--loading': loading,
        '--disabled': isDisabled,
        '--icon': hasIcon,
        '--rounded': rounded,
        '--no-padding': noPadding,
        '--no-elevation': noElevation,
      },
    ]"
    :type="btnType"
  >
    <div v-if="hasLeftIcon" class="m-btn__icon-left maz-flex maz-flex-center">
      <slot name="left-icon">
        <MazIcon v-if="leftIcon" :name="leftIcon" />
      </slot>
    </div>
    <span class="maz-flex maz-flex-center">
      <slot></slot>
    </span>
    <div v-if="hasRightIcon" class="m-btn__icon-right maz-flex maz-flex-center">
      <slot name="right-icon">
        <MazIcon v-if="rightIcon" :name="rightIcon" />
      </slot>
    </div>
    <div
      v-if="hasLoader"
      class="m-btn__loading-wrapper"
      :class="loaderBgColorClass"
    >
      <MazSpinner size="2em" :color="loaderColor" />
    </div>
  </Component>
</template>

<script lang="ts">
  export type { Color, Size } from './types'
</script>

<script lang="ts" setup>
  import { computed, type PropType, useAttrs, useSlots } from 'vue'
  import MazSpinner from './MazSpinner.vue'
  import MazIcon from './MazIcon.vue'

  import type { Color, Size } from './types'

  const { href, to } = useAttrs()
  const slots = useSlots()

  const props = defineProps({
    variant: {
      type: String,
      default: 'button',
      validator: (value: string) => {
        return ['button', 'link'].includes(value)
      },
    },
    size: {
      type: String as PropType<Size>,
      default: 'md',
      validator: (value: string) => {
        return ['mini', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      },
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: Color) => {
        return [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => {
        return ['button', 'submit'].includes(value)
      },
    },
    rounded: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    pastel: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    noUnderline: { type: Boolean, default: false },
    noLeading: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    fab: { type: Boolean, default: false },
    leftIcon: { type: String, default: undefined },
    rightIcon: { type: String, default: undefined },
    noPadding: { type: Boolean, default: false },
    noElevation: { type: Boolean, default: false },
  })

  const component = computed(() => {
    if (href) return 'a'
    else if (to) return 'router-link'
    return 'button'
  })

  const btnColorClass = computed(() =>
    props.pastel
      ? `--${props.color}-pastel`
      : props.outline || props.loading
      ? `--${props.color}-outline`
      : `--${props.color}`,
  )
  const isDisabled = computed(
    () => (props.loading || props.disabled) && component.value === 'button',
  )
  const cursorClass = computed(() =>
    isDisabled.value ? '--cursor-default' : '--cursor-pointer',
  )
  const variantClass = computed(() => `--is-${props.variant}`)
  const loaderBgColorClass = computed(() => `--${props.color}`)
  const loaderColor = computed(() =>
    ['white'].includes(props.color) ? 'black' : 'white',
  )
  const hasLoader = computed(() => props.loading && props.variant === 'button')
  const hasLeftIcon = computed(() => !!slots['left-icon'] || props.leftIcon)
  const hasRightIcon = computed(() => !!slots['right-icon'] || props.rightIcon)
  const hasIcon = computed(() => hasLeftIcon.value || hasRightIcon.value)
  const btnType = computed(() =>
    component.value === 'button' ? props.type : undefined,
  )
</script>

<style lang="postcss" scoped>
  .m-btn {
    @apply maz-border maz-border-solid maz-border-transparent maz-text-center maz-text-base maz-text-normal;

    & span {
      @apply maz-leading-none;
    }

    &__icon-left {
      @apply maz-mr-2 maz--ml-1 maz-leading-none;
    }

    &__icon-right {
      @apply maz-ml-2 maz--mr-1 maz-leading-none;
    }

    &.--cursor-pointer {
      @apply maz-cursor-pointer;
    }

    &.--cursor-default {
      @apply maz-cursor-default;
    }

    &.--is-link {
      @apply maz-outline-none maz-inline-flex maz-items-center
        maz-bg-transparent maz-transition maz-duration-200 maz-ease-in-out;

      &:not(.--no-leading) {
        @apply maz-leading-9;
      }

      &:not(:disabled):hover,
      &:not(:disabled):focus {
        &:not(.--no-underline) {
          @apply maz-underline;
        }
      }

      &.--secondary {
        @apply maz-text-secondary;
      }

      &.--info {
        @apply maz-text-info;
      }

      &.--warning {
        @apply maz-text-warning-600;
      }

      &.--danger {
        @apply maz-text-danger-600;
      }

      &.--success {
        @apply maz-text-success-600;
      }

      &.--white {
        @apply maz-text-white;
      }

      &.--black {
        @apply maz-text-black;
      }
    }

    &.--is-button {
      @apply maz-relative maz-inline-flex maz-items-center maz-justify-center maz-overflow-hidden
        maz-rounded-lg maz-border-transparent maz-bg-transparent maz-font-medium maz-no-underline
        maz-transition maz-duration-300 maz-ease-in-out;

      &.--rounded {
        @apply maz-rounded-full;
      }

      &.--xl {
        @apply maz-px-8 maz-text-xl;

        padding-top: 1.325rem;
        padding-bottom: 1.325rem;
      }

      &.--lg {
        @apply maz-px-6 maz-text-lg;

        padding-top: 1rem;
        padding-bottom: 1rem;
      }

      &.--md {
        @apply maz-px-4 maz-text-base;

        padding-top: 0.88rem;
        padding-bottom: 0.88rem;
      }

      &.--sm {
        @apply maz-px-3 maz-text-sm;

        padding-top: 0.625rem;
        padding-bottom: 0.625rem;
      }

      &.--xs {
        @apply maz-px-2 maz-text-sm;

        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
      }

      &.--mini {
        @apply maz-px-1 maz-text-xs;

        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
      }

      &.--icon {
        @apply maz-py-2;
      }

      transition: background 300ms ease-in-out 0ms, color 300ms ease-in-out 0ms;

      /* Not disabled */

      &:not(.--disabled) {
        &:hover,
        &:focus {
          @apply maz-bg-gray-200;
        }
      }

      /* Fab */

      &.--fab {
        @apply maz-flex maz-h-12 maz-w-12 maz-items-center
          maz-justify-center maz-rounded-full maz-px-0 maz-py-0;

        &:not(.--no-elevation) {
          @apply maz-elevation;
        }
      }

      &.--block {
        @apply maz-w-full;
      }

      &.--primary {
        @apply maz-bg-primary maz-text-primary-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-primary-600;
        }
      }

      &.--secondary {
        @apply maz-bg-secondary maz-text-secondary-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-secondary-600;
        }
      }

      &.--info {
        @apply maz-bg-info maz-text-info-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-info-600;
        }
      }

      &.--success {
        @apply maz-bg-success maz-text-success-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-success-600;
        }
      }

      &.--warning {
        @apply maz-bg-warning maz-text-warning-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-warning-600;
        }
      }

      &.--danger {
        @apply maz-bg-danger maz-text-white;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-danger-600;
        }
      }

      &.--white {
        @apply maz-bg-white maz-text-white-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-gray-300;
        }
      }

      &.--black {
        @apply maz-bg-black maz-text-black-contrast;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-gray-800;
        }
      }

      &.--transparent {
        @apply maz-bg-transparent;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          background-color: rgb(0 0 0 / 12%);
        }
      }

      &.--primary-outline {
        @apply maz-border-primary maz-text-primary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-primary maz-text-primary-contrast;
        }
      }

      &.--secondary-outline {
        @apply maz-border-secondary maz-text-secondary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-secondary maz-text-white;
        }
      }

      &.--info-outline {
        @apply maz-border-info maz-text-info;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-info maz-text-white;
        }
      }

      &.--success-outline {
        @apply maz-border-success maz-text-success;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-success maz-text-white;
        }
      }

      &.--danger-outline {
        @apply maz-border-danger maz-text-danger;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-danger maz-text-white;
        }
      }

      &.--warning-outline {
        @apply maz-border-warning maz-text-warning;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-warning maz-text-white;
        }
      }

      &.--white-outline {
        @apply maz-border-white maz-text-white;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-white maz-text-white;
        }
      }

      &.--black-outline {
        @apply maz-border-black maz-text-black;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-black maz-text-black;
        }
      }

      &.--primary-pastel {
        @apply maz-bg-primary-50 maz-text-primary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-primary maz-text-primary-contrast;
        }
      }

      &.--secondary-pastel {
        @apply maz-bg-secondary-50 maz-text-secondary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-secondary maz-text-secondary-contrast;
        }
      }

      &.--info-pastel {
        @apply maz-bg-info-50 maz-text-info;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-info maz-text-info-contrast;
        }
      }

      &.--success-pastel {
        @apply maz-bg-success-50 maz-text-success;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-success maz-text-success-contrast;
        }
      }

      &.--danger-pastel {
        @apply maz-bg-danger-50 maz-text-danger;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-danger maz-text-danger-contrast;
        }
      }

      &.--warning-pastel {
        @apply maz-bg-warning-50 maz-text-warning;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-warning maz-text-warning-contrast;
        }
      }

      &.--white-pastel {
        @apply maz-bg-gray-100 maz-text-white;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-white maz-text-white-contrast;
        }
      }

      &.--black-pastel {
        @apply maz-bg-gray-200 maz-text-black;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-black maz-text-black-contrast;
        }
      }

      /* Disabled */
      &.--disabled {
        @apply maz-cursor-not-allowed maz-bg-color-lighter maz-text-gray-400;
      }

      &.--no-padding {
        @apply maz-p-0;
      }

      /* Loader */
      .m-btn__loading-wrapper {
        @apply maz-absolute maz-inset-0 maz-flex maz-items-center maz-justify-center;

        &.--primary {
          @apply maz-bg-primary;
        }

        &.--secondary {
          @apply maz-bg-secondary;
        }

        &.--info {
          @apply maz-bg-info;
        }

        &.--warning {
          @apply maz-bg-warning;
        }

        &.--success {
          @apply maz-bg-success;
        }

        &.--danger {
          @apply maz-bg-danger;
        }

        &.--white {
          @apply maz-bg-white;
        }

        &.--black {
          @apply maz-bg-black;
        }
      }
    }
  }
</style>
