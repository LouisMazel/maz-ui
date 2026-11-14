<script lang="ts" setup>
import { computed } from 'vue'

const { ratio } = defineProps<{
  ratio?: number
}>()

const level = computed(() => {
  if (ratio === undefined)
    return undefined
  if (ratio >= 7)
    return { label: 'AAA', className: 'maz:bg-success-100 maz:text-success-800 maz:dark:bg-success-900 maz:dark:text-success-200', description: 'readable for every text' }
  if (ratio >= 4.5)
    return { label: 'AA', className: 'maz:bg-success-100 maz:text-success-800 maz:dark:bg-success-900 maz:dark:text-success-200', description: 'readable for body text' }
  if (ratio >= 3)
    return { label: 'Large', className: 'maz:bg-warning-100 maz:text-warning-800 maz:dark:bg-warning-900 maz:dark:text-warning-200', description: 'only for large text and icons' }

  return { label: 'Low', className: 'maz:bg-destructive-100 maz:text-destructive-800 maz:dark:bg-destructive-900 maz:dark:text-destructive-200', description: 'not readable' }
})
</script>

<template>
  <span
    v-if="level && ratio !== undefined"
    class="maz:inline-flex maz:shrink-0 maz:items-center maz:gap-1 maz:rounded-full maz:px-2 maz:py-0.5 maz:font-mono maz:text-xs maz:font-medium maz:tabular-nums"
    :class="level.className"
    :title="`Contrast ${ratio.toFixed(2)}:1, ${level.description}`"
  >
    {{ ratio.toFixed(1) }}
    <span>{{ level.label }}</span>
  </span>
</template>
