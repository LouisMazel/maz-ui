<script lang="ts" setup>
import { useInjectStrict } from '../composables/useInjectStrict'
import { mazTableKey } from './MazTable.vue'

const { size } = useInjectStrict(mazTableKey)

const SIZE_CLASS = {
  xl: 'maz:px-5 maz:py-5 maz:text-xl',
  lg: 'maz:px-4 maz:py-4 maz:text-lg',
  md: 'maz:px-3 maz:py-3 maz:text-base',
  sm: 'maz:px-2 maz:py-2 maz:text-sm',
  xs: 'maz:px-1 maz:py-1 maz:text-xs',
  mini: 'maz:px-0.5 maz:py-0.5 maz:text-xs',
} as const
</script>

<template>
  <th class="m-table-title m-reset-css" :class="SIZE_CLASS[size as keyof typeof SIZE_CLASS]">
    <slot />
  </th>
</template>
