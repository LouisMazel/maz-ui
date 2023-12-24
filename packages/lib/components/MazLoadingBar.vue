<template>
  <div class="m-loading-bar">
    <div></div>
  </div>
</template>

<script lang="ts" setup>
  import type { Color } from './types'
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      /** The color of the loading bar */
      color?: Color
      /** Height of the bar */
      height?: string
    }>(),
    { color: 'primary', height: '0.125rem' },
  )

  const colorCSVariables = computed(() => ({
    alpha: `var(--maz-color-${props.color}-alpha-20)`,
    main: `var(--maz-color-${props.color})`,
  }))
</script>

<style lang="postcss" scoped>
  .m-loading-bar {
    @apply maz-relative maz-block maz-w-full maz-overflow-hidden;

    height: v-bind('height');
    background-color: v-bind('colorCSVariables.alpha');
    overflow: hidden;

    div {
      background-color: v-bind('colorCSVariables.main');

      &::before {
        content: '';

        @apply maz-absolute;

        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
      }

      &::after {
        content: '';

        @apply maz-absolute;

        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
      }
    }
  }

  @keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }

    60% {
      left: 100%;
      right: -90%;
    }

    100% {
      left: 100%;
      right: -90%;
    }
  }

  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }

    60% {
      left: 107%;
      right: -8%;
    }

    100% {
      left: 107%;
      right: -8%;
    }
  }
</style>
