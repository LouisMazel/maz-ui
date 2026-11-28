<script setup lang="ts">
import type { MazColor } from './types.ts'
import { computed } from 'vue'
import { vReveal } from '../directives/vReveal.ts'

export interface MazAnimatedTextProps {
  /**
   * The text to animate
   * @example "Hello"
   */
  text: string
  /**
   * The last word(s) to be highlighted
   * @example "world"
   */
  lastWord?: string
  /**
   * The delay of the animation
   * @default 0
   */
  delay?: number
  /**
   * The direction of the animation
   * @default "up"
   * @values "up", "down", "left", "right"
   */
  direction?: 'up' | 'down' | 'left' | 'right'
  /**
   * The tag to use for the text
   * @default "span"
   */
  tag?: string
  /**
   * The delay between each word
   * @default 75
   */
  wordDelay?: number
  /**
   * The column gap between each word
   * @default 0.5
   */
  columnGap?: number
  /**
   * The row gap between each word
   * @default 0
   */
  rowGap?: number
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
  /**
   * The gradient from color
   * @default "info"
   */
  gradientFrom?: MazColor
  /**
   * The gradient via color
   * @default "secondary"
   */
  gradientVia?: MazColor
  /**
   * The gradient to color
   * @default "secondary"
   */
  gradientTo?: MazColor
}

defineOptions({
  inheritAttrs: false,
})

const {
  text,
  lastWord,
  delay = 0,
  wordDelay = 75,
  direction = 'up',
  tag = 'span',
  columnGap = 0.5,
  rowGap = 0,
  duration = 2000,
  once = true,
  gradientFrom = 'primary',
  gradientVia = 'info',
  gradientTo = 'secondary',
} = defineProps<MazAnimatedTextProps>()

const words = computed(() => text.split(' '))

const options = computed(() => ({
  effect: `slide-${direction}` as const,
  blur: true,
  delay,
  duration,
  once,
  stagger: wordDelay,
}))

const gradientStyle = computed(() => {
  if (!lastWord) {
    return undefined
  }

  const toVar = (color: MazColor) => color === 'neutral' ? 'var(--maz-neutral-foreground)' : `var(--maz-${color})`

  const colors: string[] = [
    toVar(gradientFrom),
    ...(gradientVia
      ? [toVar(gradientVia)]
      : []),
    toVar(gradientTo),
  ]

  return `linear-gradient(to right, ${colors.join(', ')})`
})
</script>

<template>
  <div class="m-reset-css m-animated-text" :style="{ '--maz-gradient-style': gradientStyle }">
    <!-- eslint-disable better-tailwindcss/no-deprecated-classes -->
    <component :is="tag" v-bind="$attrs" v-reveal="options" class="m-animated-text__root maz:inline-flex maz:flex-wrap" :style="{ columnGap: `${columnGap}rem`, rowGap: `${rowGap}rem` }">
      <span
        v-for="(word, index) in words"
        :key="word + index"
        class="m-animated-text__word maz:inline-flex"
      >
        <span
          class="m-animated-text__word-inner maz:inline-flex"
          data-maz-reveal-item
        >
          {{ word }}
        </span>
      </span>

      <span
        v-if="lastWord"
        class="m-animated-text__last-word maz:inline-flex"
        data-maz-reveal-item
      >
        <span class="m-animated-text__last-word-inner maz:relative maz:inline-flex">
          <span class="m-animated-text__last-word-inner-text maz:relative">{{ lastWord }}</span>
        </span>
      </span>
    </component>
  </div>
</template>

<style scoped>
.m-animated-text__root {
  --maz-reveal-distance: 20px;
  --maz-reveal-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

:where(.dark, [data-theme='dark']) .m-animated-text__last-word-inner::before {
  opacity: 0.5;
}

.m-animated-text__last-word-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  z-index: 0;
  opacity: 0.4;
  background-image: var(--maz-gradient-style);
  filter: blur(16px);
}
</style>
