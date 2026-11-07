<script lang="ts" setup>
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

let observer: IntersectionObserver | null = null
let timeoutId: ReturnType<typeof setTimeout> | undefined
let frameId: number | undefined
let hasPlayed = false

function cancelAnimation() {
  clearTimeout(timeoutId)

  if (frameId !== undefined) {
    cancelAnimationFrame(frameId)
  }
}

function animate(start: number, end: number) {
  cancelAnimation()

  if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    currentCount.value = end
    return
  }

  currentCount.value = start

  timeoutId = setTimeout(() => {
    const startTime = performance.now()

    const updateCount = (currentTime: number) => {
      const progress = Math.min(Math.max(currentTime - startTime, 0) / duration, 1)

      currentCount.value = Math.round(start + (end - start) * progress * (2 - progress))

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCount)
      }
    }

    frameId = requestAnimationFrame(updateCount)
  }, delay)
}

onMounted(() => {
  if (!elementRef.value) {
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      return
    }

    hasPlayed = true
    animate(0, count)

    if (once) {
      observer?.unobserve(entry.target)
    }
  })

  observer.observe(elementRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimation()
})

watch(
  () => count,
  (newCount, oldCount) => {
    if (hasPlayed && newCount !== oldCount) {
      animate(oldCount, newCount)
    }
  },
)
</script>

<template>
  <span ref="elementRef" class="m-animated-counter m-reset-css maz:inline-grid maz:whitespace-nowrap maz:tabular-nums">
    <span class="maz:sr-only">
      <slot name="prefix">{{ prefix }}</slot>{{ count }}<slot name="suffix">{{ suffix }}</slot>
    </span>

    <!-- Keep these on one line to avoid spacing issues (space between elements) -->
    <span class="m-animated-counter__value" aria-hidden="true"><slot name="prefix">{{ prefix }}</slot>{{ currentCount }}<slot name="suffix">{{ suffix }}</slot></span>
    <span class="m-animated-counter__value maz:invisible" aria-hidden="true"><slot name="prefix">{{ prefix }}</slot>{{ count }}<slot name="suffix">{{ suffix }}</slot></span>
  </span>
</template>

<style scoped>
.m-animated-counter__value {
  grid-area: 1 / 1;
}
</style>
