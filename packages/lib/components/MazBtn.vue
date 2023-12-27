<template>
  <Component
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
        '--no-rounded': noRounded,
        '--no-padding': noPadding,
        '--no-elevation': noElevation,
      },
    ]"
    :type="btnType"
  >
    <div
      v-if="hasLeftIcon"
      class="m-btn__icon-left maz-flex maz-flex-center"
      :class="{ 'maz-invisible': hasLoader }"
    >
      <!--
        @slot left-icon - The icon to display on the left of the button
      -->
      <slot name="left-icon">
        <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" />
        <Component :is="leftIcon" v-else-if="leftIcon" />
      </slot>
    </div>

    <div v-if="hasFabIcon" class="m-btn__icon" :class="{ 'maz-invisible': hasLoader }">
      <!--
        @slot icon - The icon to display on the fab button
      -->
      <slot name="icon">
        <MazIcon v-if="typeof icon === 'string'" :name="icon" />
        <Component :is="icon" v-else-if="icon" />
      </slot>
    </div>

    <span v-if="$slots.default" :class="[{ 'maz-invisible': hasLoader }, contentClass]">
      <!--
        @slot default - The content of the button
      -->
      <slot></slot>
    </span>

    <div v-if="hasRightIcon" class="m-btn__icon-right" :class="{ 'maz-invisible': hasLoader }">
      <!--
        @slot right-icon - The icon to display on the right of the button
      -->
      <slot name="right-icon">
        <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" />
        <Component :is="rightIcon" v-else-if="rightIcon" />
      </slot>
    </div>

    <MazSpinner v-if="hasLoader" class="m-btn-loader" size="2em" :color="color" />
  </Component>
</template>

<script lang="ts" setup>
  import {
    computed,
    useAttrs,
    useSlots,
    defineAsyncComponent,
    onBeforeMount,
    type FunctionalComponent,
    type SVGAttributes,
    type ComponentPublicInstance,
    type Component,
  } from 'vue'

  import type { Color, Size } from './types'
  export type { Color, Size }

  const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))
  const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

  const { href, to } = useAttrs()
  const slots = useSlots()

  type Icon = FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component

  const props = withDefaults(
    defineProps<{
      /** The variant of the button - Change UI of component (link or button style)
       * @values `'button' | 'link'`
       * */
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
      /** If true, the button will have no underline on hover (useful with `variant="link"`)
       * @default false
       */
      noUnderline?: boolean
      /**
       * If true, the button will have no leading (useful with `variant="link"`)
       * @default false
       */
      noLeading?: boolean
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
      /** The class applied to the content wrapper (<span />) of the button */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contentClass?: any
    }>(),
    {
      variant: 'button',
      size: 'md',
      color: 'primary',
      type: 'button',
      icon: undefined,
      leftIcon: undefined,
      rightIcon: undefined,
      contentClass: undefined,
    },
  )

  onBeforeMount(() => {
    if (props.icon && !props.fab) {
      console.error('[maz-ui](MazBtn) the prop "icon" must be used only with "fab" props')
    }
  })

  const component = computed(() => {
    if (href) return 'a'
    else if (to) return 'router-link'
    return 'button'
  })

  const btnColorClass = computed(() =>
    props.pastel
      ? `--${props.color}-pastel`
      : props.outline
        ? `--${props.color}-outline`
        : `--${props.color}`,
  )
  const isDisabled = computed(
    () => (props.loading || props.disabled) && component.value === 'button',
  )
  const cursorClass = computed(() => (isDisabled.value ? '--cursor-default' : '--cursor-pointer'))
  const variantClass = computed(() => `--is-${props.variant}`)
  const hasLoader = computed(() => props.loading && props.variant === 'button')
  const hasLeftIcon = computed(() => !!slots['left-icon'] || props.leftIcon)
  const hasRightIcon = computed(() => !!slots['right-icon'] || props.rightIcon)
  const hasIcon = computed(() => hasLeftIcon.value || hasRightIcon.value)
  const hasFabIcon = computed(() => props.fab && (props.icon || !!slots['icon']))
  const btnType = computed(() => (component.value === 'button' ? props.type : undefined))
</script>

<style lang="postcss" scoped>
  .m-btn {
    @apply maz-flex maz-flex-none maz-items-center maz-gap-2 maz-border maz-border-solid maz-border-transparent maz-text-center maz-text-base maz-text-normal;

    & span {
      @apply maz-leading-none;
    }

    &-loader {
      @apply maz-absolute;
    }

    &.--cursor-pointer {
      @apply maz-cursor-pointer;
    }

    &.--cursor-default {
      @apply maz-cursor-default;
    }

    &.--is-link {
      @apply maz-inline-flex maz-items-center maz-bg-transparent
        maz-outline-none maz-transition maz-duration-200 maz-ease-in-out;

      &:not(.--no-leading) span {
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

      &.--theme {
        @apply maz-text-normal;
      }
    }

    &.--is-button {
      @apply maz-relative maz-inline-flex maz-items-center maz-justify-center maz-overflow-hidden
        maz-border-transparent maz-bg-transparent maz-font-medium maz-no-underline
        maz-transition maz-duration-300 maz-ease-in-out;

      &:not(.--no-rounded) {
        @apply maz-rounded;
      }

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
        @apply maz-px-4;

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

      transition:
        background 300ms ease-in-out 0ms,
        color 300ms ease-in-out 0ms;

      /* Not disabled */

      &:not(.--disabled) {
        &:hover,
        &:focus {
          @apply maz-bg-gray-200;
        }
      }

      /* Fab */

      &.--fab {
        @apply maz-flex maz-items-center
          maz-justify-center maz-rounded-full maz-px-0 maz-py-0;

        &:not(.--no-elevation) {
          @apply maz-elevation;
        }

        &.--xl {
          @apply maz-h-[4.125rem] maz-w-[4.125rem] maz-text-xl;
        }

        &.--lg {
          @apply maz-h-[3.375rem] maz-w-[3.375rem] maz-text-lg;
        }

        &.--md {
          @apply maz-h-12 maz-w-12;
        }

        &.--sm {
          @apply maz-h-[2.375rem] maz-w-[2.375rem] maz-text-sm;
        }

        &.--xs {
          @apply maz-h-[1.725rem] maz-w-[1.725rem] maz-text-sm;
        }

        &.--mini {
          @apply maz-h-[1.4rem] maz-w-[1.4rem] maz-text-xs;
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
          @apply maz-bg-[#000]/[0.08] dark:maz-bg-[#FFF]/[0.08];
        }
      }

      &.--theme {
        @apply maz-bg-theme maz-text-color;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-theme-hover;
        }
      }

      /* OUTLINE */

      &.--primary-outline {
        @apply maz-border-primary maz-bg-primary-alpha-05 maz-text-primary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-primary maz-text-primary-contrast;
        }
      }

      &.--secondary-outline {
        @apply maz-border-secondary maz-bg-secondary-alpha-05 maz-text-secondary;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-secondary maz-text-white;
        }
      }

      &.--info-outline {
        @apply maz-border-info maz-bg-info-alpha-05 maz-text-info;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-info maz-text-white;
        }
      }

      &.--success-outline {
        @apply maz-border-success maz-bg-success-alpha-05 maz-text-success;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-success maz-text-white;
        }
      }

      &.--danger-outline {
        @apply maz-border-danger maz-bg-danger-alpha-05 maz-text-danger;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-danger maz-text-white;
        }
      }

      &.--warning-outline {
        @apply maz-border-warning maz-bg-warning-alpha-05 maz-text-warning;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-warning maz-text-white;
        }
      }

      &.--white-outline {
        @apply maz-border-white maz-text-white;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-white maz-text-white-contrast;
        }
      }

      &.--black-outline {
        @apply maz-border-black maz-text-black;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-black maz-text-black-contrast;
        }
      }

      &.--theme-outline {
        @apply maz-border-theme maz-text-theme;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-theme maz-text-color;
        }
      }

      /* PASTEL */

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

      &.--theme-pastel {
        @apply maz-bg-gray-200 maz-text-black;

        &:not(:disabled):hover,
        &:not(:disabled):focus {
          @apply maz-bg-black maz-text-black-contrast;
        }
      }

      /* DISABLED */

      &.--disabled {
        @apply maz-cursor-not-allowed maz-bg-color-lighter maz-text-gray-400;
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
