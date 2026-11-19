import type { App, Plugin } from 'vue'
import type { MazUiTranslationsInstance, MazUiTranslationsOptions } from './types.ts'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { legacyStore } from './states.ts'
import { injectTranslations } from './utils/inject.ts'
import { createMazUiTranslations } from './utils/instance.ts'

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
