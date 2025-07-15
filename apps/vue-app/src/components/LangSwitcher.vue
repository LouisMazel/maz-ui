<script setup lang="ts">
import type { MazDropdownProps } from 'maz-ui/components'
import { useTranslations } from '@maz-ui/translations'

const { locale, setLocale } = useTranslations()

const languages: MazDropdownProps['items'] = [
  { label: '🇺🇸 English', onClick: () => setLocale('en') },
  { label: '🇫🇷 Français', onClick: () => setLocale('fr') },
  { label: '🇪🇸 Español', onClick: () => setLocale('es') },
  { label: '🇩🇪 Deutsch', onClick: () => setLocale('de') },
  { label: '🇮🇹 Italiano', onClick: () => setLocale('it') },
]
</script>

<template>
  <MazDropdown class="language-switcher" :items="languages">
    {{ locale }}
  </MazDropdown>
</template>
