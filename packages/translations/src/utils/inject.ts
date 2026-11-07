import type { App } from 'vue'
import type { MazUiTranslationsInstance } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { setActiveTranslations } from './active-instance'

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
  if (!isServer())
    setActiveTranslations(i18n)
}
