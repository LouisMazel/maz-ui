<script setup lang="ts">
import { MazTrash } from '@maz-ui/icons/raw/MazTrash'
import { mazUi } from '@maz-ui/themes/presets/mazUi'
import fr from '@maz-ui/translations/locales/fr'
import { MazUiProvider } from 'maz-ui/components'
import MazBtn from 'maz-ui/components/MazBtn'

import { capitalize } from 'vue'

import { routes } from './router/index'

const { message, success, error, info, warning } = useToast()

function showToast() {
  message(`Hello, <strong>world</strong>!`, {
    position: 'top-right',
    html: true,
    maxToasts: 2,
    queue: true,
  })
  info('Hello, world!', {
    position: 'bottom-right',
  })
  warning('Hello, world!', {
    position: 'bottom-left',
  })
  error('Hello, world!', {
    position: 'bottom',
  })
  success('Hello, world!', {
    position: 'top-left',
  })
  message('Hello, world!', {
    position: 'top',
    buttons: [
      {
        text: 'Click me',
        color: 'warning',
        endIcon: MazTrash,
      },
    ],
  })
}
</script>

<template>
  <MazUiProvider
    :theme="{
      preset: mazUi,
      colorMode: 'auto',
      darkClass: 'dark',
      darkModeStrategy: 'class',
      mode: 'both',
      strategy: 'runtime',
      overrides: {
        foundation: {
          'base-font-size': '14px',
          // 'font-family': 'Helvetica Neue, sans-serif, system-ui, -apple-system, blinkmacsystemfont, \'Segoe UI\', roboto, oxygen, ubuntu, cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
          // 'radius': '0rem',
          'border-width': '1px',
        },
        components: {
          btn: { 'font-weight': '600' },
        },
      },
    }"
    :translations="{
      locale: 'en',
      fallbackLocale: 'en',
      preloadFallback: false,
      messages: {
        en: fr,
      },
    }"
  >
    <div class="maz:flex maz:h-full maz:flex-col">
      <nav class="maz:sticky maz:top-0 maz:z-50 maz:flex maz:h-16 maz:flex-none maz:items-center maz:gap-4 maz:border-b maz:padded-container maz:bg-surface">
        <MazLink v-for="route in routes" :key="route.path" :to="route.path" color="contrast">
          {{ capitalize(route.name) }}
        </MazLink>

        <div class="maz:flex-1" />
        <ThemeSwitcher />
        <LangSwitcher />
        <MazBtn @click="showToast">
          Show Toast
        </MazBtn>
      </nav>

      <main class="maz:flex-1 maz:overflow-y-auto maz:py-8 maz:padded-container">
        <RouterView />
      </main>
    </div>
  </MazUiProvider>
</template>
