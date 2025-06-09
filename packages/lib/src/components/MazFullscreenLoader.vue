<script lang="ts" setup>
import type { MazColor } from './types'
import { onMounted, onUnmounted } from 'vue'
import MazSpinner from './MazSpinner.vue'

const { color = 'primary', size = '3em', teleportSelector = 'body' } = defineProps<MazFullscreenLoaderProps>()

export interface MazFullscreenLoaderProps {
  /** The color of the spinner */
  color?: MazColor
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
      class="m-fullscreen-loader m-reset-css"
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

<style lang="postcss" scoped>
.m-fullscreen-loader {
  @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-flex-col maz-gap-2 maz-bg-overlay/5 maz-text-center maz-backdrop-blur maz-flex-center;
}
</style>
