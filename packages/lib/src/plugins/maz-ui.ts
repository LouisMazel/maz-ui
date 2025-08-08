import type { MazUiThemeOptions } from '@maz-ui/themes/plugin'
import type { MazTranslationsOptions } from '@maz-ui/translations'
import type { Plugin } from 'vue'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { MazTranslations } from '@maz-ui/translations'

export interface MazUiOptions {
  /**
   * The theme configurations
   * Can not be disabled
   */
  theme?: MazUiThemeOptions
  /**
   * The translations configurations
   * Can not be disabled
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
export const MazUi: Plugin<[MazUiOptions?]> = {
  install(app, options = {}) {
    const { theme, translations } = options

    app.use(MazUiTheme, theme)
    app.use(MazTranslations, translations)
  },
}
