<script setup lang="ts">
import type { MazDropdownProps } from 'maz-ui/components'
import { useTranslations } from '@maz-ui/translations'

const { locale, setLocale } = useTranslations()

const languages: MazDropdownProps['items'] = [
  { label: '🇺🇸 English', onClick: () => setLocale('en'), locale: 'en' },
  { label: '🇫🇷 Français', onClick: () => setLocale('fr'), locale: 'fr' },
  { label: '🇪🇸 Español', onClick: () => setLocale('es'), locale: 'es' },
  { label: '🇩🇪 Deutsch', onClick: () => setLocale('de'), locale: 'de' },
  { label: '🇮🇹 Italiano', onClick: () => setLocale('it'), locale: 'it' },
]
</script>

<template>
  <MazDropdown class="language-switcher" position="bottom-end" trigger="click" :items="languages">
    {{ languages.find(l => l.locale === locale)?.label }}
  </MazDropdown>
</template>
