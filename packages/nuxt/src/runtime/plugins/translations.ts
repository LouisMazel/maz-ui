import type { MazUiTranslationsInstance } from '@maz-ui/translations'
import { MazUiTranslations } from '@maz-ui/translations/plugin'
import { defineNuxtPlugin } from 'nuxt/app'
import messages from '#build/maz-ui-translations.mjs'

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const i18n: MazUiTranslationsInstance = MazUiTranslations.install?.(vueApp, {
    ...$config.public.mazUi.translations,
    messages,
  })

  // The server renders with the messages, and the client hydrates with the same ones
  await i18n.ready
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazTranslations: MazUiTranslationsInstance
  }
}
