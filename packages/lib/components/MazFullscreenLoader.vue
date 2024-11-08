<script lang="ts" setup>
import type { Color } from './types'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'

const { color = 'primary', size = '3em', teleportSelector = 'body' } = defineProps<MazFullscreenLoaderProps>()

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export interface MazFullscreenLoaderProps {
  /** The color of the spinner */
  color?: Color
  /** The size of the spinner */
  size?: string
  /** The selector to teleport the loader */
  teleportSelector?: string
}

function addClassToDocument() {
  document.documentElement.classList.add('--maz-fullscreen-loader-present')
}

function removeClassFromDocument() {
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
  <Teleport :to="teleportSelector">
    <div
      class="m-fullscreen-loader maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-flex-col maz-gap-2 maz-bg-overlay maz-text-center maz-backdrop-blur maz-flex-center"
      v-bind="$attrs"
    >
      <MazSpinner :color="color" :size="size" />

      <span v-if="$slots.default">
        <slot />
      </span>
    </div>
  </Teleport>
</template>

<style lang="postcss">
  html.--maz-fullscreen-loader-present {
  overflow-y: hidden;
  height: 100vh;
}
</style>
