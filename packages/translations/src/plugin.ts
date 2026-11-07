import type { App, Plugin } from 'vue'
import type { MazUiTranslationsInstance, MazUiTranslationsOptions } from './types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { legacyStore } from './states'
import { injectTranslations } from './utils/inject'
import { createMazUiTranslations } from './utils/instance'

export const MazUiTranslations: Plugin<[MazUiTranslationsOptions?]> = {
  install(app: App, options: MazUiTranslationsOptions = {}) {
    // In the browser, the plugin keeps the state of the deprecated `locale` and `globalState` exports.
    // On the server, every request gets its own state.
    const i18n = createMazUiTranslations(options, {
      store: isServer()
        ? undefined
        : legacyStore,
    })

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
