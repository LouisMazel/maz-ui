import type { App } from 'vue'
import type { MazUiTranslationsInstance } from '../types'

export function injectTranslations({
  app,
  i18n,
}: {
  app?: App
  i18n: MazUiTranslationsInstance
}) {
  if (!app) {
    throw new Error('[@maz-ui/translations](injectTranslations) No app instance provided')
  }

  app.config.globalProperties.$mazTranslations = i18n
  app.provide('mazTranslations', i18n)
}
