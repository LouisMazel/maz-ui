<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { MazIconProps } from './MazIcon.vue'
import { defineAsyncComponent } from 'vue'

export interface MazContainerProps {
  /**
   * Title of the card in header
   */
  title?: string
  /**
   * Add elevation to the component
   * @default false
   */
  elevation?: boolean
  /**
   * Add padding to the content
   * @default true
   */
  padding?: boolean
  /**
   * Add border to the component
   * @default true
   */
  bordered?: boolean
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @type {'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'}
   * @default undefined
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * Remove background color
   * @default false
   */
  transparent?: boolean
  /**
   * Hide overflow
   * @default true
   */
  overflowHidden?: boolean
  /**
   * Add icon to the header on the left
   * @type {IconComponent | string}
   */
  leftIcon?: IconComponent | string
  /**
   * Add icon to the header on the right
   * @type {IconComponent | string}
   */
  rightIcon?: IconComponent | string
  /**
   * Size of the icon
   * @type {MazIconProps['size']}
   * @default 'md'
   */
  iconSize?: MazIconProps['size']
  /**
   * Display the container in full width
   * @default false
   */
  block?: boolean
}

const {
  elevation = false,
  padding = true,
  bordered = true,
  roundedSize = 'lg',
  title = undefined,
  transparent = false,
  overflowHidden = true,
  block = false,
  leftIcon,
  rightIcon,
  iconSize = 'md',
} = defineProps<MazContainerProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
</script>

<template>
  <div
    class="m-container m-reset-css"
    :class="[{
      '--elevation': elevation,
      '--padding': padding,
      '--bordered': bordered,
      '--transparent': transparent,
      '--overflow-hidden': overflowHidden,
      '--block': block,
    }, roundedSize && `--rounded-${roundedSize}`]"
  >
    <!-- @slot Replace the header -->
    <slot name="header">
      <div v-if="title || $slots.title" class="m-container__header">
        <!-- @slot icon left -->
        <slot name="icon-left">
          <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" :size="iconSize" />
          <MazIcon v-else-if="leftIcon" :icon="leftIcon" :size="iconSize" />
        </slot>
        <!-- @slot title -->
        <slot name="title">
          {{ title }}
        </slot>
        <!-- @slot icon right -->
        <slot name="icon-right">
          <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" :size="iconSize" />
          <MazIcon v-else-if="rightIcon" :icon="rightIcon" :size="iconSize" />
        </slot>
      </div>
    </slot>

    <div class="m-container__content">
      <!-- @slot content of the container -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
.m-container {
  @apply maz-relative maz-inline-flex maz-flex-col;

  &.--overflow-hidden {
    @apply maz-overflow-hidden;
  }

  &.--block {
    @apply maz-w-full;
  }

  &:not(.--transparent) {
    @apply maz-bg-surface;
  }

  &__header {
    @apply maz-w-full maz-flex maz-items-center maz-justify-start maz-gap-2;
  }

  &__content {
    @apply maz-w-full;
  }

  &.--padding {
    & .m-container__content {
      @apply maz-px-4 maz-py-3;
    }

    & .m-container__header {
      @apply maz-px-4 maz-py-3;
    }
  }

  &.--elevation {
    @apply maz-shadow-elevation maz-drop-shadow-md;
  }

  &.--bordered {
    @apply maz-border;

    & .m-container__header {
      @apply maz-border-b;
    }
  }

  &.--rounded-none {
    @apply maz-rounded-none;
  }

  &.--rounded-sm {
    @apply maz-rounded-sm;
  }

  &.--rounded-md {
    @apply maz-rounded-md;
  }

  &.--rounded-lg {
    @apply maz-rounded;
  }

  &.--rounded-xl {
    @apply maz-rounded-xl;
  }

  &.--rounded-full {
    @apply maz-rounded-full;
  }
}
</style>
