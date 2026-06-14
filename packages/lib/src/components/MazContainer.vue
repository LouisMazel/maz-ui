<script lang="ts" setup>
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazIconProps } from './MazIcon.vue'
import type { MazRoundedSize } from './types'
import { defineAsyncComponent } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import { useMazIconProps } from '../composables/useMazIconProps'
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
  roundedSize?: MazRoundedSize
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
   * Icon displayed on the inline-start edge of the header (left in LTR, right
   * in RTL). Accepts a bare value (Vue component, raw SVG string, URL or
   * `data:` URI) or a full `MazIconProps` object.
   */
  startIcon?: MazIconLike
  /**
   * Icon displayed on the inline-end edge of the header (right in LTR, left
   * in RTL). Accepts a bare value or a full `MazIconProps` object.
   */
  endIcon?: MazIconLike
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
  /**
   * Additional class to add to the content wrapper
   * @default undefined
   */
  contentClass?: string
}

const {
  title = undefined,
  block = false,
  startIcon,
  endIcon,
  iconSize = 'md',
} = defineProps<MazContainerProps>()

const { elevation, padding, bordered, roundedSize, transparent, overflowHidden } = useGlobalConfig<{
  elevation: boolean
  padding: boolean
  bordered: boolean
  roundedSize: MazRoundedSize
  transparent: boolean
  overflowHidden: boolean
}>('MazContainer', {
  elevation: false,
  padding: true,
  bordered: true,
  roundedSize: 'md',
  transparent: false,
  overflowHidden: true,
})

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const { iconProps: startIconProps } = useMazIconProps(() => startIcon, () => ({ size: iconSize }))
const { iconProps: endIconProps } = useMazIconProps(() => endIcon, () => ({ size: iconSize }))

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
        'maz:bg-container': !transparent,
        'maz:shadow-elevation maz:drop-shadow-md': elevation,
        'maz:border maz:border-divider': bordered,
      },
    ]"
  >
    <!-- @slot Replace the header -->
    <slot name="header">
      <div v-if="title || hasSlotContent($slots.title)" class="m-container__header maz:flex maz:w-full maz:items-center maz:justify-start maz:gap-2" :class="{ 'maz:px-4 maz:py-3': padding, 'maz:border-b maz:border-divider': bordered }">
        <!-- @slot icon-start - inline-start edge of the header (left in LTR, right in RTL) -->
        <slot name="icon-start">
          <MazIcon v-if="startIconProps" v-bind="startIconProps" />
        </slot>
        <!-- @slot title -->
        <slot name="title">
          {{ title }}
        </slot>
        <!-- @slot icon-end - inline-end edge of the header (right in LTR, left in RTL) -->
        <slot name="icon-end">
          <MazIcon v-if="endIconProps" v-bind="endIconProps" />
        </slot>
      </div>
    </slot>

    <div class="m-container__content maz:w-full" :class="[{ 'maz:px-4 maz:py-3': padding }, contentClass]">
      <!-- @slot content of the container -->
      <slot />
    </div>
  </div>
</template>
