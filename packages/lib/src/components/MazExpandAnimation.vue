<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

export interface MazExpandAnimationProps {
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

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<MazExpandAnimationProps>(), {
  duration: '300ms',
  timingFunction: 'ease-in-out',
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

<template>
  <div
    ref="expandAnimationRef"
    class="m-expand-animation m-reset-css"
    :class="{ 'm-expand-animation--expanded': isOpen }"
    :aria-hidden="!isOpen"
    role="region"
    :style="[{ '--expand-animation-duration': duration, '--expand-animation-timing-function': timingFunction }]"
  >
    <div
      class="m-expand-animation__inner"
      v-bind="$attrs"
      :class="{
        '--overflow-hidden': hasOverflowHidden,
      }"
    >
      <!-- @slot Default Slot - Display content -->
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-expand-animation {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--expand-animation-duration) var(--expand-animation-timing-function);

  @apply maz-max-w-full maz-overflow-x-auto;

  &__inner {
    @apply maz-max-w-full maz-overflow-x-auto;
  }

  &__inner.--overflow-hidden {
    overflow: hidden;
  }

  &--expanded {
    grid-template-rows: 1fr;
  }
}
</style>
