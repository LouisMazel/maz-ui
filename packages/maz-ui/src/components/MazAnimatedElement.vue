<script lang="ts" setup>
import { computed } from 'vue'
import { vReveal } from '../directives/vReveal.ts'

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

const options = computed(() => ({
  effect: `slide-${direction}` as const,
  blur: true,
  delay,
  duration,
  once,
}))
</script>

<template>
  <div
    v-reveal="options"
    class="m-animated-element m-reset-css"
  >
    <slot />
  </div>
</template>

<style scoped>
.m-animated-element {
  --maz-reveal-distance: 20px;
  --maz-reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
