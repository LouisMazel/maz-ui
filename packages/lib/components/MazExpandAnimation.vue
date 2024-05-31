<template>
  <div
    ref="expandAnimationRef"
    class="m-expand-animation"
    :class="{ 'm-expand-animation--expanded': isOpen }"
    :aria-hidden="!isOpen"
    role="region"
  >
    <div
      class="m-expand-animation__inner"
      v-bind="$attrs"
      :class="{
        '--overflow-hidden': hasOverflowHidden,
      }"
    >
      <!-- @slot Default Slot - Display content -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

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

  defineOptions({
    inheritAttrs: false,
  })

  const isOpen = defineModel<boolean>()
  const hasOverflowHidden = ref(!isOpen.value)

  const expandAnimationRef = ref<HTMLDivElement>()

  function onTransitionStart() {
    if (!isOpen.value) {
      hasOverflowHidden.value = true
    }
  }

  function onTransitionEnd() {
    if (isOpen.value) {
      hasOverflowHidden.value = false
    }
  }

  onMounted(() => {
    expandAnimationRef.value?.addEventListener('transitionstart', onTransitionStart, false)
    expandAnimationRef.value?.addEventListener('transitionend', onTransitionEnd, false)
  })

  onUnmounted(() => {
    expandAnimationRef.value?.removeEventListener('transitionstart', onTransitionStart, false)
    expandAnimationRef.value?.removeEventListener('transitionend', onTransitionEnd, false)
  })
</script>

<style lang="postcss" scoped>
  .m-expand-animation {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows v-bind('duration') v-bind('timingFunction');

    &__inner.--overflow-hidden {
      overflow: hidden;
    }

    &--expanded {
      grid-template-rows: 1fr;
    }
  }
</style>
