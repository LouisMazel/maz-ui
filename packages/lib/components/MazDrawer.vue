<template>
  <MazBackdrop
    v-bind="$attrs"
    :backdrop-class="['m-drawer', `--${variant}`, backdropClass]"
    :style="{
      '--maz-drawer-size': size,
    }"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div class="m-drawer-content-wrap" :class="[`--${variant}`]">
        <header class="m-drawer-header" :class="[$slots['title'] || title ? '--between' : '--end']">
          <h4 class="m-drawer-header__title">
            <slot name="title" :close="close">
              {{ title }}
            </slot>
          </h4>
          <div v-if="!noClose" class="m-drawer-header__close">
            <MazBtn size="sm" color="transparent" @click="close">
              <XIcon class="icon" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body">
          <slot :close="close"></slot>
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'

  import MazBackdrop from './MazBackdrop.vue'
  import MazBtn from './MazBtn.vue'
  import XIcon from './../icons/x.svg'

  defineProps({
    noClose: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    variant: {
      type: String as PropType<'right' | 'top' | 'left' | 'bottom'>,
      default: 'right',
      validator: (value: string) => {
        return ['right', 'top', 'left', 'bottom'].includes(value)
      },
    },
    backdropClass: { type: String, default: undefined },
    size: { type: String, default: '30rem' },
  })

  defineEmits(['open', 'close', 'update:model-value'])
</script>

<style lang="postcss">
  .m-drawer {
    @apply maz-items-stretch;

    & .m-drawer-content-wrap {
      @apply maz-overflow-y-auto maz-bg-color-light maz-text-normal;
    }

    .m-drawer-content-wrap > .m-drawer-header {
      @apply maz-z-1 maz-flex maz-h-16 maz-shrink-0
        maz-items-center maz-bg-color maz-bg-clip-padding maz-px-4 maz-py-3 maz-elevation;

      .m-drawer-header__title {
        @apply maz-m-0 maz-text-xl maz-font-semibold;
      }

      .m-drawer-header__close {
        @apply maz-flex maz-justify-end;

        .icon {
          @apply maz-h-5 maz-w-5;
        }
      }

      &.--end {
        @apply maz-justify-end;
      }

      &.--between {
        @apply maz-justify-between;
      }
    }

    .m-drawer-content-wrap > .m-drawer-body {
      @apply maz-z-0 maz-min-h-0 maz-flex-1 maz-overflow-x-auto maz-bg-color-light maz-bg-clip-padding;
    }

    &.--left,
    &.--right {
      & .m-drawer-content-wrap {
        @apply maz-min-h-screen;
      }

      .m-backdrop-content {
        @apply maz-h-screen maz-min-h-screen;

        transition: all 450ms ease-in-out;
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
      transition: all 450ms ease-in-out;
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
