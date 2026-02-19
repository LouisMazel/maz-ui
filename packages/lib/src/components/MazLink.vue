<script setup lang="ts">
import type { IconComponent } from '@maz-ui/icons'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { MazColor } from './types'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/lazy'
import { computed, defineAsyncComponent } from 'vue'
import { useInstanceUniqId } from '../composables'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import { getColor } from './types'

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
} = defineProps<MazLinkProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

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
  color?: MazColor | 'muted' | 'background' | 'inherit'
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
   * The name of the icon or component to display on the left of the text
   * `@type` `{string | FunctionalComponent | ComponentPublicInstance | Component}`
   */
  leftIcon?: string | IconComponent
  /**
   * The name of the icon or component to display on the right of the text
   * `@type` `{string | FunctionalComponent | ComponentPublicInstance | Component}`
   */
  rightIcon?: string | IconComponent
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

const component = computed<HTMLElement['nodeName'] | 'NuxtLink' | 'RouterLink' | 'nuxt-link' | 'router-link' | 'button'>(() => {
  if (as)
    return as
  if (to)
    return resolveLinkComponent()
  if (href)
    return 'a'

  return 'button'
})

const isButton = computed(() => component.value === 'button')
</script>

<template>
  <component
    :is="component"
    :id="instanceId"
    class="m-link m-reset-css"
    :class="[
      {
        '--underline': underline,
        '--underline-hover': !underline && underlineHover,
      },
      color !== 'inherit' && `--${getColor(color)}`,
      classProp,
    ]"
    :to
    :href
    :title
    :target="!isButton && target"
    :rel="!isButton && rel"
    :download="!isButton && download"
    :aria-label="!isButton && ariaLabel"
    :type="isButton && 'button'"
    :disabled="isButton && disabled"
    :style="styleProp"
    v-bind="$attrs"
  >
    <!--
      @slot left-icon - The icon to display on the left of the text
    -->
    <slot name="left-icon">
      <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" />
      <component :is="leftIcon" v-else-if="leftIcon" />
    </slot>
    <!--
      @slot Text of the link
    -->
    <slot />

    <!--
      @slot right-icon - The icon to display on the left of the text
    -->
    <slot name="right-icon">
      <MazIcon v-if="typeof rightIcon === 'string'" :name="rightIcon" />
      <component :is="rightIcon" v-else-if="rightIcon" />
    </slot>
    <!--
      @slot external-icon - Replace the default external icon
    -->
    <slot v-if="autoExternal && target === '_blank'" name="external-icon">
      <MazArrowTopRightOnSquare />
    </slot>
  </component>
</template>

<style scoped>
  .m-link {
  @apply maz-inline-flex maz-cursor-pointer maz-items-center maz-gap-1 maz-transition-colors maz-duration-200 maz-ease-in-out maz-no-underline;

  &.--underline {
    @apply maz-underline;
  }

  &.--underline-hover:not(:disabled) {
    @apply hover:maz-underline;
  }

  &.--primary:not(:disabled) {
    @apply maz-text-primary hover:maz-text-primary-700;
  }

  &.--secondary:not(:disabled) {
    @apply maz-text-secondary hover:maz-text-secondary-700;
  }

  &.--info:not(:disabled) {
    @apply maz-text-info hover:maz-text-info-700;
  }

  &.--warning:not(:disabled) {
    @apply maz-text-warning hover:maz-text-warning-700;
  }

  &.--destructive:not(:disabled) {
    @apply maz-text-destructive hover:maz-text-destructive-700;
  }

  &.--success:not(:disabled) {
    @apply maz-text-success hover:maz-text-success-700;
  }

  &.--accent:not(:disabled) {
    @apply maz-text-accent hover:maz-text-accent-700;
  }

  &.--contrast:not(:disabled) {
    @apply maz-text-foreground hover:maz-text-foreground-900 dark:hover:maz-text-foreground-100;
  }

  &.--muted:not(:disabled) {
    @apply maz-text-muted hover:maz-text-muted-700;
  }

  &.--surface:not(:disabled) {
    @apply maz-text-surface hover:maz-text-surface-700;
  }

  &:disabled {
    @apply maz-cursor-not-allowed maz-opacity-50 maz-text-muted;
  }
}
</style>
