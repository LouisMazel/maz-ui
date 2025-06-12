<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { MazColor, MazSize } from './types'

import { computed, defineAsyncComponent, useAttrs } from 'vue'

const {
  size = 'md',
  color = 'primary',
  type = 'button',
  icon,
  leftIcon,
  rightIcon,
  roundedSize = 'lg',
  justify = 'center',
  pastel,
  outlined,
  loading,
  disabled,
  block,
  padding = true,
} = defineProps<MazBtnProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const { href, to } = useAttrs()

export interface MazBtnProps {
  /**
   * The text of the button, if not provided, the slot will be used
   * @default undefined
   */
  text?: string
  /**
   * The size of the button
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   */
  size?: MazSize
  /**
   * The color of the button
   * @values `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'destructive' | 'transparent' | 'contrast' | 'accent'`
   */
  color?: MazColor
  /**
   * The type of the button
   * @values `'submit' | 'reset' | 'button'`
   */
  type?: 'submit' | 'reset' | 'button'
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'lg'
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * If true, the button have the "border" style
   * @default false
   */
  outlined?: boolean
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
  icon?: string | IconComponent
  /**
   * The name of the icon or component to display on the left of the button
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  leftIcon?: string | IconComponent
  /**
   * The name of the icon or component to display on the right of the button
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  rightIcon?: string | IconComponent
  /**
   * If true, the button will have no padding
   * @default true
   */
  padding?: boolean
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
  if (pastel)
    return `--${color}-pastel`
  if (outlined)
    return `--${color}-outlined`
  return `--${color}`
})
const isDisabled = computed(
  () => (loading || disabled) && component.value === 'button',
)
const cursorClass = computed(() => (isDisabled.value ? '--cursor-default' : '--cursor-pointer'))
const btnType = computed(() => (component.value === 'button' ? type : undefined))

const iconClassSize = computed(() => {
  if (size === 'xl')
    return 'maz-text-3xl'
  if (size === 'lg')
    return 'maz-text-2xl'
  if (size === 'md')
    return 'maz-text-xl'
  if (size === 'sm')
    return 'maz-text-lg'
  if (size === 'xs')
    return 'maz-text-base'
  if (size === 'mini')
    return 'maz-text-sm'
  return 'maz-text-xl'
})
</script>

<template>
  <Component
    :is="component"
    :disabled="isDisabled"
    class="m-btn m-reset-css"
    :class="[
      `--${size}`,
      ...[!fab && roundedSize && `--rounded-${roundedSize}`],
      btnColorClass,
      cursorClass,
      {
        '--block': block,
        '--fab': fab,
        '--loading': loading,
        '--disabled': isDisabled,
        '--no-padding': !padding,
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
    <slot>
      {{ text }}
    </slot>

    <!--
      @slot left-icon - The icon to display on the left of the button
    -->
    <slot name="right-icon">
      <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" :class="[iconClassSize]" />
      <Component :is="rightIcon" v-else-if="rightIcon" :class="[iconClassSize]" />
    </slot>

    <div v-if="loading" class="m-btn-loader-container">
      <MazSpinner size="2em" :color="color" />
    </div>
  </Component>
</template>

<style lang="postcss" scoped>
.m-btn {
  @apply maz-relative maz-items-center maz-gap-2 maz-border maz-border-solid maz-border-transparent maz-text-center maz-align-top maz-text-base maz-text-foreground;

  justify-content: var(--justify);

  & span {
    @apply maz-leading-none;
  }

  &-loader-container {
    @apply maz-absolute maz-inset-0 maz-flex maz-flex-center maz-bg-overlay/30 maz-backdrop-blur-sm;
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

  @apply maz-inline-flex maz-items-center maz-overflow-hidden
      maz-border-transparent maz-bg-transparent maz-no-underline
      maz-transition-all maz-duration-200 maz-ease-in-out maz-py-0.5;

  &:not(.--rounded-none) {
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

  /* Fab */

  &.--fab {
    @apply maz-flex maz-items-center maz-justify-center maz-rounded-full maz-px-1 maz-py-1;

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
    @apply maz-bg-primary maz-text-primary-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-primary-600;
    }
  }

  &.--secondary {
    @apply maz-bg-secondary maz-text-secondary-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-secondary-600;
    }
  }

  &.--info {
    @apply maz-bg-info maz-text-info-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-info-700;
    }
  }

  &.--success {
    @apply maz-bg-success maz-text-success-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-success-600;
    }
  }

  &.--warning {
    @apply maz-bg-warning maz-text-warning-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-warning-600;
    }
  }

  &.--destructive {
    @apply maz-bg-destructive maz-text-destructive-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-destructive-600;
    }
  }

  &.--transparent {
    @apply maz-bg-transparent;

    &:not(:disabled) {
      @apply hover:maz-bg-surface-600/50 dark:hover:maz-bg-surface-400/50;
    }
  }

  &.--contrast {
    @apply maz-bg-contrast maz-text-contrast-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-contrast-700;
    }
  }

  &.--accent {
    @apply maz-bg-accent maz-text-accent-foreground;

    &:not(:disabled):hover {
      @apply maz-bg-accent-600;
    }
  }

  /* OUTLINED */

  &.--primary-outlined {
    @apply maz-border-primary-200 dark:maz-border-primary-700 maz-text-primary;

    &:not(:disabled):hover {
      @apply maz-bg-primary/10;
    }
  }

  &.--secondary-outlined {
    @apply maz-border-secondary-200 dark:maz-border-secondary-700 maz-text-secondary;

    &:not(:disabled):hover {
      @apply maz-bg-secondary/10;
    }
  }

  &.--info-outlined {
    @apply maz-border-info-200 dark:maz-border-info-700 maz-text-info;

    &:not(:disabled):hover {
      @apply maz-bg-info/10;
    }
  }

  &.--success-outlined {
    @apply maz-border-success-200 dark:maz-border-success-700 maz-text-success;

    &:not(:disabled):hover {
      @apply maz-bg-success/10;
    }
  }

  &.--destructive-outlined {
    @apply maz-border-destructive-200 dark:maz-border-destructive-700 maz-text-destructive;

    &:not(:disabled):hover {
      @apply maz-bg-destructive/10;
    }
  }

  &.--warning-outlined {
    @apply maz-border-warning-200 dark:maz-border-warning-700 maz-text-warning;

    &:not(:disabled):hover {
      @apply maz-bg-warning/10;
    }
  }

  &.--contrast-outlined {
    @apply maz-border-contrast-200 dark:maz-border-contrast-700 maz-text-contrast;

    &:not(:disabled):hover {
      @apply maz-bg-contrast/10;
    }
  }

  &.--accent-outlined {
    @apply maz-border-accent-200 dark:maz-border-accent-700 maz-text-accent;

    &:not(:disabled):hover {
      @apply maz-bg-accent/10;
    }
  }

  /* PASTEL */

  &.--primary-pastel {
    @apply maz-bg-primary-50 maz-text-primary;

    &:not(:disabled):hover {
      @apply maz-bg-primary maz-text-primary-foreground;
    }
  }

  &.--secondary-pastel {
    @apply maz-bg-secondary-50 maz-text-secondary;

    &:not(:disabled):hover {
      @apply maz-bg-secondary maz-text-secondary-foreground;
    }
  }

  &.--info-pastel {
    @apply maz-bg-info-50 maz-text-info;

    &:not(:disabled):hover {
      @apply maz-bg-info maz-text-info-foreground;
    }
  }

  &.--success-pastel {
    @apply maz-bg-success-50 maz-text-success;

    &:not(:disabled):hover {
      @apply maz-bg-success maz-text-success-foreground;
    }
  }

  &.--destructive-pastel {
    @apply maz-bg-destructive-50 maz-text-destructive;

    &:not(:disabled):hover {
      @apply maz-bg-destructive maz-text-destructive-foreground;
    }
  }

  &.--warning-pastel {
    @apply maz-bg-warning-50 maz-text-warning;

    &:not(:disabled):hover {
      @apply maz-bg-warning maz-text-warning-foreground;
    }
  }

  &.--contrast-pastel {
    @apply maz-bg-contrast-50 maz-text-contrast;

    &:not(:disabled):hover {
      @apply maz-bg-contrast maz-text-contrast-foreground;
    }
  }

  &.--accent-pastel {
    @apply maz-bg-accent-50 maz-text-accent;

    &:not(:disabled):hover {
      @apply maz-bg-accent maz-text-accent-foreground;
    }
  }

  /* DISABLED */

  &.--disabled {
    @apply maz-cursor-not-allowed maz-bg-surface-400 maz-text-muted maz-border-surface-400;
  }

  &.--loading {
    @apply maz-cursor-wait;
  }

  &.--no-padding {
    @apply maz-p-0;
  }
}
</style>
