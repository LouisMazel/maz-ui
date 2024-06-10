<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

import MazBackdrop from './MazBackdrop.vue'

withDefaults(defineProps<Props>(), {
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
  /** emitted when drawer is open or close */
  (name: 'update:model-value', value: boolean): void
}>()
const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const XIcon = defineAsyncComponent(() => import('./../icons/x-mark.svg'))

export interface Props {
  /** The title of the drawer */
  title?: string
  /** The variant of the drawer */
  variant?: 'right' | 'top' | 'left' | 'bottom'
  /** The size of the drawer */
  size?: string
  /** The class of the backdrop */
  backdropClass?: string
  /** Disable the close button */
  noClose?: boolean
}
</script>

<template>
  <MazBackdrop
    :backdrop-class="['m-drawer', `--${variant}`, backdropClass]"
    :style="{
      '--maz-drawer-size': size,
    }"
    @close="$emit('close')"
    @open="$emit('open')"
    @before-close="$emit('before-close')"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div class="m-drawer-content-wrap" :class="[`--${variant}`]">
        <header class="m-drawer-header" :class="[$slots.title || title ? '--between' : '--end']">
          <h4 class="m-drawer-header__title">
            <slot name="title" :close="close">
              {{ title }}
            </slot>
          </h4>
          <div v-if="!noClose" class="m-drawer-header__close">
            <MazBtn size="sm" color="transparent" @click="close">
              <XIcon class="icon maz-text-lg" />
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

<style lang="postcss">
  .m-drawer {
  @apply maz-items-stretch;

  & .m-drawer-content-wrap {
    @apply maz-overflow-y-auto maz-bg-color maz-text-normal;
  }

  .m-drawer-content-wrap > .m-drawer-header {
    @apply maz-z-1 maz-flex maz-h-16 maz-shrink-0
        maz-items-center maz-border-b maz-border-color-light maz-bg-color maz-bg-clip-padding maz-px-4 maz-py-3;

    .m-drawer-header__title {
      @apply maz-m-0 maz-text-xl maz-font-semibold;
    }

    .m-drawer-header__close {
      @apply maz-flex maz-justify-end;
    }

    &.--end {
      @apply maz-justify-end;
    }

    &.--between {
      @apply maz-justify-between;
    }
  }

  .m-drawer-content-wrap > .m-drawer-body {
    @apply maz-z-0 maz-min-h-0 maz-flex-1 maz-overflow-x-auto maz-bg-clip-padding;
  }

  &.--left,
  &.--right {
    & .m-drawer-content-wrap {
      @apply maz-min-h-screen;
    }

    .m-backdrop-content {
      @apply maz-h-screen maz-min-h-screen;

      transition: all 200ms ease-in-out;
      width: 100%;

      @screen tab-m {
        width: var(--maz-drawer-size);
      }
    }
  }

  &.--left {
    @apply maz-justify-start;

    &.backdrop-anim-enter-from > .m-backdrop-content,
    &.backdrop-anim-leave-to > .m-backdrop-content {
      opacity: 0;
      transform: translateX(-100%);
    }
  }

  &.--right {
    @apply maz-justify-end;

    &.backdrop-anim-enter-from > .m-backdrop-content,
    &.backdrop-anim-leave-to > .m-backdrop-content {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  &.--top .m-backdrop-content,
  &.--bottom .m-backdrop-content {
    transition: all 200ms ease-in-out;
    width: 100%;
    height: 100vh;

    @screen tab-m {
      height: auto;
    }
  }

  &.--top {
    @apply maz-items-start;

    &.backdrop-anim-enter-from > .m-backdrop-content,
    &.backdrop-anim-leave-to > .m-backdrop-content {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  &.--bottom {
    @apply maz-items-end;

    &.backdrop-anim-enter-from > .m-backdrop-content,
    &.backdrop-anim-leave-to > .m-backdrop-content {
      opacity: 0;
      transform: translateY(100%);
    }
  }

  & .m-backdrop-content > .m-drawer-content-wrap {
    @apply maz-pointer-events-auto maz-flex maz-h-full maz-w-full maz-flex-col maz-elevation;
  }
}
</style>
