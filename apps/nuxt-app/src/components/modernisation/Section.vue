<script lang="ts" setup>
defineProps<{
  id: string
  title: string
  description: string
}>()
</script>

<template>
  <section :id="id" class="scroll-mt-24 border-b border-divider py-10">
    <h2 class="text-title-2">
      {{ title }}
    </h2>
    <p class="mt-1 mb-6 max-w-3xl text-muted">
      {{ description }}
    </p>
    <div class="flex flex-col gap-8">
      <slot />
    </div>
  </section>
</template>
