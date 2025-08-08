import type { App, Plugin } from 'vue'
import type { MazUiTranslationsInstance, MazUiTranslationsOptions } from './types'
import { createMazUiTranslations } from './core'

export const MazUiTranslations = {
  install(app: App, options: MazUiTranslationsOptions = {}) {
    const i18n = createMazUiTranslations(options)

    // Injection globale
    app.config.globalProperties.$mazTranslations = i18n
    app.provide('mazTranslations', i18n)

    return i18n
  },
} satisfies Plugin<[MazUiTranslationsOptions?]>

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Maz translations instance
     */
    $mazTranslations: MazUiTranslationsInstance
  }
}
