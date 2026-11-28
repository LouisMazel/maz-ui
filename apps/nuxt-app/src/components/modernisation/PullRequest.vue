<script lang="ts" setup>
defineProps<{
  number: number
  title: string
  description: string
}>()
</script>

<template>
  <div :id="`pr-${number}`" class="my-16 scroll-mt-24 overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-elevation tab-m:p-12">
    <p class="text-overline opacity-80">
      Pull request {{ number }}
    </p>
    <p class="mt-2 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none font-black tracking-tight uppercase">
      Pull request {{ number }}
    </p>
    <p class="mt-4 text-title-3">
      {{ title }}
    </p>
    <p class="mt-2 max-w-3xl opacity-90">
      {{ description }}
    </p>
  </div>
</template>
