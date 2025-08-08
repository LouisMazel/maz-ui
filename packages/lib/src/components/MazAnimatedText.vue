<script setup lang="ts">
import { checkAvailability } from '@maz-ui/utils/helpers/checkAvailability'
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
} = defineProps<MazAnimatedTextProps>()

const words = computed(() => text.split(' '))

const wordCount = computed(() => words.value.length)

const isVisible = ref(false)
const isClient = ref(false)

const animatedClass = computed(() => isVisible.value ? `maz-animate-slide-${direction}-blur` : 'maz-invisible')

const element = ref<HTMLDivElement>()

let observer: IntersectionObserver | null = null

onMounted(() => {
  isClient.value = true

  observer = new IntersectionObserver(([entry]) => {
    isVisible.value = entry.isIntersecting

    if (once && element.value) {
      observer?.unobserve(element.value)
    }
  })

  checkAvailability(() => element.value, (element) => {
    observer?.observe(element)
  })
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="m-reset-css m-animated-text">
    <template v-if="isClient">
      <Component :is="tag" ref="element" v-bind="$attrs" class="m-animated-text__root" :style="{ columnGap: `${columnGap}rem`, rowGap: `${rowGap}rem` }">
        <span
          v-for="(word, index) in words"
          :key="word + index"
          class="m-animated-text__word"
        >
          <span
            class="m-animated-text__word-inner"
            :class="animatedClass"
            :style="{
              animationDelay: `${delay + (index * (wordDelay ?? 150))}ms`,
              animationDuration: `${duration}ms`,
            }"
          >
            {{ word }}
          </span>

        </span>

        <span
          v-if="lastWord"
          class="m-animated-text__last-word"
          :class="animatedClass"
          :style="{
            animationDelay: `${delay + (wordCount * (wordDelay ?? 150))}ms`,
            animationDuration: `${duration}ms`,
          }"
        >
          <span class="m-animated-text__last-word-inner">
            <span class="m-animated-text__last-word-inner-gradient" />
            <span class="m-animated-text__last-word-inner-text">{{ lastWord }}</span>
          </span>
        </span>
      </Component>
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

<style scoped lang="postcss">
.m-animated-text {
  &__root {
    @apply maz-inline-flex maz-flex-wrap;
  }

  &__word {
    @apply maz-inline-flex;
  }

  &__word-inner {
    @apply maz-inline-flex;
  }

  &__last-word {
    @apply maz-inline-flex;
  }

  &__last-word-inner {
    @apply maz-relative maz-inline-flex;
  }

  &__last-word-inner-gradient {
    @apply maz-absolute maz-inset-0 maz-size-full maz-bg-gradient-to-r maz-from-primary maz-via-info maz-to-secondary maz-opacity-30 maz-blur-lg;
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
