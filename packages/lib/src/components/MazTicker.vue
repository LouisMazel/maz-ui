<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'

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
   * Pause animation on mouse hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Pause animation when a child element receives focus
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
  overlaySize?: string
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

const cssVars = computed<CSSProperties>(() => ({
  '--m-ticker-duration': `${duration}s`,
  '--m-ticker-gap': gap,
  '--m-ticker-overlay-size': overlaySize,
  '--m-ticker-timing': animationTimingFunction,
}))
</script>

<template>
  <div
    class="m-ticker m-reset-css"
    role="region"
    aria-roledescription="ticker"
    aria-label="Scrolling content"
    :style="cssVars"
    :class="[
      `--${orientation}`,
      {
        '--reverse': reverse,
        '--paused': paused,
        '--pause-on-hover': pauseOnHover,
        '--pause-on-focus': pauseOnFocus,
      },
    ]"
  >
    <!-- @slot Static content before the scrolling area -->
    <slot name="before" />

    <div class="m-ticker-wrapper">
      <div v-if="overlay || hasSlotContent($slots['overlay-start'])" class="m-ticker-overlay --start">
        <!-- @slot Custom overlay for the start edge (left in horizontal, top in vertical). Replaces default gradient. -->
        <slot name="overlay-start" />
      </div>

      <div
        v-for="i in repeat"
        :key="i"
        class="m-ticker-content"
        :aria-hidden="i > 1 ? 'true' : undefined"
      >
        <!-- @slot Content to scroll (repeated for seamless animation) -->
        <slot />
      </div>

      <div v-if="overlay || hasSlotContent($slots['overlay-end'])" class="m-ticker-overlay --end">
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
  @apply maz-flex maz-flex-col maz-max-w-full maz-max-h-full;

  &.--horizontal {
    @apply maz-flex-row;

    & .m-ticker-wrapper {
      @apply maz-flex maz-overflow-hidden;
    }

    & .m-ticker-content {
      @apply maz-flex maz-shrink-0 maz-items-center;

      animation: m-ticker-scroll-x var(--m-ticker-duration) var(--m-ticker-timing) infinite;
      padding-inline-end: var(--m-ticker-gap);
      gap: var(--m-ticker-gap);
    }

    & .m-ticker-overlay {
      @apply maz-top-0 maz-bottom-0;

      width: var(--m-ticker-overlay-size);

      &.--start {
        @apply maz-left-0;

        background: linear-gradient(to right, hsl(var(--maz-background)), transparent);
      }

      &.--end {
        @apply maz-right-0;

        background: linear-gradient(to left, hsl(var(--maz-background)), transparent);
      }
    }
  }

  &.--vertical {
    & .m-ticker-wrapper {
      @apply maz-flex maz-flex-col maz-overflow-hidden;
    }

    & .m-ticker-content {
      @apply maz-shrink-0 maz-flex maz-flex-col;

      animation: m-ticker-scroll-y var(--m-ticker-duration) var(--m-ticker-timing) infinite;
      padding-block-end: var(--m-ticker-gap);
      gap: var(--m-ticker-gap);
    }

    & .m-ticker-overlay {
      @apply maz-left-0 maz-right-0;

      height: var(--m-ticker-overlay-size);

      &.--start {
        @apply maz-top-0;

        background: linear-gradient(to bottom, hsl(var(--maz-background)), transparent);
      }

      &.--end {
        @apply maz-bottom-0;

        background: linear-gradient(to top, hsl(var(--maz-background)), transparent);
      }
    }
  }

  &.--reverse .m-ticker-content {
    animation-direction: reverse;
  }

  &.--paused .m-ticker-content {
    animation-play-state: paused;
  }

  &.--pause-on-hover .m-ticker-wrapper:hover .m-ticker-content {
    animation-play-state: paused;
  }

  &.--pause-on-focus .m-ticker-wrapper:focus-within .m-ticker-content {
    animation-play-state: paused;
  }
}

.m-ticker-wrapper {
  @apply maz-relative;
}

.m-ticker-overlay {
  @apply maz-pointer-events-none maz-absolute maz-z-10;
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
