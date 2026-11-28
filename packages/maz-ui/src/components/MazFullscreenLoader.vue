<script lang="ts" setup>
import type { MazColor, MazSizeUnit } from './types.ts'
import { onMounted, onUnmounted } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import MazSpinner from './MazSpinner.vue'

defineOptions({
  inheritAttrs: false,
})

const { color = 'primary', size = '3em', teleportSelector = 'body' } = defineProps<MazFullscreenLoaderProps>()

export interface MazFullscreenLoaderProps {
  /**
   * The color of the spinner
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   */
  color?: MazColor
  /** The size of the spinner */
  size?: MazSizeUnit
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
    <Transition name="m-fullscreen-loader" appear>
      <div
        class="m-fullscreen-loader m-reset-css maz:fixed maz:inset-0 maz:z-default-backdrop maz:flex maz:flex-col maz:flex-center maz:gap-2 maz:bg-overlay/5 maz:text-center maz:backdrop-blur-sm"
        role="status"
        aria-busy="true"
        v-bind="$attrs"
      >
        <MazSpinner :color="color" :size="size" />

        <span v-if="hasSlotContent($slots.default)">
          <slot />
        </span>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
html.--maz-fullscreen-loader-present {
  overflow-y: hidden;
  block-size: 100vh;
}

.m-fullscreen-loader-enter-active {
  transition: opacity calc(var(--maz-motion-normal, 220ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-fullscreen-loader-leave-active {
  transition: opacity calc(var(--maz-motion-normal, 220ms) * 0.7 * var(--maz-motion-scale, 1))
    var(--maz-easing-in, ease-in);
}

.m-fullscreen-loader-enter-from,
.m-fullscreen-loader-leave-to {
  opacity: 0;
}
</style>
