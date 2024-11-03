<script lang="ts" setup>
import type { MazTableProvide } from './MazTable.vue'
import { injectStrict } from './../modules/helpers/inject-strict'

const { size } = injectStrict<MazTableProvide>('maz-table')
</script>

<template>
  <th class="m-table-title" :class="[`--${size}`]">
    <slot />
  </th>
</template>

<style lang="postcss" scoped>
.m-table-title {
  &.--truncate {
    @apply maz-truncate;
  }

  &.--xl {
    @apply maz-px-5 maz-py-5 maz-text-xl;
  }

  &.--lg {
    @apply maz-px-4 maz-py-4 maz-text-lg;
  }

  &.--md {
    @apply maz-px-3 maz-py-3 maz-text-base;
  }

  &.--sm {
    @apply maz-px-2 maz-py-2 maz-text-sm;
  }

  &.--xs {
    @apply maz-px-1 maz-py-1 maz-text-xs;
  }

  &.--mini {
    @apply maz-px-0.5 maz-py-0.5 maz-text-xs;
  }
}
</style>
