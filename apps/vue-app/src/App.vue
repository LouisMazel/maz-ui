<script setup lang="ts">
import { mazUi } from '@maz-ui/themes'
import fr from '@maz-ui/translations/locales/fr'
import { MazUiProvider } from 'maz-ui/components'
import AppHeader from './components/AppHeader.vue'
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
        colors: {
          light: {
            primary: '272 99% 54%',
            destructive: '357 96% 58%',
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
    <div class="maz-flex maz-h-full maz-flex-col">
      <AppHeader />

      <main class="maz-flex-1 maz-overflow-y-auto maz-py-8 maz-padded-container">
        <RouterView />
      </main>
    </div>
  </MazUiProvider>
</template>
