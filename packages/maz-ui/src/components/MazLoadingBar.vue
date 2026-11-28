<script lang="ts" setup>
import type { MazColor } from './types.ts'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { readMotionDuration } from '../utils/motionTokens.ts'

export interface MazLoadingBarProps {
  /**
   * The color of the component.
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   */
  color?: MazColor
  /** The height of the component. */
  height?: string
  /**
   * Drives the bar like a page loader: `true` advances by steps that slow down, `false` runs to the end and slips out.
   * Without it, the bar slides endlessly
   * @default undefined
   */
  loading?: boolean
}

const { color = 'primary', loading = undefined } = defineProps<MazLoadingBarProps>()

type Phase = 'idle' | 'running' | 'finishing' | 'leaving'

const MAX_PROGRESS = 0.95

const isTrickle = computed(() => loading !== undefined)
const progress = ref(0)
const phase = ref<Phase>('idle')
let timer: ReturnType<typeof setTimeout> | undefined
let steps = 0

function clearTimer() {
  clearTimeout(timer)
  timer = undefined
}

function step() {
  progress.value += (MAX_PROGRESS - progress.value) * 0.2
  steps++
  timer = setTimeout(step, 250 + steps * 150)
}

function start() {
  clearTimer()
  steps = 0
  phase.value = 'running'
  progress.value = 0.08
  timer = setTimeout(step, 250)
}

function finish() {
  if (phase.value === 'idle')
    return

  clearTimer()
  progress.value = 1
  phase.value = 'finishing'
  timer = setTimeout(() => {
    phase.value = 'leaving'
    timer = setTimeout(() => {
      phase.value = 'idle'
      progress.value = 0
    }, readMotionDuration('--maz-motion-normal', 220) * 0.7)
  }, readMotionDuration('--maz-motion-normal', 220))
}

function sync(value: boolean | undefined) {
  if (value === true)
    start()
  else if (value === false)
    finish()
}

onMounted(() => sync(loading))
watch(() => loading, sync)
onBeforeUnmount(clearTimer)

const accent = computed(() => (color === 'neutral' ? 'neutral-foreground' : color))

const colorCSSVariables = computed(() => ({
  alpha: `color-mix(in srgb, var(--maz-${accent.value}) 20%, transparent)`,
  main: `var(--maz-${accent.value})`,
}))
</script>

<template>
  <div
    class="m-loading-bar m-reset-css maz:relative maz:block maz:w-full maz:overflow-hidden"
    :role="isTrickle ? 'progressbar' : undefined"
    :aria-busy="isTrickle ? phase === 'running' : undefined"
    :aria-hidden="isTrickle && phase === 'idle' ? true : undefined"
    :style="[{ '--loading-bar-height': height, '--loading-bar-color': colorCSSVariables.alpha, '--loading-bar-main-color': colorCSSVariables.main }]"
  >
    <div
      v-if="isTrickle"
      class="m-loading-bar__bar"
      :class="`--${phase}`"
      :style="{ '--m-loading-bar-progress': progress }"
    />
    <div v-else />
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

.m-loading-bar .m-loading-bar__bar {
  inline-size: 100%;
  block-size: 100%;
  transform: scaleX(var(--m-loading-bar-progress, 0));
  transform-origin: left center;
  transition: transform calc(var(--maz-motion-normal, 220ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);

  &::before,
  &::after {
    display: none;
  }

  &.--idle {
    transition: none;
  }

  &.--leaving {
    opacity: 0;
    translate: 100% 0;
    transition:
      translate calc(var(--maz-motion-normal, 220ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
      opacity calc(var(--maz-motion-normal, 220ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
  }
}

[dir='rtl'] .m-loading-bar .m-loading-bar__bar {
  transform-origin: right center;

  &.--leaving {
    translate: -100% 0;
  }
}
</style>
