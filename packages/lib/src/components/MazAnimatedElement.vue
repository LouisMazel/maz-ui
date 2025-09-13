<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export interface MazAnimatedElementProps {
  /**
   * The direction of the animation
   * @default "up"
   * @values "up", "down", "left", "right"
   */
  direction?: 'up' | 'down' | 'left' | 'right'
  /**
   * The delay of the animation
   * @default 0
   */
  delay?: number
  /**
   * The duration of the animation
   * @default 2000
   */
  duration?: number
  /**
   * Play the animation only once
   * @default true
   */
  once?: boolean
}

const { direction = 'up', delay = 0, duration = 2000, once = true } = defineProps<MazAnimatedElementProps>()

const animatedClass = computed(() => `animate-slide-${direction}-blur`)

const element = ref<HTMLDivElement>()
const isAnimated = ref(false)

let observer: IntersectionObserver | null = null
let animationFrameId: number | null = null

function triggerAnimation() {
  animationFrameId = requestAnimationFrame(() => {
    if (element.value) {
      element.value.classList.remove('--invisible')
      element.value.classList.add(animatedClass.value)
      isAnimated.value = true
    }
  })
}

function resetAnimation() {
  if (element.value) {
    element.value.classList.add('--invisible')
    element.value.classList.remove(animatedClass.value)
    isAnimated.value = false
  }
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isAnimated.value) {
      nextTick(() => {
        setTimeout(triggerAnimation, delay)
      })

      if (once === true) {
        observer?.unobserve(entry.target)
      }
    }
    else if (once === false && !entry.isIntersecting) {
      resetAnimation()
    }
  })

  if (element.value) {
    observer.observe(element.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div
    ref="element"
    class="m-animated-element m-reset-css --invisible" :style="{
      animationDuration: `${duration}ms`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped lang="postcss">
.m-animated-element {
  will-change: transform, opacity, filter;
  transform: translateZ(0);

  &.--invisible {
    @apply maz-invisible;
  }
}

@keyframes slide-up-blur {
  from {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes slide-down-blur {
  from {
    opacity: 0;
    transform: translateY(-20px);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes slide-left-blur {
  from {
    opacity: 0;
    transform: translateX(20px);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

@keyframes slide-right-blur {
  from {
    opacity: 0;
    transform: translateX(-20px);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

.animate-slide-up-blur {
  animation: slide-up-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-down-blur {
  animation: slide-down-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-left-blur {
  animation: slide-left-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-right-blur {
  animation: slide-right-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-up-blur,
.animate-slide-down-blur,
.animate-slide-left-blur,
.animate-slide-right-blur {
  opacity: 0;
}
</style>
