<script lang="ts" setup>
import type { HTMLAttributes, StyleValue } from 'vue'
import type { MazElevation } from '../utils/elevation.ts'
import type { MazColorOrFree } from './types.ts'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { setBorderDrawFrom } from '../utils/borderDraw.ts'
import { getElevationClass } from '../utils/elevation.ts'
import { mixColor } from '../utils/freeColor.ts'

export interface MazCardSpotlightProps {
  /**
   * The color of the halo: a theme color or a free CSS color (`#e11d48`, `oklch(...)`, `var(--brand)`)
   * @default primary
   */
  color?: MazColorOrFree
  /**
   * Elevation of the component (shadow of the theme, deeper in dark mode): `0` none, `1` small, `2` medium, `3` large.
   * `true` keeps the historical shadow.
   * @type {boolean | 0 | 1 | 2 | 3}
   * @default false
   */
  elevation?: MazElevation
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
  /**
   * The border draws itself around the card from the point where the pointer enters (and on keyboard focus).
   * Set its color with `--maz-border-draw-color`
   * @default false
   */
  borderDraw?: boolean
}

const {
  elevation = false,
  color = 'primary',
  padding = true,
  contentClass = undefined,
  contentStyle = undefined,
  innerOpacity = 0.95,
  borderDraw = false,
} = defineProps<MazCardSpotlightProps>()

const containerElement = ref<HTMLDivElement>()
const blobElement = ref<HTMLDivElement>()
const blobVisible = ref<boolean>(false)
const blobActive = ref<boolean>(false)

const { shouldReduceMotion } = useReducedMotion()

let rafId: number | null = null

const { isIntersecting } = useIntersectionObserver(containerElement, () => {
  if (!isIntersecting.value) {
    stopBlobAnimation()
  }
})

/** A light grey halo would disappear: neutral uses its foreground */
const haloColor = computed(() => color === 'neutral' ? 'var(--maz-neutral-foreground)' : color)
const alphaColor = computed(() => mixColor(haloColor.value, 60))
const alphaColor20 = computed(() => mixColor(haloColor.value, 20))
const elevationClass = computed(() => getElevationClass(elevation))

const BLOB_SIZE = 208

function updateBlobPosition(x: number, y: number) {
  const rect = containerElement.value?.getBoundingClientRect()

  if (!blobElement.value || !rect) {
    return
  }

  blobElement.value.style.transform = `translate(${x - rect.left - BLOB_SIZE / 2}px, ${y - rect.top - BLOB_SIZE / 2}px)`
}

function followPointer(event: PointerEvent | MouseEvent) {
  if (shouldReduceMotion.value || !isIntersecting.value || rafId !== null) {
    return
  }

  blobVisible.value = true

  const { clientX, clientY } = event

  rafId = requestAnimationFrame(() => {
    updateBlobPosition(clientX, clientY)
    blobActive.value = true
    rafId = null
  })
}

function onPointerEnter(event: PointerEvent) {
  if (borderDraw) {
    setBorderDrawFrom(event)
  }

  followPointer(event)
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    fadeBlob()
  }
}

function cancelFrame() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function fadeBlob() {
  cancelFrame()
  blobActive.value = false
}

function onBlobTransitionEnd() {
  if (!blobActive.value) {
    blobVisible.value = false
  }
}

function stopBlobAnimation() {
  blobVisible.value = false
  blobActive.value = false
  cancelFrame()
}

onBeforeUnmount(cancelFrame)
</script>

<template>
  <div
    ref="containerElement"
    class="m-card-spotlight m-reset-css maz:relative maz:inline-flex maz:overflow-hidden maz:rounded-md"
    :class="[elevationClass, { 'maz:border-draw': borderDraw }]"
    :style="{ 'backgroundColor': alphaColor20, '--inner-opacity': innerOpacity }"
    @pointerenter="onPointerEnter"
    @pointermove="followPointer"
    @pointerdown="followPointer"
    @pointerleave="fadeBlob"
    @pointerup="onPointerUp"
    @pointercancel="fadeBlob"
  >
    <div class="inner maz:relative maz:h-auto maz:w-full maz:overflow-hidden">
      <div class="content maz:relative maz:z-2 maz:size-full" :class="[{ 'maz:p-4': padding }, contentClass]" :style="contentStyle">
        <slot />
      </div>
    </div>
    <div
      v-show="blobVisible"
      ref="blobElement"
      class="blob maz:absolute maz:top-0 maz:left-0 maz:z-0 maz:rounded-full maz:blur-2xl"
      :class="{ '--active': blobActive }"
      :style="{ backgroundColor: alphaColor }"
      aria-hidden="true"
      @transitionend="onBlobTransitionEnd"
    />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-card-spotlight {
  padding: max(var(--maz-border-width), 1px);
  contain: layout style paint;

  .inner {
    border-radius: calc(var(--maz-rounded-md) - max(var(--maz-border-width), 1px));

    &::before {
      content: '';

      @apply maz:absolute maz:left-0 maz:top-0 maz:z-1 maz:h-full maz:w-full maz:bg-container;

      opacity: var(--inner-opacity);
    }
  }

  .blob {
    inline-size: 208px;
    block-size: 208px;
    opacity: 0;
    transition: opacity calc(var(--maz-motion-fast) * var(--maz-motion-scale)) var(--maz-easing-out);

    &.--active {
      opacity: 1;
      will-change: transform;
    }
  }
}
</style>
