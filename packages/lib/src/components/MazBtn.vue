<script lang="ts" setup>
import type { Color, Icon, Size } from './types'

import { computed, defineAsyncComponent, useAttrs } from 'vue'

const props = withDefaults(defineProps<MazBtnProps>(), {
  variant: 'button',
  size: 'md',
  color: 'primary',
  type: 'button',
  icon: undefined,
  leftIcon: undefined,
  rightIcon: undefined,
  roundedSize: 'lg',
  justify: 'center',
})

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const { href, to } = useAttrs()

export interface MazBtnProps {
  /**
   * The variant of the button - Change UI of component (link or button style)
   * @values `'button' | 'link'`
   * @deprecated Use the component <MazLink /> instead
   */
  variant?: 'button' | 'link'
  /**
   * The size of the button
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   */
  size?: Size
  /**
   * The color of the button
   * @values `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'white' | 'black' | 'transparent' | 'theme'`
   */
  color?: Color
  /**
   * The type of the button
   * @values `'submit' | 'reset' | 'button'`
   */
  type?: 'submit' | 'reset' | 'button'
  /**
   * If true, the button will have a full border radius
   * @default false
   */
  rounded?: boolean
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'lg'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * If true, the button will have no border radius
   * @default false
   */
  noRounded?: boolean
  /**
   * If true, the button have the "border" style
   * @default false
   */
  outline?: boolean
  /**
   * If true, the button will have a pastel color
   * @default false
   */
  pastel?: boolean
  /**
   * If true, the button will have a full width
   * @default false
   */
  block?: boolean
  /**
   * If true, the button will have no underline on hover (useful with `variant="link"`)
   * @default false
   */
  noUnderline?: boolean
  /**
   * Enable the button loader
   * @default false
   */
  loading?: boolean
  /**
   * Disable the button
   * @default false
   */
  disabled?: boolean
  /**
   * If true, the button will have a fab style
   * @default false
   */
  fab?: boolean
  /**
   * The name of the icon to display or component, only with fab
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  icon?: string | Icon
  /**
   * The name of the icon or component to display on the left of the button
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  leftIcon?: string | Icon
  /**
   * The name of the icon or component to display on the right of the button
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  rightIcon?: string | Icon
  /**
   * If true, the button will have no padding
   * @default false
   */
  noPadding?: boolean
  /**
   * If true, the button will have no box-shadow
   * @default false
   */
  noElevation?: boolean
  /**
   * Choose how the elements are aligned in the button
   */
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
}

const component = computed(() => {
  if (href)
    return 'a'
  else if (to)
    return 'router-link'
  return 'button'
})

const btnColorClass = computed(() => {
  if (props.pastel)
    return `--${props.color}-pastel`
  if (props.outline)
    return `--${props.color}-outline`
  return `--${props.color}`
})
const isDisabled = computed(
  () => (props.loading || props.disabled) && component.value === 'button',
)
const cursorClass = computed(() => (isDisabled.value ? '--cursor-default' : '--cursor-pointer'))
const variantClass = computed(() => `--is-${props.variant}`)
const hasLoader = computed(() => props.loading && props.variant === 'button')
const btnType = computed(() => (component.value === 'button' ? props.type : undefined))

const iconClassSize = computed(() => {
  if (props.size === 'xl')
    return 'maz-text-3xl'
  if (props.size === 'lg')
    return 'maz-text-2xl'
  if (props.size === 'md')
    return 'maz-text-xl'
  if (props.size === 'sm')
    return 'maz-text-lg'
  if (props.size === 'xs')
    return 'maz-text-base'
  if (props.size === 'mini')
    return 'maz-text-sm'
  return 'maz-text-xl'
})
</script>

<template>
  <Component
    :is="component"
    :disabled="isDisabled || undefined"
    class="m-btn m-reset-css"
    :class="[
      `--${size}`,
      ...[!fab && !rounded && roundedSize && `--rounded-${roundedSize}`],
      btnColorClass,
      cursorClass,
      variantClass,
      {
        '--block': block,
        '--no-underline': noUnderline,
        '--fab': fab,
        '--loading': loading,
        '--disabled': isDisabled,
        '--rounded': rounded,
        '--no-rounded': noRounded,
        '--no-padding': noPadding,
        '--no-elevation': noElevation,
      },
    ]"
    :style="[`--justify: ${justify}`]"
    :type="btnType"
  >
    <!--
      @slot left-icon - The icon to display on the left of the button
    -->
    <slot name="left-icon">
      <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" :class="[iconClassSize]" />
      <Component :is="leftIcon" v-else-if="leftIcon" :class="[iconClassSize]" />
    </slot>

    <!--
      @slot icon - The icon to display on the fab button
    -->
    <slot name="icon">
      <MazIcon v-if="typeof icon === 'string'" :name="icon" :class="[iconClassSize]" />
      <Component :is="icon" v-else-if="icon" :class="[iconClassSize]" />
    </slot>

    <!--
      @slot default - The content of the button
    -->
    <slot />

    <!--
      @slot left-icon - The icon to display on the left of the button
    -->
    <slot name="right-icon">
      <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" :class="[iconClassSize]" />
      <Component :is="rightIcon" v-else-if="rightIcon" :class="[iconClassSize]" />
    </slot>

    <div v-if="hasLoader" class="m-btn-loader-container">
      <MazSpinner size="2em" :color="color" />
    </div>
  </Component>
</template>

<style lang="postcss" scoped>
.m-btn {
  @apply maz-relative maz-items-center maz-gap-2 maz-border maz-border-solid maz-border-transparent maz-text-center maz-align-top maz-text-base maz-text-normal;

  justify-content: var(--justify);

  & span {
    @apply maz-leading-none;
  }

  &-loader-container {
    @apply maz-absolute maz-inset-0 maz-flex maz-items-center maz-justify-center maz-bg-color-light dark:maz-bg-color-lighter;
  }

  /* &-loader {
    @apply maz-absolute;
  } */

  &.--cursor-pointer {
    @apply maz-cursor-pointer;
  }

  &.--cursor-default {
    @apply maz-cursor-default;
  }

  &.--is-link {
    @apply maz-inline-flex maz-items-center
        maz-transition maz-duration-200 maz-ease-in-out;

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

    &.--theme {
      @apply maz-text-normal;
    }
  }

  &.--is-button {
    @apply maz-inline-flex maz-items-center maz-overflow-hidden
        maz-border-transparent maz-bg-transparent maz-no-underline
        maz-transition-all maz-duration-200 maz-ease-in-out maz-py-0.5;

    &:not(.--no-rounded, .--rounded-none) {
      @apply maz-rounded;

      &.--rounded {
        @apply maz-rounded-full;

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

    /* Sizes */
    &.--xl {
      @apply maz-min-h-16 maz-px-8 maz-text-xl;
    }

    &.--lg {
      @apply maz-min-h-14 maz-px-6;
    }

    &.--md {
      @apply maz-min-h-12 maz-px-4;
    }

    &.--sm {
      @apply maz-min-h-10 maz-px-3;
    }

    &.--xs {
      @apply maz-min-h-8 maz-px-2 maz-text-sm;
    }

    &.--mini {
      @apply maz-min-h-6 maz-px-1 maz-text-xs;
    }

    /* Not disabled */

    &:not(.--disabled) {
      &:hover {
        @apply maz-bg-border;
      }
    }

    /* Fab */

    &.--fab {
      @apply maz-flex maz-items-center maz-justify-center maz-rounded-full maz-px-1 maz-py-1;

      &:not(.--no-elevation) {
        @apply maz-elevation;
      }

      &.--xl {
        @apply maz-w-16;
      }

      &.--lg {
        @apply maz-w-14;
      }

      &.--md {
        @apply maz-w-12;
      }

      &.--sm {
        @apply maz-w-10;
      }

      &.--xs {
        @apply maz-w-8;
      }

      &.--mini {
        @apply maz-w-6;
      }
    }

    &.--block {
      @apply maz-w-full;
    }

    &.--primary {
      @apply maz-bg-primary maz-text-primary-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-primary-700;
      }
    }

    &.--secondary {
      @apply maz-bg-secondary maz-text-secondary-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-secondary-700;
      }
    }

    &.--info {
      @apply maz-bg-info maz-text-info-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-info-700;
      }
    }

    &.--success {
      @apply maz-bg-success maz-text-success-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-success-700;
      }
    }

    &.--warning {
      @apply maz-bg-warning maz-text-warning-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-warning-700;
      }
    }

    &.--danger {
      @apply maz-bg-danger maz-text-white;

      &:not(:disabled):hover {
        @apply maz-bg-danger-700;
      }
    }

    &.--white {
      @apply maz-bg-white maz-text-white-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-gray-400;
      }
    }

    &.--black {
      @apply maz-bg-black maz-text-black-contrast;

      &:not(:disabled):hover {
        @apply maz-bg-gray-800;
      }
    }

    &.--transparent {
      @apply maz-bg-transparent;

      &:not(:disabled):hover {
        @apply maz-bg-[#000]/[0.08] dark:maz-bg-[#FFF]/[0.08];
      }
    }

    &.--theme {
      @apply maz-bg-theme maz-text-color;

      &:not(:disabled):hover {
        @apply maz-bg-theme-hover;
      }
    }

    /* OUTLINE */

    &.--primary-outline {
      @apply maz-bg-primary-alpha-05 maz-text-primary maz-border-primary;

      &:not(:disabled):hover {
        @apply maz-bg-primary maz-text-primary-contrast;
      }
    }

    &.--secondary-outline {
      @apply maz-border-secondary maz-bg-secondary-alpha-05 maz-text-secondary;

      &:not(:disabled):hover {
        @apply maz-bg-secondary maz-text-white;
      }
    }

    &.--info-outline {
      @apply maz-border-info maz-bg-info-alpha-05 maz-text-info;

      &:not(:disabled):hover {
        @apply maz-bg-info maz-text-white;
      }
    }

    &.--success-outline {
      @apply maz-border-success maz-bg-success-alpha-05 maz-text-success;

      &:not(:disabled):hover {
        @apply maz-bg-success maz-text-white;
      }
    }

    &.--danger-outline {
      @apply maz-border-danger maz-bg-danger-alpha-05 maz-text-danger;

      &:not(:disabled):hover {
        @apply maz-bg-danger maz-text-white;
      }
    }

    &.--warning-outline {
      @apply maz-border-warning maz-bg-warning-alpha-05 maz-text-warning;

      &:not(:disabled):hover {
        @apply maz-bg-warning maz-text-white;
      }
    }

    &.--white-outline {
      @apply maz-border-white maz-text-white;

      &:not(:disabled):hover {
        @apply maz-bg-white maz-text-white-contrast;
      }
    }

    &.--black-outline {
      @apply maz-border-black maz-text-black;

      &:not(:disabled):hover {
        @apply maz-bg-black maz-text-black-contrast;
      }
    }

    &.--theme-outline {
      @apply maz-border-border maz-text-theme dark:maz-border-color-lighter;

      &:not(:disabled):hover {
        @apply maz-border-theme maz-bg-theme maz-text-color;
      }
    }

    /* PASTEL */

    &.--primary-pastel {
      @apply maz-bg-primary-50 maz-text-primary;

      &:not(:disabled):hover {
        @apply maz-bg-primary maz-text-primary-contrast;
      }
    }

    &.--secondary-pastel {
      @apply maz-bg-secondary-50 maz-text-secondary;

      &:not(:disabled):hover {
        @apply maz-bg-secondary maz-text-secondary-contrast;
      }
    }

    &.--info-pastel {
      @apply maz-bg-info-50 maz-text-info;

      &:not(:disabled):hover {
        @apply maz-bg-info maz-text-info-contrast;
      }
    }

    &.--success-pastel {
      @apply maz-bg-success-50 maz-text-success;

      &:not(:disabled):hover {
        @apply maz-bg-success maz-text-success-contrast;
      }
    }

    &.--danger-pastel {
      @apply maz-bg-danger-50 maz-text-danger;

      &:not(:disabled):hover {
        @apply maz-bg-danger maz-text-danger-contrast;
      }
    }

    &.--warning-pastel {
      @apply maz-bg-warning-50 maz-text-warning;

      &:not(:disabled):hover {
        @apply maz-bg-warning maz-text-warning-contrast;
      }
    }

    &.--white-pastel {
      @apply maz-bg-gray-100 maz-text-white;

      &:not(:disabled):hover {
        @apply maz-bg-white maz-text-white-contrast;
      }
    }

    &.--black-pastel {
      @apply maz-bg-border maz-text-black;

      &:not(:disabled):hover {
        @apply maz-bg-black maz-text-black-contrast;
      }
    }

    &.--theme-pastel {
      @apply maz-bg-border maz-text-black;

      &:not(:disabled):hover {
        @apply maz-bg-black maz-text-black-contrast;
      }
    }

    /* DISABLED */

    &.--disabled {
      @apply maz-cursor-not-allowed maz-bg-color-light dark:maz-bg-color-lighter maz-text-gray-400 maz-border-color-light dark:maz-border-color-lighter;
    }

    &.--loading {
      @apply maz-cursor-wait;
    }

    &.--no-padding {
      @apply maz-p-0;
    }
  }
}
</style>
