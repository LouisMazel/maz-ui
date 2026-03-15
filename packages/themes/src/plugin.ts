import type { Plugin, Ref } from 'vue'
import type { ThemeConfig, ThemeState } from './types'
import { injectThemeState } from './utils'
import { setupTheme } from './utils/setup-theme'

export interface MazUiThemeOptions extends Omit<ThemeConfig, 'prefix'> {
  /**
   * Inject critical CSS
   * @description Inject critical CSS to prevent FOUC
   * @default true
   * @private
   */
  injectCriticalCSS?: boolean

  /**
   * Inject full CSS
   * @description Inject full CSS to ensure all styles are loaded
   * @default true
   * @private
   */
  injectFullCSS?: boolean
}

/**
 * @example
 * ```ts
 * import { MazUiTheme } from '@maz-ui/themes/plugin'
 * import { mazUi } from '@maz-ui/themes/presets/mazUi'
 *
 * app.use(MazUiTheme, {
 *   preset: mazUi,
 *   strategy: 'hybrid',
 *   darkMode: 'class',
 * })
 * ```
 */
export const MazUiTheme: Plugin<[MazUiThemeOptions]> = {
  install(app, options) {
    const { themeState } = setupTheme(options)
    injectThemeState({ app, themeState })
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Maz theme plugin options
     * @description You should install the plugin to use this property
     * @example
     * ```ts
     * import { MazUiTheme } from '@maz-ui/themes/plugin'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(MazUiTheme, {
     *   preset: mazUi,
     *   strategy: 'hybrid',
     *   darkMode: 'class',
     * })
     *
     * const { setColorMode, toggleDarkMode } = useTheme()
     * setColorMode('dark')
     * toggleDarkMode()
     */
    $mazThemeState: Ref<ThemeState>
  }
}
