import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import { MazUiTranslations } from '@maz-ui/translations'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const translationsOptions = $config.public.mazUi.translations || {}

  const i18n = MazUiTranslations.install(vueApp, translationsOptions)

  if (import.meta.server) {
    const locale = translationsOptions.locale || 'en'
    const fallbackLocale = translationsOptions.fallbackLocale || 'en'

    try {
      await i18n.setLocale(locale)

      // Preload fallback locale if different and preloadFallback is enabled
      if (
        locale !== fallbackLocale
        && translationsOptions.preloadFallback !== false
      ) {
        await i18n.setLocale(fallbackLocale)
        // Switch back to the main locale
        await i18n.setLocale(locale)
      }
    }
    catch (error) {
      console.warn('Failed to preload locale:', error)
    }
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazTranslations: MazUiTranslationsInstance
  }
}
