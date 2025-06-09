<script setup lang="ts">
import type { MazPickerValue } from 'maz-ui/components'
import * as MazIcons from '@maz-ui/icons'
import { useTheme } from '@maz-ui/themes'

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

const date = ref<MazPickerValue>()

const { currentPreset, colorMode, isDark, strategy, updateTheme, setColorMode, toggleDarkMode } =
  useTheme()
</script>

<template>
  <div id="home" class="maz-flex maz-h-screen maz-flex-col maz-items-center maz-justify-center">
    <div class="maz-flex maz-flex-wrap maz-gap-2">
      <Component
        :is="icon"
        v-for="[key, icon] in Object.entries(MazIcons)"
        :key="key"
        class="maz-text-sm"
        :class="key"
      />
    </div>

    <MazBadge outline color="destructive">COUCOUCOUCOUC</MazBadge>

    <MazBtn pastel color="contrast" @click="showToast"> Show toast contrast </MazBtn>
    <MazBtn color="primary" @click="showToast"> Show toast primary </MazBtn>
    <MazBtn color="secondary" @click="colorMode = 'dark'">
      Set color mode to dark secondary
    </MazBtn>
    <MazBtn color="accent" @click="setColorMode('light')"> Set color mode to light accent </MazBtn>
    <MazBtn color="destructive" @click="setColorMode('auto')">
      Set color mode to auto destructive
    </MazBtn>
    <MazBtn disabled color="success" @click="toggleDarkMode"> Toggle dark mode success </MazBtn>
    <MazBtn color="warning" @click="toggleDarkMode"> Toggle dark mode warning </MazBtn>
    <MazBtn color="transparent" @click="toggleDarkMode"> Toggle dark mode transparent </MazBtn>
    <MazBtn color="info" @click="toggleDarkMode"> Toggle dark mode info </MazBtn>
  </div>
</template>
