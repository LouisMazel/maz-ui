<template>
  <div
    class="color-container rounded"
    :class="[`--${color}`]"
    :style="`background-color: var(--maz-color-${color}); color: var(--maz-color-${color}-contrast);`"
  >
    <span>
      {{ color }}: {{ hex }}
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: { type: String, required: true },
  hex: { type: String, required: true },
})
</script>

<style scoped>
.color-container {
  margin-top: 1rem;
  padding: 2rem 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
