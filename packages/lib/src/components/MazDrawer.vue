<script lang="ts" setup>
import { MazXMark } from '@maz-ui/icons'

import { computed, defineAsyncComponent, useSlots } from 'vue'
import MazBackdrop from './MazBackdrop.vue'

const props = withDefaults(defineProps<MazDrawerProps>(), {
  title: undefined,
  variant: 'right',
  backdropClass: undefined,
  size: '30rem',
  noClose: false,
})

defineEmits<{
  /** emitted before drawer is close */
  (name: 'before-close'): void
  /** emitted when drawer is open */
  (name: 'open'): void
  /** emitted when drawer is close (after animation) */
  (name: 'close'): void
  /**
   * emitted when drawer is open or close
   * @param {boolean} value - The value of the model
   */
  (name: 'update:model-value', value: boolean): void
}>()

export interface MazDrawerProps {
  /** The title of the drawer */
  title?: string
  /**
   * The variant of the drawer
   * @values 'right', 'top', 'left', 'bottom'
   */
  variant?: 'right' | 'top' | 'left' | 'bottom'
  /** The size of the drawer */
  size?: string
  /** The class of the backdrop */
  backdropClass?: string
  /** Disable the close button */
  hideCloseButton?: boolean
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const justify = computed(() => {
  if (props.variant === 'left') {
    return 'start'
  }
  else if (props.variant === 'right') {
    return 'end'
  }

  return 'none'
})

const align = computed(() => {
  if (props.variant === 'top') {
    return 'start'
  }
  else if (props.variant === 'bottom') {
    return 'end'
  }

  return 'none'
})

const slots = useSlots()

const hasTitle = computed(() => {
  return !!(props.title || slots.title)
})
</script>

<template>
  <MazBackdrop
    :backdrop-class="['m-drawer', backdropClass]"
    :justify
    :align
    variant="drawer"
    :transition-name="`drawer-anim-${variant}`"
    @close="$emit('close')"
    @open="$emit('open')"
    @before-close="$emit('before-close')"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-drawer-content-wrap"
        :class="[`--${variant}`]"
        :style="{
          '--maz-drawer-size': size,
        }"
      >
        <header class="m-drawer-header" :class="[hasTitle ? '--justify-between' : '--justify-end']">
          <h4 class="m-drawer-header__title">
            <slot name="title" :close="close">
              {{ title }}
            </slot>
          </h4>
          <div v-if="!hideCloseButton" class="m-drawer-header__close">
            <MazBtn size="sm" color="transparent" @click="close">
              <MazXMark class="icon maz-text-lg" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body">
          <slot :close="close" />
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>

<style lang="postcss" scoped>
.m-drawer {
  @apply maz-items-stretch;

  .m-drawer-content-wrap {
    @apply maz-overflow-y-auto maz-bg-surface maz-pointer-events-auto maz-flex maz-flex-col;

    > .m-drawer-header {
      @apply maz-z-1 maz-flex maz-h-16 maz-shrink-0 maz-items-center maz-border-b maz-border-divider-400 maz-bg-surface maz-bg-clip-padding maz-pl-4 maz-pr-2 maz-py-3;

      .m-drawer-header__title {
        @apply maz-m-0 maz-text-xl maz-font-semibold;
      }

      .m-drawer-header__close {
        @apply maz-flex maz-justify-end;
      }

      &.--justify-end {
        @apply maz-justify-end;
      }

      &.--justify-between {
        @apply maz-justify-between;
      }
    }

    > .m-drawer-body {
      @apply maz-z-0 maz-min-h-0 maz-flex-1 maz-overflow-x-auto maz-bg-clip-padding;
    }
  }

  .--left,
  .--right {
    &.m-drawer-content-wrap {
      @apply maz-min-h-screen maz-w-full tab-s:maz-w-[var(--maz-drawer-size)];
    }
  }

  .--top,
  .--bottom {
    &.m-drawer-content-wrap {
      @apply maz-w-full maz-h-auto;
    }
  }
}
</style>
