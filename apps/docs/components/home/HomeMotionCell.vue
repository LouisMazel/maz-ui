<script lang="ts" setup>
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <MazCard bordered radius block class="maz:h-full">
    <div class="maz:flex maz:h-full maz:min-w-0 maz:flex-col maz:gap-4">
      <header class="maz:flex maz:flex-col maz:gap-1">
        <h3 class="maz:m-0 maz:font-display maz:text-lg maz:font-semibold maz:tracking-tight">
          {{ title }}
        </h3>
        <p class="maz:m-0 maz:text-sm/relaxed maz:text-muted">
          {{ description }}
        </p>
      </header>
      <div class="maz:flex maz:min-w-0 maz:flex-col maz:gap-3">
        <slot />
      </div>
    </div>
  </MazCard>
</template>
