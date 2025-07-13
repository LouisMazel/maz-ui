<script setup lang="ts">
import { mazUi, obsidian, ocean, pristine, useTheme } from '@maz-ui/themes/src/index.ts'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'

const { updateTheme, setColorMode } = useTheme()

const { message, success, error, info, warning } = useToast()

const { locale, setLocale, t } = useTranslations()

function changeLocale() {
  if (locale.value === 'de') {
    setLocale('en')
  }
  else {
    setLocale('de')
  }
}

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
</script>

<template>
  <div class="maz-flex maz-h-full maz-flex-col">
    <nav class="maz-flex maz-h-16 maz-flex-none maz-items-center maz-gap-4 maz-border-b maz-p-4 maz-padded-container">
      <MazLink to="/">
        Home
      </MazLink>
      <MazLink to="/about">
        About
      </MazLink>

      <MazLink @click="setColorMode('dark')">
        Dark
      </MazLink>
      <MazLink @click="setColorMode('light')">
        Light
      </MazLink>
      <MazLink @click="updateTheme(ocean)">
        Ocean
      </MazLink>
      <MazLink @click="updateTheme(pristine)">
        Pristine
      </MazLink>
      <MazLink @click="updateTheme(mazUi)">
        MazUi
      </MazLink>
      <MazLink @click="updateTheme(obsidian)">
        Obsidian
      </MazLink>

      <div class="maz-flex-1" />

      <MazBtn @click="showToast">
        Show Toast
      </MazBtn>
      <MazBtn @click="changeLocale">
        Change Locale
      </MazBtn>
    </nav>
    {{ t('pagination.navAriaLabel') }}

    <main class="maz-flex-1 maz-overflow-auto maz-py-8 maz-padded-container">
      <RouterView />
    </main>
  </div>
</template>
