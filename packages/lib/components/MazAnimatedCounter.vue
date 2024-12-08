<script lang="ts" setup>
import { ref, watch } from 'vue'
import { isClient } from '../modules/helpers/is-client'

const props = withDefaults(
  defineProps<{
    /**
     * The number to animate
     */
    count: number
    /**
     * Duration of the animation in milliseconds
     * @default 1000
     */
    duration?: number
    /**
     * Suffix to display next to the number
     */
    prefix?: string
    /**
     * Suffix to display next to the number
     */
    suffix?: string
    /**
     * Delay before the animation starts in milliseconds
     * @default 100
     */
    delay?: number
  }>(),
  {
    duration: 1000,
    prefix: undefined,
    suffix: undefined,
    delay: 100,
  },
)

const currentCount = ref(0)

function getRequestAnimationFrame() {
  if (typeof window === 'undefined' || !window.requestAnimationFrame) {
    return (callback: FrameRequestCallback): number => {
      setTimeout(callback, 1000 / 60)
      return 0
    }
  }

  return window.requestAnimationFrame.bind(window)
}

function animate(start: number, end: number, duration: number, delay: number) {
  const requestAnim = getRequestAnimationFrame()

  if (!isClient()) {
    currentCount.value = end
    return
  }

  currentCount.value = start
  setTimeout(() => {
    const startTime = performance.now()

    const updateCount = (currentTime: number = performance.now()) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuad = (t: number) => t * (2 - t)

      currentCount.value = Math.round(
        start + (end - start) * easeOutQuad(progress),
      )

      if (progress < 1) {
        requestAnim(updateCount)
      }
    }

    requestAnim(updateCount)
  }, delay)
}

watch(
  () => props.count,
  (newCount, oldCount) => {
    if (newCount === oldCount) {
      return
    }

    const startValue = oldCount ?? 0
    animate(startValue, newCount, props.duration, props.delay)
  },
  { immediate: true },
)
</script>

<template>
  <span class="m-animated-counter m-reset-css">
    <span class="maz-sr-only">
      <slot name="prefix">{{ prefix }}</slot>{{ count }}<slot name="suffix">{{ suffix }}</slot>
    </span>

    <!-- Keep this on one line to avoid spacing issues (space between elements) -->
    <slot name="prefix">{{ prefix }}</slot>{{ currentCount }}<slot name="suffix">{{ suffix }}</slot>
  </span>
</template>

<style lang="postcss" scoped>
.m-animated-counter {
  @apply maz-whitespace-nowrap maz-tabular-nums;
}
</style>
