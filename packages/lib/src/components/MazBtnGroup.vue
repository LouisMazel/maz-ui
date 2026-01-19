<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazColor, MazSize } from './types'
import { defineAsyncComponent } from 'vue'

export interface MazButtonGroupOption extends Omit<MazBtnProps, 'block' | 'fab'> {
  /** Click handler for the button */
  onClick?: () => void
  /** The href for anchor links */
  href?: string
  /** The route for router-link */
  to?: RouteLocationRaw
}

export interface MazButtonGroupProps {
  /**
   * The items for the button group (optional when using slot-based approach)
   * @default undefined
   */
  items?: MazButtonGroupOption[]
  /**
   * The orientation of the button group
   * @values 'row' | 'col'
   * @default 'row'
   */
  orientation?: 'row' | 'col'
  /**
   * The size of all buttons (only applies to props-based buttons)
   * @default 'md'
   */
  size?: MazSize
  /**
   * The color of all buttons (only applies to props-based buttons)
   * @default 'primary'
   */
  color?: MazColor
  /**
   * The rounded size of the buttons
   * @default 'lg'
   */
  roundedSize?: MazBtnProps['roundedSize']
  /**
   * The outlined state of the buttons
   * @default false
   */
  outlined?: boolean
  /**
   * The pastel state of the buttons
   * @default false
   */
  pastel?: boolean
  /**
   * The loading state of the buttons
   * @default false
   */
  loading?: boolean
  /**
   * The disabled state of the buttons
   * @default false
   */
  disabled?: boolean
}

const {
  items,
  orientation = 'row',
  size = 'md',
  color = 'primary',
} = defineProps<MazButtonGroupProps>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
</script>

<template>
  <div
    class="m-button-group"
    :class="[`--${orientation}`]"
    role="group"
  >
    <!-- Options-based rendering -->
    <MazBtn
      v-for="(item, index) in items"
      :key="index"
      v-bind="item"
      :size="item.size ?? size"
      :color="item.color ?? color"
      class="m-button-group__button"
      @click="item.onClick"
    >
      <!--
        @slot button-[index] - Custom content for a specific button
          @binding {MazButtonGroupOption} item - The button item
          @binding {number} index - The button index
      -->
      <slot :name="`button-${index}`" :item="item" :index="index">
        {{ item.text }}
      </slot>
    </MazBtn>

    <!--
      @slot default - Slot for passing MazBtn components directly
    -->
    <slot />
  </div>
</template>

<style scoped>
.m-button-group {
  @apply maz-inline-flex;

  &.--row {
    @apply maz-flex-row;

    .m-button-group__button,
    :deep(.m-btn) {
      @apply maz-rounded-none;

      &:first-child {
        @apply maz-rounded-l;
      }

      &:last-child {
        @apply maz-rounded-r;
      }

      &:not(:last-child) {
        @apply maz-border-r-0;
      }

      &:not(:first-child) {
        @apply -maz-ml-px;

        /* maz-border-l-[1px] maz-border-l-surface */
      }

      &:focus-visible,
      &:active,
      &.--active {
        @apply maz-z-1;
      }
    }
  }

  &.--col {
    @apply maz-flex-col;

    .m-button-group__button,
    :deep(.m-btn) {
      @apply maz-rounded-none;

      &:first-child {
        @apply maz-rounded-t;
      }

      &:last-child {
        @apply maz-rounded-b;
      }

      &:not(:last-child) {
        @apply maz-border-b-0;
      }

      &:not(:first-child) {
        @apply -maz-mt-px;
      }

      &:focus-visible,
      &:active,
      &.--active {
        @apply maz-z-1;
      }
    }
  }
}
</style>
