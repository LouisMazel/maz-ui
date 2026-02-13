<script lang="ts" setup>
import type { MazUiThemeOptions, ThemePreset } from '@maz-ui/themes'
import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import { injectThemeState } from '@maz-ui/themes/utils/inject'
import { setupTheme } from '@maz-ui/themes/utils/setup-theme'
import { injectTranslations } from '@maz-ui/translations/utils/inject'
import { createMazUiTranslations } from '@maz-ui/translations/utils/instance'
import { getCurrentInstance, onUnmounted, watch } from 'vue'

export interface MazUiProviderProps {
  theme: MazUiThemeOptions & { preset: ThemePreset }
  translations?: MazUiTranslationsOptions
}

const {
  theme,
  translations = {},
} = defineProps<MazUiProviderProps>()

const currentInstance = getCurrentInstance()
const app = currentInstance?.appContext?.app

const i18n = createMazUiTranslations(translations)
injectTranslations({ app, i18n })

let themeCleanup: (() => void) | undefined

function initTheme(options: MazUiThemeOptions & { preset: ThemePreset }) {
  themeCleanup?.()
  const { themeState, cleanup } = setupTheme(options)
  injectThemeState({ app, themeState })
  themeCleanup = cleanup
}

initTheme(theme)

watch(() => theme, (newThemeOptions) => {
  initTheme(newThemeOptions)
}, { deep: true })

watch(() => translations, (newTranslationsOptions) => {
  if (newTranslationsOptions?.locale) {
    i18n.setLocale(newTranslationsOptions.locale)
  }
}, { deep: true })

onUnmounted(() => {
  themeCleanup?.()
})
</script>

<template>
  <slot />
</template>
