<template>
  <div
    class="m-expand-animation"
    :class="{ 'm-expand-animation--expanded': isOpen }"
    :aria-hidden="!isOpen"
    role="region"
  >
    <div class="m-expand-animation__inner">
      <!-- @slot Default Slot - Display content -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  export type Props = {
    /**
     * Duration of the animation in milliseconds
     * @default '300ms'
     */
    duration?: string
    /**
     * Timing function of the animation
     * @default 'ease-in-out'
     */
    timingFunction?: string
  }

  withDefaults(defineProps<Props>(), {
    duration: '300ms',
    timingFunction: 'ease-in-out',
  })

  const isOpen = defineModel<boolean>()
</script>

<style lang="postcss" scoped>
  .m-expand-animation {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows v-bind('duration') v-bind('timingFunction');

    &__inner {
      overflow: hidden;
    }

    &--expanded {
      grid-template-rows: 1fr;
    }
  }
</style>
