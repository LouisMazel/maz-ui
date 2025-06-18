import { MazTranslations, type MazTranslationsInstance } from '@maz-ui/translations'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const translationsOptions = $config.public.mazUi?.translations

  if (translationsOptions === false) {
    return
  }

  await MazTranslations.install(vueApp, translationsOptions)
})

declare module '#app' {
  interface NuxtApp {
    $mazTranslations: MazTranslationsInstance
  }
}
