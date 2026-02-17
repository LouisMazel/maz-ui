<script lang="ts" setup>
import type { MazUiThemeOptions, ThemePreset, ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import type { Ref } from 'vue'
import { setupTheme } from '@maz-ui/themes/utils/setup-theme'
import { createMazUiTranslations } from '@maz-ui/translations/utils/instance'
import { onUnmounted, provide, ref, watch } from 'vue'

export interface MazUiProviderProps {
  theme: MazUiThemeOptions & { preset: ThemePreset }
  translations?: MazUiTranslationsOptions
}

const {
  theme,
  translations = {},
} = defineProps<MazUiProviderProps>()

const i18n = createMazUiTranslations(translations)
provide('mazTranslations', i18n)

const providedThemeState = ref<ThemeState>() as Ref<ThemeState>
provide('mazThemeState', providedThemeState)

let themeCleanup: (() => void) | undefined
let stopThemeSync: (() => void) | undefined

function initTheme(options: MazUiThemeOptions & { preset: ThemePreset }) {
  themeCleanup?.()
  stopThemeSync?.()

  const { themeState, cleanup } = setupTheme(options)
  providedThemeState.value = themeState.value

  stopThemeSync = watch(themeState, (newState) => {
    providedThemeState.value = { ...newState }
  }, { deep: true })

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
  stopThemeSync?.()
})
</script>

<template>
  <slot />
</template>
