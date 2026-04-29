import type { App, Plugin, Ref } from 'vue'
import type { ThemeConfig, ThemeState } from './types'
import { injectThemeState } from './utils'
import { setupTheme } from './utils/setup-theme'

export type MazUiThemeOptions = Omit<ThemeConfig, 'prefix'>

/**
 * @example
 * ```ts
 * import { MazUiTheme } from '@maz-ui/themes/plugin'
 * import { mazUi } from '@maz-ui/themes/presets/mazUi'
 *
 * app.use(MazUiTheme, {
 *   preset: mazUi,
 *   strategy: 'runtime',
 *   darkMode: 'class',
 * })
 * ```
 */
export const MazUiTheme: Plugin<[MazUiThemeOptions]> = {
  install(app: App, options) {
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
     * app.use(MazUiTheme, { preset: mazUi })
     *
     * const { setColorMode, toggleDarkMode } = useTheme()
     * setColorMode('dark')
     * toggleDarkMode()
     */
    $mazThemeState: Ref<ThemeState>
  }
}
