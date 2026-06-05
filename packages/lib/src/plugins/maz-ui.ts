import type { MazUiThemeOptions } from '@maz-ui/themes/plugin'
import type { MazUiTranslationsOptions } from '@maz-ui/translations'
import type { Plugin } from 'vue'
import type { MazUiDefaultsOptions } from '../composables/useGlobalConfig'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { MazUiTranslations } from '@maz-ui/translations/plugin'
import { GLOBAL_CONFIG_INJECTION_KEY } from '../composables/useGlobalConfig'

export interface MazUiOptions {
  /**
   * The theme configurations
   * Can not be disabled
   */
  theme: MazUiThemeOptions
  /**
   * The translations configurations
   * Can not be disabled
   */
  translations?: MazUiTranslationsOptions
  /**
   * Global default prop values for components.
   *
   * Priority, per prop: instance prop > `defaults[Component]` > `defaults.global` > library default.
   * A global default never wins over a prop set on the component instance.
   */
  defaults?: MazUiDefaultsOptions
}

/**
 * @example
 * ```ts
 * import { MazUi } from 'maz-ui/plugins/maz-ui'
 * import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
 * import 'maz-ui/style.css'
 *
 * app.use(MazUi, {
 *   theme: {
 *     preset: mazUiPreset,
 *     strategy: 'runtime',
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
 *   defaults: {
 *     global: { roundedSize: 'lg' },
 *     MazBtn: { roundedSize: 'full' },
 *     MazCard: { bordered: false, elevation: true },
 *   },
 * })
 * ```
 */
export const MazUi: Plugin<[MazUiOptions]> = {
  install(app, options) {
    const { theme, translations, defaults } = options

    app.use(MazUiTheme, theme)
    app.use(MazUiTranslations, translations)

    if (defaults) {
      app.provide(GLOBAL_CONFIG_INJECTION_KEY, defaults)
      app.config.globalProperties.$mazGlobalConfig = defaults
    }
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Global component defaults provided by the MazUi plugin.
     */
    $mazGlobalConfig?: MazUiDefaultsOptions
  }
}
