<template>
  <div
    class="maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-flex-col maz-gap-2 maz-bg-overlay maz-text-center maz-backdrop-blur maz-flex-center"
  >
    <MazSpinner :color="color" :size="size" />

    <span v-if="$slots['default']">
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'
  import type { Color } from './types'

  const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

  withDefaults(
    defineProps<{
      color?: Color
      size?: string
    }>(),
    { color: 'primary', size: '3em' },
  )

  const addClassToDocument = () => {
    document.documentElement.classList.add('--maz-fullscreen-loader-present')
  }

  const removeClassFromDocument = async () => {
    document.documentElement.classList.remove('--maz-fullscreen-loader-present')
  }

  onMounted(() => {
    addClassToDocument()
  })

  onUnmounted(() => {
    removeClassFromDocument()
  })
</script>

<style lang="postcss">
  html.--maz-fullscreen-loader-present {
    overflow-y: hidden;
    height: 100vh;
  }
</style>
