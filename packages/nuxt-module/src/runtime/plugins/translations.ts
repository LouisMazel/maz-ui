import { MazTranslations, type MazTranslationsInstance } from '@maz-ui/translations'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const translationsOptions = $config.public.mazUi?.translations

  vueApp.use(MazTranslations, translationsOptions)
})

declare module '#app' {
  interface NuxtApp {
    $mazTranslations: MazTranslationsInstance
  }
}
