<script lang="ts" setup>
defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-divider bg-container p-5">
    <h3 class="text-title-4">
      {{ title }}
    </h3>
    <p v-if="hint" class="mt-1 mb-4 text-body-sm text-muted">
      {{ hint }}
    </p>
    <div v-else class="mb-4" />
    <slot />
  </div>
</template>
