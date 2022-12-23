<template>
  <div v-if="wait.isLoading()" class="loader maz-absolute maz-inset-0 maz-flex maz-flex-center">
    <MazSpinner size="3rem" color="white" />
  </div>
</template>

<script lang="ts" setup>
  import MazSpinner from 'maz-ui/package/components/MazSpinner.vue'
  import { useWait } from 'maz-ui/package/composables'

  const { wait } = useWait()
</script>

<style lang="postcss" scoped>
  .loader {
    @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-bg-overlay maz-opacity-100 maz-flex-center;

    backdrop-filter: blur(3px);
  }
</style>
