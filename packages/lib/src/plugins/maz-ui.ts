import type { Plugin } from 'vue'
import { MazUiTheme, type MazUiThemeOptions } from '@maz-ui/themes/src/plugin.js'
import { MazTranslations, type MazTranslationsOptions } from '@maz-ui/translations/src/index.js'

export interface MazUiOptions {
  /**
   * The theme configurations
   */
  theme?: MazUiThemeOptions
  /**
   * The translations configurations
   */
  translations?: MazTranslationsOptions
}

/**
 * @example
 * ```ts
 * import { MazUi } from 'maz-ui/plugins/maz-ui'
 * import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
 * import 'maz-ui/styles'
 *
 * app.use(MazUi, {
 *   theme: {
 *     preset: mazUiPreset,
 *     strategy: 'hybrid',
 *     darkMode: 'class',
 *   },
 *   translations: {
 *     locale: 'en',
 *     translations: {
 *       en: {
 *         ...
 *       },
 *       fr: {
 *         ...
 *       },
 *     },
 *   },
 * })
 * ```
 */
export const MazUi = {
  install(app, options: MazUiOptions = {}) {
    const { theme, translations } = options

    app.use(MazUiTheme, theme)
    app.use(MazTranslations, translations)
  },
} satisfies Plugin<MazUiOptions>
