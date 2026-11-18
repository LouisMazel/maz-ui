<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

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
  /**
   * Render the content at the first opening only, then keep it mounted (the closing animation still works)
   * @default false
   */
  lazy?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const { duration = '300ms', timingFunction = 'ease-in-out', lazy = false } = defineProps<MazExpandAnimationProps>()

const isOpen = defineModel<boolean>()
const hasOverflowHidden = ref(!isOpen.value)

const hasBeenOpened = ref(!!isOpen.value)
const isContentRendered = computed(() => !lazy || hasBeenOpened.value || !!isOpen.value)

watch(isOpen, (value) => {
  if (value)
    hasBeenOpened.value = true
})

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
    class="m-expand-animation m-reset-css maz:max-w-full maz:scrollbar-themed maz:overflow-x-auto"
    :class="{ 'm-expand-animation--expanded': isOpen }"
    :aria-hidden="!isOpen"
    role="region"
    :style="[{ '--expand-animation-duration': duration, '--expand-animation-timing-function': timingFunction }]"
  >
    <div
      class="m-expand-animation__inner maz:max-w-full maz:overflow-x-auto"
      v-bind="$attrs"
      :class="{
        '--overflow-hidden': hasOverflowHidden,
      }"
    >
      <!-- @slot Default Slot - Display content -->
      <slot v-if="isContentRendered" />
    </div>
  </div>
</template>

<style scoped>
.m-expand-animation {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--expand-animation-duration) var(--expand-animation-timing-function);
}

.m-expand-animation--expanded {
  grid-template-rows: 1fr;
}

.m-expand-animation__inner.--overflow-hidden {
  overflow: hidden;
}
</style>
