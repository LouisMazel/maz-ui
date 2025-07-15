import type { App, Plugin } from 'vue'
import type { MazTranslationsInstance, MazTranslationsOptions } from './types'
import { createMazTranslations } from './core'

export const MazTranslations = {
  install(app: App, options: MazTranslationsOptions = {}) {
    const i18n = createMazTranslations(options)

    // Injection globale
    app.config.globalProperties.$mazTranslations = i18n
    app.provide('mazTranslations', i18n)

    return i18n
  },
} satisfies Plugin<[MazTranslationsOptions?]>

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Maz translations instance
     */
    $mazTranslations: MazTranslationsInstance
  }
}
