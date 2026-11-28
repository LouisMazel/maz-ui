<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor, MazSizeUnit } from './types.ts'
import { computed, defineAsyncComponent } from 'vue'

export type MazSpinnerVariant = 'ring' | 'dots' | 'bars' | 'pulse'

export interface MazSpinnerProps {
  /**
   * The size of the spinner
   * @default 2em
   */
  size?: MazSizeUnit
  /**
   * The color of the spinner
   * @default theme
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   */
  color?: MazColor
  /**
   * Look of the spinner: `ring` a turning arc, `dots` three bouncing dots, `bars` four bars that stretch, `pulse` a disc that breathes
   * @values `'ring' | 'dots' | 'bars' | 'pulse'`
   * @default 'ring'
   */
  variant?: MazSpinnerVariant
  /**
   * The task is done: the spinner is replaced by a check that draws itself
   * @default false
   */
  done?: boolean
}

const {
  size = '2em',
  color = 'theme',
  variant = 'ring',
  done = false,
} = defineProps<MazSpinnerProps>()

const MazDrawnIcon = defineAsyncComponent(() => import('./MazDrawnIcon.vue'))

const spinnerStyle = computed<CSSProperties>(() => {
  const c = color as string
  if (!c || c === 'theme')
    return {}
  if (c === 'normal')
    return { color: 'var(--maz-foreground)' }
  if (c === 'transparent')
    return { color: 'white' }
  return { color: `var(--maz-${c === 'neutral' ? 'neutral-foreground' : c})` }
})
</script>

<template>
  <MazDrawnIcon
    v-if="done"
    name="check-circle"
    class="m-spinner m-spinner--done m-reset-css maz:m-0!"
    :class="`m-spinner--${color}`"
    :size="size"
    :style="spinnerStyle"
  />
  <svg
    v-else
    :width="size"
    :height="size"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    xml:space="preserve"
    class="m-spinner m-reset-css maz:m-0!"
    :class="[variant === 'ring' ? 'maz:animate-spin maz:fill-current' : 'maz:fill-current', `m-spinner--${color}`, variant !== 'ring' && `m-spinner--${variant}`]"
    :style="spinnerStyle"
  >
    <template v-if="variant === 'dots'">
      <circle v-for="index in 3" :key="index" class="m-spinner__shape" :style="{ '--m-spinner-index': index - 1 }" :cx="9 + (index - 1) * 16" cy="25" r="5" />
    </template>
    <template v-else-if="variant === 'bars'">
      <rect v-for="index in 4" :key="index" class="m-spinner__shape" :style="{ '--m-spinner-index': index - 1 }" :x="6 + (index - 1) * 10.5" y="9" width="5" height="32" rx="2.5" />
    </template>
    <circle v-else-if="variant === 'pulse'" class="m-spinner__shape" cx="25" cy="25" r="20" />
    <path
      v-else
      d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
    />
  </svg>
</template>

<style>
.m-spinner__shape {
  --m-spinner-loop: calc(var(--maz-motion-slower, 450ms) * 3 * var(--maz-motion-scale, 1));

  animation-duration: var(--m-spinner-loop);
  animation-timing-function: var(--maz-easing-in-out, ease-in-out);
  animation-iteration-count: infinite;
  animation-delay: calc(var(--m-spinner-index, 0) * var(--m-spinner-loop) * 0.12);
  transform-box: fill-box;
  transform-origin: center;
}

.m-spinner--dots .m-spinner__shape {
  animation-name: m-spinner-dot;
}

.m-spinner--bars .m-spinner__shape {
  animation-name: m-spinner-bar;
}

.m-spinner--pulse .m-spinner__shape {
  animation-name: m-spinner-pulse;
}

@keyframes m-spinner-dot {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: scale(0.7);
  }

  40% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes m-spinner-bar {
  0%,
  80%,
  100% {
    opacity: 0.45;
    transform: scaleY(0.4);
  }

  40% {
    opacity: 1;
    transform: scaleY(1);
  }
}

@keyframes m-spinner-pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.55);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
