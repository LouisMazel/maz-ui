<script lang="ts" setup generic="TLocale extends string">
import type { MazUiThemeOptions, ThemePreset, ThemeState } from '@maz-ui/themes'
import type { MazUiTranslationsMessages, MazUiTranslationsOptions } from '@maz-ui/translations'
import { setupTheme } from '@maz-ui/themes/utils/setup-theme'
import { createMazUiTranslations } from '@maz-ui/translations/utils/instance'
import { onUnmounted, provide, ref, watch } from 'vue'

export type MazUiProviderTranslations<T extends string = string> = Omit<MazUiTranslationsOptions, 'messages' | 'locale'> & {
  locale: T
  messages: MazUiTranslationsMessages & Record<T, MazUiTranslationsMessages[string]>
}

export interface MazUiProviderProps<T extends string = string> {
  theme: MazUiThemeOptions & { preset: ThemePreset }
  /**
   * Must include `locale` and at least the messages for that locale in `messages`
   * @example { locale: 'fr', messages: { fr: { ... } } }
   */
  translations: MazUiProviderTranslations<T>
}

const {
  theme,
  translations,
} = defineProps<MazUiProviderProps<TLocale>>()

const i18n = createMazUiTranslations(translations)
provide('mazTranslations', i18n)

const providedThemeState = ref<ThemeState>()
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
