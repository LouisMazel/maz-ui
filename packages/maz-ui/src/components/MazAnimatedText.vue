<script setup lang="ts">
import type { MazColor } from './types'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

const wordCount = computed(() => words.value.length)

const animationClass = computed(() => `maz-animate-slide-${direction}-blur`)

const isPending = ref(false)

const element = ref<HTMLElement>()

let observer: IntersectionObserver | null = null

function getAnimationStyle(index: number) {
  return {
    animationDuration: `${duration}ms`,
    animationDelay: `${delay + index * wordDelay}ms`,
  }
}

function isInViewport(el: HTMLElement) {
  const { top, bottom } = el.getBoundingClientRect()

  return top < globalThis.innerHeight && bottom > 0
}

onMounted(() => {
  if (!element.value || globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  isPending.value = !isInViewport(element.value)

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isPending.value = false

      if (once) {
        observer?.unobserve(entry.target)
      }
    }
    else if (!once) {
      isPending.value = true
    }
  })

  observer.observe(element.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const gradientStyle = computed(() => {
  if (!lastWord) {
    return undefined
  }

  const colors: string[] = [
    `var(--maz-${gradientFrom})`,
    ...(gradientVia
      ? [`var(--maz-${gradientVia})`]
      : []),
    `var(--maz-${gradientTo})`,
  ]

  return `linear-gradient(to right, ${colors.join(', ')})`
})
</script>

<template>
  <div class="m-reset-css m-animated-text" :class="{ 'm-animated-text--pending': isPending }" :style="{ '--maz-gradient-style': gradientStyle }">
    <!-- eslint-disable better-tailwindcss/no-deprecated-classes -->
    <component :is="tag" ref="element" v-bind="$attrs" class="m-animated-text__root maz:inline-flex maz:flex-wrap" :style="{ columnGap: `${columnGap}rem`, rowGap: `${rowGap}rem` }">
      <span
        v-for="(word, index) in words"
        :key="word + index"
        class="m-animated-text__word maz:inline-flex"
      >
        <span
          class="m-animated-text__word-inner maz:inline-flex"
          :class="animationClass"
          :style="getAnimationStyle(index)"
        >
          {{ word }}
        </span>
      </span>

      <span
        v-if="lastWord"
        class="m-animated-text__last-word maz:inline-flex"
        :class="animationClass"
        :style="getAnimationStyle(wordCount)"
      >
        <span class="m-animated-text__last-word-inner maz:relative maz:inline-flex">
          <span class="m-animated-text__last-word-inner-text maz:relative">{{ lastWord }}</span>
        </span>
      </span>
    </component>
  </div>
</template>

<style scoped>
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

.m-animated-text--pending .m-animated-text__word-inner,
.m-animated-text--pending .m-animated-text__last-word {
  animation: none;
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

.maz-animate-slide-up-blur {
  animation: slide-up-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.maz-animate-slide-down-blur {
  animation: slide-down-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.maz-animate-slide-left-blur {
  animation: slide-left-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.maz-animate-slide-right-blur {
  animation: slide-right-blur cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.maz-animate-slide-up-blur,
.maz-animate-slide-down-blur,
.maz-animate-slide-left-blur,
.maz-animate-slide-right-blur {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .m-animated-text__word-inner,
  .m-animated-text__last-word {
    animation: none;
    opacity: 1;
  }
}
</style>
