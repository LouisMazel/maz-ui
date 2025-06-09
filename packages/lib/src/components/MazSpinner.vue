<script lang="ts" setup>
import type { MazColor } from './types'

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
    style="enable-background: new 0 0 50 50"
  >
    <path
      d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
    />
  </svg>
</template>

<style lang="postcss" scoped>
  .m-spinner {
  @apply maz-animate-spin maz-fill-current;
  @apply maz-m-0 !important;

  &--normal {
    @apply maz-text-foreground;
  }

  &--primary {
    @apply maz-text-primary;
  }

  &--secondary {
    @apply maz-text-secondary;
  }

  &--accent {
    @apply maz-text-accent;
  }

  &--info {
    @apply maz-text-info;
  }

  &--warning {
    @apply maz-text-warning;
  }

  &--destructive {
    @apply maz-text-destructive;
  }

  &--success {
    @apply maz-text-success;
  }

  &--transparent {
    @apply maz-text-white;
  }

  &--contrast {
    @apply maz-text-contrast;
  }
}
</style>
