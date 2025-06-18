<script setup lang="ts">
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { vTooltip } from 'maz-ui/src/directives/vTooltip.ts'

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

const { locale, setLocale, t } = useTranslations()

function changeLocale() {
  if (locale.value === 'de') {
    setLocale('en')
  }
  else {
    setLocale('de')
  }
}
</script>

<template>
  <div id="home" class="maz-flex maz-h-screen maz-flex-col maz-items-center maz-justify-center">
    <MazBtn @click="showToast">
      Show toast
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Hello, world!' }" @click="changeLocale">
      Changer locale ({{ locale }})
    </MazBtn>

    {{ t('carousel.ariaLabel.previousButton') }}
  </div>
</template>
