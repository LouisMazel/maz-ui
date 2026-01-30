<script setup lang="ts">
import type { MazColor } from './types'
import { checkAvailability } from '@maz-ui/utils/helpers/checkAvailability'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

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

const isVisible = ref(false)
const isClient = ref(false)
const animatedWords = ref<boolean[]>([])

const element = ref<HTMLDivElement>()

let observer: IntersectionObserver | null = null
let animationFrameId: NodeJS.Timeout | null = null

function triggerWordAnimations() {
  const totalWords = words.value.length + (lastWord ? 1 : 0)
  animatedWords.value = Array.from({ length: totalWords }, () => false)

  let currentIndex = 0

  const animateNextWord = () => {
    if (currentIndex < totalWords) {
      requestAnimationFrame(() => {
        animatedWords.value[currentIndex] = true
        currentIndex++

        if (currentIndex < totalWords) {
          animationFrameId = setTimeout(animateNextWord, wordDelay)
        }
      })
    }
  }

  setTimeout(animateNextWord, delay)
}

onMounted(() => {
  isClient.value = true

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isVisible.value) {
      isVisible.value = true

      nextTick(() => {
        triggerWordAnimations()
      })

      if (once && element.value) {
        observer?.unobserve(element.value)
      }
    }
  })

  checkAvailability(() => element.value, (element) => {
    observer?.observe(element)
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (animationFrameId) {
    clearTimeout(animationFrameId)
  }
})

const gradientStyle = computed(() => {
  if (!lastWord) {
    return undefined
  }

  const colors: string[] = [
    `hsl(var(--maz-${gradientFrom}))`,
    ...(gradientVia ? [`hsl(var(--maz-${gradientVia}))`] : []),
    `hsl(var(--maz-${gradientTo}))`,
  ]

  return `linear-gradient(to right, ${colors.join(', ')})`
})
</script>

<template>
  <div class="m-reset-css m-animated-text" :style="{ '--maz-gradient-style': gradientStyle }">
    <template v-if="isClient">
      <component :is="tag" ref="element" v-bind="$attrs" class="m-animated-text__root" :style="{ columnGap: `${columnGap}rem`, rowGap: `${rowGap}rem` }">
        <span
          v-for="(word, index) in words"
          :key="word + index"
          class="m-animated-text__word"
        >
          <span
            class="m-animated-text__word-inner"
            :class="animatedWords[index] ? `maz-animate-slide-${direction}-blur` : 'maz-invisible'"
            :style="{
              animationDuration: `${duration}ms`,
            }"
          >
            {{ word }}
          </span>

        </span>

        <span
          v-if="lastWord"
          class="m-animated-text__last-word"
          :class="animatedWords[wordCount] ? `maz-animate-slide-${direction}-blur` : 'maz-invisible'"
          :style="{
            animationDuration: `${duration}ms`,
          }"
        >
          <span class="m-animated-text__last-word-inner">
            <span class="m-animated-text__last-word-inner-text">{{ lastWord }}</span>
          </span>
        </span>
      </component>
    </template>

    <template v-else>
      <component :is="tag" v-bind="$attrs" class="maz-invisible maz-inline-flex">
        {{ text }}

        <template v-if="lastWord">
          {{ lastWord }}
        </template>
      </component>
    </template>
  </div>
</template>

<style scoped>
.m-animated-text {
  &__root {
    @apply maz-inline-flex maz-flex-wrap;
  }

  &__word {
    @apply maz-inline-flex;
  }

  &__word-inner {
    @apply maz-inline-flex;

    will-change: transform, opacity, filter;
    transform: translateZ(0);
  }

  &__last-word {
    @apply maz-inline-flex;

    will-change: transform, opacity, filter;
    transform: translateZ(0);
  }

  &__last-word-inner {
    @apply maz-relative maz-inline-flex;

    &::before {
      content: '';

      @apply maz-z-0 maz-absolute maz-inset-0 maz-size-full maz-opacity-40 dark:maz-opacity-50 maz-blur-lg;

      background-image: var(--maz-gradient-style);
    }
  }

  &__last-word-inner-text {
    @apply maz-relative;
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
</style>
