<script lang="ts" setup>
import type { HTMLAttributes, StyleValue } from 'vue'
import type { MazColor } from './types'
import { isServer } from '@maz-ui/utils'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface MazCardSpotlightProps {
  /**
   * The color of the component.
   * @default primary
   */
  color?: MazColor
  /**
   * Add elevation to the component
   * @default true
   */
  elevation?: boolean
  /**
   * Add padding to the content
   * @default true
   */
  padding?: boolean
  /**
   * The classes to apply to the content div
   */
  contentClass?: HTMLAttributes['class']
  /**
   * Style apply to the content div
   */
  contentStyle?: StyleValue
  /**
   * The opacity of the inner div - should be between 0 and 1
   * When 0 the spotlight is completely visible
   * When 1 the spotlight is only visible on borders
   * @default 0.95
   */
  innerOpacity?: number
}

const {
  elevation = false,
  color = 'primary',
  padding = true,
  contentClass = undefined,
  contentStyle = undefined,
  innerOpacity = 0.95,
} = defineProps<MazCardSpotlightProps>()

const containerElement = ref<HTMLDivElement>()
const blobElement = ref<HTMLDivElement>()
const blobVisible = ref<boolean>(false)

let rafId: number | null = null
let isIntersecting = false
let cachedRect: DOMRect | null = null

const alphaColor = computed(() => `hsl(var(--maz-${color}) / 60%)`)
const alphaColor20 = computed(() => `hsl(var(--maz-${color}) / 20%)`)

function updateCachedRect() {
  if (containerElement.value) {
    cachedRect = containerElement.value.getBoundingClientRect()
  }
}

function updateBlobPosition(x: number, y: number) {
  if (!blobElement.value || !cachedRect) {
    return
  }

  const blobWidth = 208
  const blobHeight = 208
  const translateX = x - cachedRect.left - blobWidth / 2
  const translateY = y - cachedRect.top - blobHeight / 2

  blobElement.value.style.transform = `translate(${translateX}px, ${translateY}px)`
}

function handleMouseMove(event: MouseEvent) {
  if (!isIntersecting || rafId !== null) {
    return
  }

  blobVisible.value = true

  rafId = requestAnimationFrame(() => {
    updateBlobPosition(event.clientX, event.clientY)
    rafId = null
  })
}

function stopBlobAnimation() {
  blobVisible.value = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onMounted(() => {
  if (isServer() || !containerElement.value) {
    return
  }

  updateCachedRect()

  const observer = new IntersectionObserver(
    (entries) => {
      isIntersecting = entries[0].isIntersecting
      if (!isIntersecting) {
        stopBlobAnimation()
      }
    },
    { threshold: 0 },
  )

  observer.observe(containerElement.value)

  const handleScrollResize = () => {
    updateCachedRect()
  }

  globalThis.addEventListener('mousemove', handleMouseMove, { passive: true })
  globalThis.addEventListener('scroll', handleScrollResize, { passive: true })
  globalThis.addEventListener('resize', handleScrollResize, { passive: true })

  onBeforeUnmount(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    observer.disconnect()
    globalThis.removeEventListener('mousemove', handleMouseMove)
    globalThis.removeEventListener('scroll', handleScrollResize)
    globalThis.removeEventListener('resize', handleScrollResize)
  })
})
</script>

<template>
  <div
    ref="containerElement"
    class="m-card-spotlight m-reset-css"
    :class="{ 'maz-shadow-elevation maz-drop-shadow-md': elevation }"
    :style="{ 'backgroundColor': alphaColor20, '--inner-opacity': innerOpacity }"
  >
    <div class="inner">
      <div class="content" :class="[{ 'maz-p-4': padding }, contentClass]" :style="contentStyle">
        <slot />
      </div>
    </div>
    <div
      v-show="blobVisible"
      ref="blobElement"
      class="blob"
      :style="{ backgroundColor: alphaColor }"
    />
  </div>
</template>

<style scoped>
  .m-card-spotlight {
  @apply maz-relative maz-inline-flex maz-overflow-hidden maz-rounded;

  padding: max(var(--maz-border-width), 1px);
  contain: layout style paint;

  .inner {
    @apply maz-relative maz-h-auto maz-w-full maz-overflow-hidden;

    border-radius: calc(var(--maz-radius) - max(var(--maz-border-width), 1px));

    &::before {
      content: '';

      @apply maz-absolute maz-left-0 maz-top-0 maz-z-1 maz-h-full maz-w-full maz-bg-surface;

      opacity: var(--inner-opacity);
    }
  }

  .content {
    @apply maz-relative maz-z-2 maz-h-full maz-w-full;
  }

  .blob {
    @apply maz-absolute maz-left-0 maz-top-0 maz-z-[0] maz-rounded-full maz-blur-2xl;

    width: 208px;
    height: 208px;
    will-change: transform;
    transition: opacity 150ms ease-out;
  }
}
</style>
