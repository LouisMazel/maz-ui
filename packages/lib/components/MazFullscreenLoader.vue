<script lang="ts" setup>
import type { Color } from './types'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'

withDefaults(defineProps<Props>(), { color: 'primary', size: '3em' })

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export interface Props {
  /** The color of the spinner */
  color?: Color
  /** The size of the spinner */
  size?: string
}

function addClassToDocument() {
  document.documentElement.classList.add('--maz-fullscreen-loader-present')
}

async function removeClassFromDocument() {
  document.documentElement.classList.remove('--maz-fullscreen-loader-present')
}

onMounted(() => {
  addClassToDocument()
})

onUnmounted(() => {
  removeClassFromDocument()
})
</script>

<template>
  <div
    class="maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-flex-col maz-gap-2 maz-bg-overlay maz-text-center maz-backdrop-blur maz-flex-center"
  >
    <MazSpinner :color="color" :size="size" />

    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<style lang="postcss">
  html.--maz-fullscreen-loader-present {
  overflow-y: hidden;
  height: 100vh;
}
</style>
