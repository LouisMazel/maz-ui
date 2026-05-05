<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazColor } from './types'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/lazy/MazArrowTopRightOnSquare'
import { computed, defineAsyncComponent } from 'vue'
import { useInstanceUniqId } from '../composables'
import { useMazIconProps } from '../composables/useMazIconProps'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'

defineOptions({
  inheritAttrs: false,
})

const {
  class: classProp,
  style: styleProp,
  as,
  id,
  href,
  to,
  color = 'primary',
  target = '_self',
  autoExternal = true,
  underline = false,
  underlineHover = true,
  startIcon,
  endIcon,
} = defineProps<MazLinkProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const { iconProps: startIconProps } = useMazIconProps(() => startIcon)
const { iconProps: endIconProps } = useMazIconProps(() => endIcon)

export interface MazLinkProps {
  /**
   * The class attribute of the link
   * @default undefined
   */
  class?: HTMLAttributes['class']
  /**
   * The style attribute of the link
   * @default undefined
   */
  style?: HTMLAttributes['style']
  /**
   * The component to use for the link - if not provided, it will be `router-link` or `nuxt-link` if `to` is provided, will be `a` if `href` is provided, otherwise it will be `button`, you can force the component to be used with `as` prop
   * @default depends on the provided props
   * @values 'a', 'router-link', 'nuxt-link', 'button'
   */
  as?: string | 'a' | 'router-link' | 'nuxt-link' | 'button' | 'RouterLink' | 'NuxtLink'
  /**
   * The id of the link
   * @default undefined
   */
  id?: string
  /**
   * The title of the link
   * @default undefined
   */
  title?: string
  /**
   * The href of the link
   * @default undefined
   */
  href?: string
  /** The route location (router-link) of the link */
  to?: RouteLocationRaw
  /**
   * The color of the link
   * @default 'primary'
   * When 'none', the link will not have any color, so it will inherit the color of the parent
   */
  color?: MazColor | 'muted' | 'surface' | 'inherit'
  /**
   * The target of the link
   * @default '_self'
   * @values '_blank', '_self', '_parent', '_top'
   */
  target?: '_blank' | '_self' | '_parent' | '_top' | string
  /**
   * The download of the link
   * @default undefined
   */
  download?: string
  /**
   * The rel of the link
   * @default undefined
   */
  rel?: string
  /**
   * The aria-label of the link
   * @default undefined
   */
  ariaLabel?: string
  /**
   * Add an underline to the link
   * @default false
   */
  underline?: boolean
  /**
   * Add an underline only on hover
   * @default true
   */
  underlineHover?: boolean
  /**
   * Add an external icon to the link if target is '_blank'
   * @default true
   */
  autoExternal?: boolean
  /**
   * Icon displayed on the inline-start edge (left in LTR, right in RTL).
   * Accepts a bare value (Vue component, raw SVG string, URL or `data:` URI)
   * or a full `MazIconProps` object for fine-grained control.
   */
  startIcon?: MazIconLike
  /**
   * Icon displayed on the inline-end edge (right in LTR, left in RTL).
   * Accepts a bare value or a full `MazIconProps` object.
   */
  endIcon?: MazIconLike
  /**
   * The disabled state of the link if the component is a button
   * @default false
   */
  disabled?: boolean
}

const instanceId = useInstanceUniqId({
  componentName: 'MazLink',
  providedId: id,
})

const component = computed<Component | string>(() => {
  if (as)
    return as
  if (to)
    return resolveLinkComponent()
  if (href)
    return 'a'

  return 'button'
})

const isButton = computed(() => component.value === 'button')

const COLOR_CLASS: Record<NonNullable<MazLinkProps['color']>, string> = {
  primary: 'maz:not-disabled:text-primary maz:not-disabled:hover:text-primary-700',
  secondary: 'maz:not-disabled:text-secondary maz:not-disabled:hover:text-secondary-700',
  info: 'maz:not-disabled:text-info maz:not-disabled:hover:text-info-700',
  warning: 'maz:not-disabled:text-warning maz:not-disabled:hover:text-warning-700',
  destructive: 'maz:not-disabled:text-destructive maz:not-disabled:hover:text-destructive-700',
  success: 'maz:not-disabled:text-success maz:not-disabled:hover:text-success-700',
  accent: 'maz:not-disabled:text-accent maz:not-disabled:hover:text-accent-700',
  contrast: 'maz:not-disabled:text-foreground maz:not-disabled:hover:text-foreground-900 maz:not-disabled:dark:hover:text-foreground-100',
  muted: 'maz:not-disabled:text-muted maz:not-disabled:hover:text-muted-700',
  surface: 'maz:not-disabled:text-surface maz:not-disabled:hover:text-surface-700',
  transparent: '',
  inherit: '',
} as const
</script>

<template>
  <component
    :is="component"
    :id="instanceId"
    class="m-link m-reset-css maz:inline-flex maz:cursor-pointer maz:items-center maz:gap-1 maz:transition-colors maz:duration-200 maz:ease-in-out maz:no-underline maz:disabled:disabled-state maz:disabled:text-muted"
    :class="[
      `--${color}`,
      {
        '--underline': underline,
        '--underline-hover': !underline && underlineHover,
        'maz:underline': underline,
        'maz:not-disabled:hover:underline': !underline && underlineHover,
      },
      color !== 'inherit' && COLOR_CLASS[color],
      classProp,
    ]"
    :to
    :href
    :title
    :target="!isButton ? target : undefined"
    :rel="!isButton ? rel : undefined"
    :download="!isButton ? download : undefined"
    :aria-label="!isButton ? ariaLabel : undefined"
    :type="isButton ? 'button' : undefined"
    :disabled="isButton ? disabled : undefined"
    :style="styleProp"
    v-bind="$attrs"
  >
    <!--
      @slot start-icon - The icon to display on the inline-start edge of the text (left in LTR, right in RTL)
    -->
    <slot name="start-icon">
      <MazIcon v-if="startIconProps" v-bind="startIconProps" />
    </slot>
    <!--
      @slot Text of the link
    -->
    <slot />

    <!--
      @slot end-icon - The icon to display on the inline-end edge of the text (right in LTR, left in RTL)
    -->
    <slot name="end-icon">
      <MazIcon v-if="endIconProps" v-bind="endIconProps" />
    </slot>
    <!--
      @slot external-icon - Replace the default external icon
    -->
    <slot v-if="autoExternal && target === '_blank'" name="external-icon">
      <MazArrowTopRightOnSquare />
    </slot>
  </component>
</template>
