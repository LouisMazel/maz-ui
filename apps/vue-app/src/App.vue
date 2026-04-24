<script setup lang="ts">
import { MazTrash } from '@maz-ui/icons/MazTrash'
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
        rightIcon: MazTrash,
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
      strategy: 'hybrid',
      overrides: {
        foundation: {
          'base-font-size': '16px',
          'font-family': 'Helvetica Neue, sans-serif, system-ui, -apple-system, blinkmacsystemfont, \'Segoe UI\', roboto, oxygen, ubuntu, cantarell, \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
          'radius': '0rem',
          'border-width': '1px',
        },
        colors: {
          light: {
            'background': '0 0% 100%',
            'foreground': '210 8% 14%',
            'primary': '210 100% 56%',
            'primary-foreground': '0 0% 100%',
            'secondary': '272 99% 54%',
            'secondary-foreground': '0 0% 100%',
            'accent': '164 76% 46%',
            'accent-foreground': '0 0% 100%',
            'success': '80 61% 50%',
            'success-foreground': '210 8% 14%',
            'warning': '40 97% 59%',
            'warning-foreground': '210 8% 14%',
            'destructive': '356.95 95.91% 57.73%',
            'destructive-foreground': '0 0% 100%',
            'info': '188 78% 41%',
            'info-foreground': '0 0% 100%',
            'contrast': '235 16% 15%',
            'contrast-foreground': '255 0% 95%',
            'border': '220 13.04% 90.98%',
            'overlay': '0 0% 40%',
            'muted': '0 0% 54%',
            'shadow': '240 5.9% 10%',
          },
          dark: {
            'background': '0 0% 3%',
            'foreground': '0 0% 85%',
            'primary': '70 100% 50%',
            'primary-foreground': '0 2% 8%',
            'secondary': '0 0% 3%',
            'secondary-foreground': '0 0% 95%',
            'accent': '164 76% 46%',
            'accent-foreground': '0 0% 100%',
            'success': '144 72% 56%',
            'success-foreground': '210 8% 14%',
            'warning': '30 100% 62%',
            'warning-foreground': '210 8% 14%',
            'destructive': '0 100% 62%',
            'destructive-foreground': '0 0% 100%',
            'info': '215 100% 62%',
            'info-foreground': '0 0% 100%',
            'contrast': '0 0% 91%',
            'contrast-foreground': '210 8% 14%',
            'muted': '0 0% 53%',
            'border': '0 0% 12%',
            'overlay': '0 0% 5%',
            'shadow': '77 66% 17%',
          },
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
      <nav class="maz:flex maz:h-16 maz:flex-none maz:items-center maz:gap-4 maz:border-b maz:p-4 maz:padded-container">
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
