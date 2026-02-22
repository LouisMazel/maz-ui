import type { Plugin } from 'vue'
import type { MazUiTranslationsInstance, MazUiTranslationsOptions } from './types'
import { injectTranslations } from './utils/inject'
import { createMazUiTranslations } from './utils/instance'

export const MazUiTranslations: Plugin<[MazUiTranslationsOptions?]> = {
  install(app, options: MazUiTranslationsOptions = {}) {
    const i18n = createMazUiTranslations(options)

    // Injection globale
    injectTranslations({ app, i18n })

    return i18n
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Maz translations instance
     */
    $mazTranslations: MazUiTranslationsInstance
  }
}
