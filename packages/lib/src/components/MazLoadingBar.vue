<script lang="ts" setup>
import type { MazColor } from './types'
import { computed } from 'vue'

export interface MazLoadingBarProps {
  /** The color of the component. */
  color?: MazColor
  /** The height of the component. */
  height?: string
}

const props = withDefaults(defineProps<MazLoadingBarProps>(), { color: 'primary', height: '0.125rem' })

const colorCSSVariables = computed(() => ({
  alpha: `color-mix(in srgb, var(--maz-${props.color}) 20%, transparent)`,
  main: `var(--maz-${props.color})`,
}))
</script>

<template>
  <div
    class="m-loading-bar m-reset-css maz:relative maz:block maz:w-full maz:overflow-hidden"
    :style="[{ '--loading-bar-height': height, '--loading-bar-color': colorCSSVariables.alpha, '--loading-bar-main-color': colorCSSVariables.main }]"
  >
    <div />
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-loading-bar {
  block-size: var(--loading-bar-height);
  background-color: var(--loading-bar-color);
  overflow: hidden;

  div {
    background-color: var(--loading-bar-main-color);

    &::before {
      content: '';

      @apply maz:absolute;

      background-color: inherit;
      inset-block: 0;
      inset-inline-start: 0;
      will-change: inset-inline-start, inset-inline-end;
      animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    &::after {
      content: '';

      @apply maz:absolute;

      background-color: inherit;
      inset-block: 0;
      inset-inline-start: 0;
      will-change: inset-inline-start, inset-inline-end;
      animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
      animation-delay: 1.15s;
    }
  }
}

@keyframes indeterminate {
  0% {
    inset-inline: -35% 100%;
  }

  60% {
    inset-inline: 100% -90%;
  }

  100% {
    inset-inline: 100% -90%;
  }
}

@keyframes indeterminate-short {
  0% {
    inset-inline: -200% 100%;
  }

  60% {
    inset-inline: 107% -8%;
  }

  100% {
    inset-inline: 107% -8%;
  }
}
</style>
