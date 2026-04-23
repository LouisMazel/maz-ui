<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor } from './types'
import { computed } from 'vue'

export interface MazSpinnerProps {
  /**
   * The size of the spinner
   * @default 2em
   */
  size?: string
  /**
   * The color of the spinner
   * @default theme
   */
  color?: MazColor
}

const {
  size = '2em',
  color = 'theme',
} = defineProps<MazSpinnerProps>()

const spinnerStyle = computed<CSSProperties>(() => {
  const c = color as string
  if (!c || c === 'theme')
    return {}
  if (c === 'normal')
    return { color: 'hsl(var(--maz-foreground))' }
  if (c === 'transparent')
    return { color: 'white' }
  return { color: `hsl(var(--maz-${c}))` }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    xml:space="preserve"
    class="m-spinner m-reset-css"
    :class="`m-spinner--${color}`"
    :style="spinnerStyle"
  >
    <path
      d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
    />
  </svg>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-spinner {
  @apply maz:animate-spin maz:fill-current;
  @apply maz:m-0!;
}
</style>
