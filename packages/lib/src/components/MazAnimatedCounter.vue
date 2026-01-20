<script lang="ts" setup>
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface MazAnimatedCounterProps {
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
  /**
   * Play the animation only once
   * @default true
   */
  once?: boolean
}

const {
  count,
  duration = 1000,
  prefix,
  suffix,
  delay = 100,
  once = true,
} = defineProps<MazAnimatedCounterProps>()

const currentCount = ref(0)

const elementRef = ref<HTMLElement | null>(null)

function getRequestAnimationFrame() {
  /* Polyfill for server-side rendering */
  if (!isClient() || !globalThis.requestAnimationFrame) {
    return (callback: FrameRequestCallback): number => {
      setTimeout(callback, 1000 / 60)
      return 0
    }
  }

  return globalThis.requestAnimationFrame.bind(globalThis)
}

function animate(start: number, end: number, duration: number, delay: number) {
  const requestAnim = getRequestAnimationFrame()

  currentCount.value = start

  if (!isClient()) {
    return
  }

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

function startAnimation(start: number, end: number) {
  animate(start, end, duration, delay)
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (once)
    return

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      startAnimation(0, count)

      if (once) {
        observer?.unobserve(entry.target)
      }
    }
  })

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => count,
  (newCount, oldCount) => {
    if (newCount === oldCount) {
      return
    }

    const startValue = oldCount ?? 0
    startAnimation(startValue, newCount)
  },
  { immediate: true },
)
</script>

<template>
  <span ref="elementRef" class="m-animated-counter m-reset-css">
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
