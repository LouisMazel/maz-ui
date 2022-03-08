<template>
  <MazBackDrop
    ref="backdropRef"
    v-bind="$attrs"
    :model-value="modelValue"
    :backdrop-class="['m-drawer', `--${variant}`, backdropClass]"
    :style="{
      '--maz-drawer-size': size,
    }"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div :class="['m-drawer-content-wrap', `--${variant}`]">
        <header
          class="m-drawer-header"
          :class="[$slots['title'] ? 'maz-justify-between' : 'maz-justify-end']"
        >
          <h4 class="maz-text-2xl maz-font-semibold">
            <slot name="title" :close="close"></slot>
          </h4>
          <div v-if="!noCloseBtn" class="maz-flex maz-justify-end">
            <MazBtn size="sm" color="transparent" @click="close">
              <MazIcon :src="XIcon" class="maz-h-5 maz-w-5" />
            </MazBtn>
          </div>
        </header>
        <div class="m-drawer-body">
          <slot :close="close"></slot>
        </div>
      </div>
    </template>
  </MazBackDrop>
</template>

<script lang="ts" setup>
  import MazBackDrop from './MazBackDrop.vue'
  import MazBtn from './MazBtn.vue'
  import MazIcon from './MazIcon.vue'
  import XIcon from './../icons/x.svg'

  defineProps({
    modelValue: { type: Boolean, default: false },
    noCloseBtn: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    variant: {
      type: String,
      default: 'right',
      validator: (value: string) => {
        return ['right', 'top'].includes(value)
      },
    },
    backdropClass: { type: String, default: undefined },
    size: { type: String, default: '30rem' },
  })

  defineEmits(['open', 'close', 'update:model-value'])
</script>

<style lang="postcss" scoped>
  /* stylelint-disable no-descending-specificity */
  .m-drawer {
    @apply maz-items-stretch maz-justify-end;

    & .m-drawer-content-wrap {
      @apply maz-overflow-y-auto maz-bg-color-light maz-text-normal;
    }

    .m-drawer-content-wrap > .m-drawer-header {
      @apply maz-z-1 maz-flex maz-h-16 maz-flex-shrink-0 maz-items-center maz-bg-color maz-bg-clip-padding maz-px-4 maz-py-3 maz-elevation;
    }

    .m-drawer-content-wrap > .m-drawer-body {
      @apply maz-z-0 maz-min-h-0 maz-flex-1 maz-overflow-x-auto maz-bg-color-light maz-bg-clip-padding;
    }

    &.--right {
      & .m-backdrop-content {
        @apply maz-h-auto maz-min-h-screen;

        transition: all 0.45s;
        width: 100%;

        @screen tab-m {
          width: var(--maz-drawer-size);
        }
      }

      &.backdrop-anim-enter-from > .m-backdrop-content,
      &.backdrop-anim-leave-to > .m-backdrop-content {
        opacity: 0;
        transform: translateX(100%);
      }

      /* & .m-backdrop-content > .m-drawer-content-wrap {
        @apply lap-s:maz-h-auto;
      } */
    }

    &.--top {
      @apply maz-items-start;

      & .m-backdrop-content {
        transition: all 0.45s;
        width: 100%;
        height: 100vh;

        @screen tab-m {
          height: auto;
        }
      }

      &.backdrop-anim-enter-from > .m-backdrop-content,
      &.backdrop-anim-leave-to > .m-backdrop-content {
        opacity: 0;
        transform: translateY(-100%);
      }
    }

    & .m-backdrop-content > .m-drawer-content-wrap {
      @apply maz-pointer-events-auto maz-flex maz-h-full maz-w-full maz-flex-col maz-elevation;
    }
  }
</style>
