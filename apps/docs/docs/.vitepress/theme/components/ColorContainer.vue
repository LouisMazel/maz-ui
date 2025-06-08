<script lang="ts" setup>
defineProps<{
  color: string
  hex: string
}>()
</script>

<template>
  <div
    class="color-container"
    :class="[`--${color}`]"
    :style="`background-color: var(--maz-color-${color}); color: var(--maz-color-${color}-contrast);`"
  >
    <span>
      {{ color }}: {{ hex }}
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.color-container {
  @apply maz-rounded maz-mt-4 maz-py-8 maz-px-4 maz-text-lg tab-s:maz-text-xl maz-flex maz-flex-center maz-font-semibold;
}
</style>
