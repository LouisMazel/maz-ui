<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazSizeUnit } from './types.ts'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { readMotionDuration } from '../utils/motionTokens.ts'

export type MazTickerOrientation = 'horizontal' | 'vertical'

export interface MazTickerProps {
  /**
   * Scrolling direction
   * @type {MazTickerOrientation}
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: MazTickerOrientation
  /**
   * Reverse the scrolling direction
   * @default false
   */
  reverse?: boolean
  /**
   * Duration of one full animation cycle in seconds
   * @default 20
   */
  duration?: number
  /**
   * Gap between repeated content blocks (CSS value)
   * @default '1rem'
   */
  gap?: `${number}rem` | `${number}px` | `${number}%` | `${number}em` | `${number}vw` | `${number}vh`
  /**
   * Number of times the content is duplicated for seamless looping
   * @default 4
   */
  repeat?: number
  /**
   * Pause animation on mouse hover: the ticker slows down smoothly until it stops, then speeds up again on leave
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Pause animation when a child element receives focus (it also slows down smoothly)
   * @default false
   */
  pauseOnFocus?: boolean
  /**
   * Programmatic pause control - takes precedence over pauseOnHover and pauseOnFocus
   * @default false
   */
  paused?: boolean
  /**
   * Show gradient overlays on edges to fade content in/out
   * @default true
   */
  overlay?: boolean
  /**
   * Size of the gradient overlay zones (CSS value)
   * @default '33%'
   */
  overlaySize?: MazSizeUnit
  /**
   * CSS animation timing function
   * @default 'linear'
   */
  animationTimingFunction?: string
}

const {
  orientation = 'horizontal',
  reverse = false,
  duration = 20,
  gap = '1rem',
  repeat = 4,
  pauseOnHover = false,
  pauseOnFocus = false,
  paused = false,
  overlay = true,
  overlaySize = '33%',
  animationTimingFunction = 'linear',
} = defineProps<MazTickerProps>()

const wrapperElement = ref<HTMLElement>()
const isEased = ref(false)
const { shouldReduceMotion } = useReducedMotion()

let rate = 1
let rafId: number | undefined

function getScrollAnimations() {
  return wrapperElement.value
    ?.getAnimations({ subtree: true })
    .filter(animation => (animation as CSSAnimation).animationName?.includes('m-ticker-scroll')) ?? []
}

function easeTo(target: 0 | 1) {
  if (!isEased.value)
    return

  cancelAnimationFrame(rafId!)

  const startRate = rate
  const startTime = performance.now()
  const duration = readMotionDuration('--maz-motion-slower', 450)

  const step = (now: number) => {
    const progress = duration > 0
      ? Math.min(1, (now - startTime) / duration)
      : 1

    rate = startRate + (target - startRate) * (1 - (1 - progress) ** 3)

    for (const animation of getScrollAnimations())
      animation.playbackRate = rate

    rafId = progress < 1
      ? requestAnimationFrame(step)
      : undefined
  }

  rafId = requestAnimationFrame(step)
}

function onPointerEnter(event: PointerEvent) {
  if (pauseOnHover && event.pointerType !== 'touch')
    easeTo(0)
}

function onPointerLeave(event: PointerEvent) {
  if (pauseOnHover && event.pointerType !== 'touch')
    easeTo(1)
}

function onFocusIn() {
  if (pauseOnFocus)
    easeTo(0)
}

function onFocusOut(event: FocusEvent) {
  if (pauseOnFocus && !wrapperElement.value?.contains(event.relatedTarget as Node | null))
    easeTo(1)
}

onMounted(() => {
  isEased.value = typeof wrapperElement.value?.getAnimations === 'function' && !shouldReduceMotion.value
})

onBeforeUnmount(() => cancelAnimationFrame(rafId!))

const cssVars = computed<CSSProperties>(() => ({
  '--m-ticker-duration': `${duration}s`,
  '--m-ticker-gap': gap,
  '--m-ticker-overlay-size': overlaySize,
  '--m-ticker-timing': animationTimingFunction,
}))
</script>

<template>
  <div
    class="m-ticker m-reset-css maz:flex maz:max-h-full maz:max-w-full"
    role="region"
    aria-roledescription="ticker"
    aria-label="Scrolling content"
    :style="cssVars"
    :class="[
      `--${orientation}`,
      orientation === 'horizontal' ? 'maz:flex-row' : 'maz:flex-col',
      {
        '--reverse': reverse,
        '--paused': paused,
        '--pause-on-hover': pauseOnHover,
        '--pause-on-focus': pauseOnFocus,
        '--eased': isEased,
      },
    ]"
  >
    <!-- @slot Static content before the scrolling area -->
    <slot name="before" />

    <div
      ref="wrapperElement"
      class="m-ticker-wrapper maz:relative maz:flex maz:overflow-hidden"
      :class="orientation === 'vertical' ? 'maz:flex-col' : ''"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <div v-if="overlay || hasSlotContent($slots['overlay-start'])" class="m-ticker-overlay --start maz:pointer-events-none maz:absolute maz:z-10" :class="orientation === 'horizontal' ? 'maz:inset-y-0 maz:left-0' : 'maz:inset-x-0 maz:top-0'">
        <!-- @slot Custom overlay for the start edge (left in horizontal, top in vertical). Replaces default gradient. -->
        <slot name="overlay-start" />
      </div>

      <div
        v-for="i in repeat"
        :key="i"
        class="m-ticker-content maz:flex maz:shrink-0"
        :class="orientation === 'horizontal' ? 'maz:items-center' : 'maz:flex-col'"
        :aria-hidden="i > 1 ? 'true' : undefined"
      >
        <!-- @slot Content to scroll (repeated for seamless animation) -->
        <slot />
      </div>

      <div v-if="overlay || hasSlotContent($slots['overlay-end'])" class="m-ticker-overlay --end maz:pointer-events-none maz:absolute maz:z-10" :class="orientation === 'horizontal' ? 'maz:inset-y-0 maz:right-0' : 'maz:inset-x-0 maz:bottom-0'">
        <!-- @slot Custom overlay for the end edge (right in horizontal, bottom in vertical). Replaces default gradient. -->
        <slot name="overlay-end" />
      </div>
    </div>

    <!-- @slot Static content after the scrolling area -->
    <slot name="after" />
  </div>
</template>

<style scoped>
.m-ticker {
  &.--horizontal {
    & .m-ticker-content {
      animation: m-ticker-scroll-x var(--m-ticker-duration) var(--m-ticker-timing) infinite;
      padding-inline-end: var(--m-ticker-gap);
      gap: var(--m-ticker-gap);
    }

    & .m-ticker-overlay {
      inline-size: var(--m-ticker-overlay-size);

      &.--start {
        background: linear-gradient(to right, var(--maz-surface), transparent);
      }

      &.--end {
        background: linear-gradient(to left, var(--maz-surface), transparent);
      }
    }
  }

  &.--vertical {
    & .m-ticker-content {
      animation: m-ticker-scroll-y var(--m-ticker-duration) var(--m-ticker-timing) infinite;
      padding-block-end: var(--m-ticker-gap);
      gap: var(--m-ticker-gap);
    }

    & .m-ticker-overlay {
      block-size: var(--m-ticker-overlay-size);

      &.--start {
        background: linear-gradient(to bottom, var(--maz-surface), transparent);
      }

      &.--end {
        background: linear-gradient(to top, var(--maz-surface), transparent);
      }
    }
  }

  &.--reverse .m-ticker-content {
    animation-direction: reverse;
  }

  &.--paused .m-ticker-content {
    animation-play-state: paused;
  }

  &.--pause-on-hover:not(.--eased) .m-ticker-wrapper:hover .m-ticker-content {
    animation-play-state: paused;
  }

  &.--pause-on-focus:not(.--eased) .m-ticker-wrapper:focus-within .m-ticker-content {
    animation-play-state: paused;
  }
}

@keyframes m-ticker-scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100% - var(--m-ticker-gap)));
  }
}

@keyframes m-ticker-scroll-y {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(calc(-100% - var(--m-ticker-gap)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .m-ticker-content {
    animation-play-state: paused;
  }
}
</style>
