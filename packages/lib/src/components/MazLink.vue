<script setup lang="ts">
import type { IconComponent } from '@maz-ui/icons'
import type { RouteLocationRaw } from 'vue-router'
import type { MazColor } from './types'
import { ArrowTopRightOnSquare } from '@maz-ui/icons'
import { defineAsyncComponent } from 'vue'

withDefaults(defineProps<MazLinkProps>(), {
  id: undefined,
  title: undefined,
  color: 'primary',
  href: undefined,
  to: undefined,
  target: '_self',
  download: undefined,
  rel: undefined,
  autoExternal: true,
  ariaLabel: undefined,
  underline: false,
  underlineOnlyHover: true,
  leftIcon: undefined,
  rightIcon: undefined,
})
const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

export interface MazLinkProps {
  /** The id of the link */
  id?: string
  /** The title of the link */
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
   */
  color?: MazColor
  /**
   * The target of the link
   * @default '_self'
   * @values '_blank', '_self', '_parent', '_top'
   */
  target?: '_blank' | '_self' | '_parent' | '_top' | string
  /** The download of the link */
  download?: string
  /** The rel of the link */
  rel?: string
  /** The aria-label of the link */
  ariaLabel?: string
  /** Add an underline to the link */
  underline?: boolean
  /** Add an underline only on hover */
  underlineOnlyHover?: boolean
  /**
   * Add an external icon to the link if target is '_blank'
   * @default true
   */
  autoExternal?: boolean
  /**
   * The name of the icon or component to display on the left of the text
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  leftIcon?: string | IconComponent
  /**
   * The name of the icon or component to display on the right of the text
   * `@type` `{string | FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component}`
   */
  rightIcon?: string | IconComponent
}
</script>

<template>
  <Component
    :is="to ? 'router-link' : 'a'"
    :id
    class="m-link m-reset-css"
    :class="[
      {
        '--underline': underline,
        '--underline-only-hover': !underline && underlineOnlyHover,
      },
      `--${color}`,
    ]"
    :to
    :href
    :title
    :target
    :rel
    :download
    :aria-label
    v-bind="$attrs"
  >
    <!--
      @slot left-icon - The icon to display on the left of the text
    -->
    <slot name="left-icon">
      <MazIcon v-if="typeof leftIcon === 'string'" :name="leftIcon" />
      <Component :is="leftIcon" v-else-if="leftIcon" />
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
      <Component :is="rightIcon" v-else-if="rightIcon" />
    </slot>
    <!--
      @slot external-icon - Replace the default external icon
    -->
    <slot v-if="autoExternal && target === '_blank'" name="external-icon">
      <ArrowTopRightOnSquare />
    </slot>
  </Component>
</template>

<style lang="postcss" scoped>
  .m-link {
  @apply maz-inline-flex maz-cursor-pointer maz-items-center maz-gap-1 maz-transition-colors maz-duration-200 maz-ease-in-out maz-no-underline;

  &.--underline {
    @apply maz-underline;
  }

  &.--underline-only-hover {
    @apply hover:maz-underline;
  }

  &.--primary {
    @apply maz-text-primary hover:maz-text-primary-600;
  }

  &.--secondary {
    @apply maz-text-secondary hover:maz-text-secondary-600;
  }

  &.--info {
    @apply maz-text-info hover:maz-text-info-600;
  }

  &.--warning {
    @apply maz-text-warning-600 hover:maz-text-warning-800;
  }

  &.--danger {
    @apply maz-text-danger-600 hover:maz-text-danger-800;
  }

  &.--success {
    @apply maz-text-success-600 hover:maz-text-success-800;
  }

  &.--white {
    @apply maz-text-white hover:maz-text-gray-300;
  }

  &.--black {
    @apply maz-text-black hover:maz-text-gray-800;
  }

  &.--theme {
    @apply maz-text-normal hover:maz-text-black dark:hover:maz-text-white;
  }
}
</style>
