<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { MazIconProps } from './MazIcon.vue'
import { defineAsyncComponent } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'

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
   * @default 'md'
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
  roundedSize = 'md',
  title = undefined,
  transparent = false,
  overflowHidden = true,
  block = false,
  leftIcon,
  rightIcon,
  iconSize = 'md',
} = defineProps<MazContainerProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const
</script>

<template>
  <div
    class="m-container m-reset-css maz:relative maz:inline-flex maz:flex-col"
    :class="[
      ROUNDED_CLASS[roundedSize],
      roundedSize && `--rounded-${roundedSize}`,
      {
        '--elevation': elevation,
        '--padding': padding,
        '--bordered': bordered,
        '--transparent': transparent,
        '--overflow-hidden': overflowHidden,
        '--block': block,
        'maz:overflow-hidden': overflowHidden,
        'maz:w-full': block,
        'maz:bg-surface': !transparent,
        'maz:shadow-elevation maz:drop-shadow-md': elevation,
        'maz:border maz:border-divider': bordered,
      },
    ]"
  >
    <!-- @slot Replace the header -->
    <slot name="header">
      <div v-if="title || hasSlotContent($slots.title)" class="m-container__header maz:w-full maz:flex maz:items-center maz:justify-start maz:gap-2" :class="{ 'maz:px-4 maz:py-3': padding, 'maz:border-b maz:border-divider': bordered }">
        <!-- @slot icon left -->
        <slot name="icon-left">
          <MazIcon v-if="leftIcon" :icon="leftIcon" :size="iconSize" />
        </slot>
        <!-- @slot title -->
        <slot name="title">
          {{ title }}
        </slot>
        <!-- @slot icon right -->
        <slot name="icon-right">
          <MazIcon v-if="rightIcon" :icon="rightIcon" :size="iconSize" />
        </slot>
      </div>
    </slot>

    <div class="m-container__content maz:w-full" :class="{ 'maz:px-4 maz:py-3': padding }">
      <!-- @slot content of the container -->
      <slot />
    </div>
  </div>
</template>
