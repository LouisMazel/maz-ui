<script setup lang="ts">
import { useTheme } from '@maz-ui/themes'
import { vTooltip } from 'maz-ui/src/directives/vTooltip.js'

const { message, success, error, info, warning } = useToast()

function showToast() {
  message(`Hello, <strong>world</strong>!`, {
    position: 'top-right',
    timeout: 1000,
    html: true,
    persistent: true,
    maxToasts: 2,
    queue: true,
  })
  info('Hello, world!', {
    position: 'bottom-right',
    timeout: 10000,
  })
  warning('Hello, world!', {
    position: 'bottom-left',
    timeout: 10000,
  })
  error('Hello, world!', {
    position: 'bottom',
    timeout: 10000,
  })
  success('Hello, world!', {
    position: 'top-left',
    timeout: 10000,
  })
}

const isOpen = ref(true)

const { currentPreset, colorMode, isDark, strategy, updateTheme, setColorMode, toggleDarkMode } =
  useTheme()
</script>

<template>
  <div id="home" class="maz-flex maz-h-screen maz-flex-col maz-items-center maz-justify-center">
    <MazPopover position="top-start">
      <template #trigger>
        <MazBtn color="destructive" @click="isOpen = !isOpen"> Hello </MazBtn>
      </template>

      <template #default>
        <div class="maz-p-4">Hello</div>
      </template>
    </MazPopover>

    <p
      v-if="isOpen"
      v-tooltip="{
        text: 'COUCOUCOUCOUC',
      }"
      color="destructive"
    >
      Tooltipdzadzdzdzss
    </p>
  </div>
</template>
