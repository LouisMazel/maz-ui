import type { DarkModeStrategy, ThemeConfig, ThemePreset, ThemeState } from './types'
import { type App, reactive } from 'vue'
import { getPreset } from './utils'
import {
  generateCriticalCSS,
  generateFullCSS,
  injectCSS,
} from './utils/css-generator'
import { getColorMode, getSystemPrefersDark } from './utils/get-color-mode'

export interface MazUiThemeOptions extends ThemeConfig {
  /**
   * CSS variables prefix
   * @description Prefix for CSS variables
   * @default 'maz'
   * @private
   */
  prefix?: string
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

function applyDarkMode(darkModeStrategy: DarkModeStrategy, isDark: boolean) {
  if (typeof document === 'undefined' || darkModeStrategy !== 'class')
    return

  if (isDark) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

function injectThemeCSS(finalPreset: ThemePreset, config: MazUiThemeOptions) {
  if (typeof document === 'undefined')
    return

  const cssOptions = {
    mode: 'both' as const,
    darkSelector: config.darkModeStrategy,
    prefix: config.prefix,
  }

  if (config.injectCriticalCSS) {
    const criticalCSS = generateCriticalCSS(finalPreset, cssOptions)
    injectCSS(criticalCSS, 'maz-theme-critical')
  }

  if (!config.injectFullCSS) {
    return
  }

  const fullCSS = generateFullCSS(finalPreset, cssOptions)

  if (config.strategy === 'runtime') {
    injectCSS(fullCSS, 'maz-theme-full')
  }
  else if (config.strategy === 'hybrid') {
    requestIdleCallback(() => {
      injectCSS(fullCSS, 'maz-theme-full')
    }, { timeout: 100 })
  }
}

function injectThemeState(app: App, themeState: ThemeState) {
  app.provide('mazThemeState', themeState)
  app.config.globalProperties.$mazThemeState = themeState
}

/**
 * @example
 * ```ts
 * import { MazUi } from 'maz-ui/plugins/maz-ui'
 *
 * app.use(MazUi, {
 *   preset: defaultPreset,
 *   strategy: 'hybrid',
 *   darkMode: 'class',
 * })
 * ```
 */
export const MazUiTheme = {
  async install(app: App, options: MazUiThemeOptions = {}) {
    const config = {
      preset: 'maz-ui',
      strategy: 'runtime' as const,
      darkModeStrategy: 'class' as const,
      colorMode: 'auto' as const,
      prefix: 'maz' as const,
      injectCriticalCSS: true,
      injectFullCSS: true,
      ...options,
    } satisfies MazUiThemeOptions

    const colorMode = getColorMode(config.colorMode)

    const isDark = colorMode === 'auto'
      ? getSystemPrefersDark() === 'dark'
      : colorMode === 'dark'

    const themeState = reactive<ThemeState>({
      // @ts-expect-error - empty currentPreset to avoid error
      currentPreset: {},
      colorMode,
      isDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    })

    applyDarkMode(config.darkModeStrategy, themeState.isDark)

    injectThemeState(app, themeState)

    const preset = await getPreset(config.preset)

    const finalPreset = config.overrides
      ? {
          ...preset,
          foundation: {
            ...preset.foundation,
            ...config.overrides.foundation,
          },
          colors: {
            light: { ...preset.colors.light, ...config.overrides.colors?.light },
            dark: { ...preset.colors.dark, ...config.overrides.colors?.dark },
          },
        }
      : preset

    themeState.currentPreset = finalPreset

    if (config.strategy === 'buildtime') {
      return
    }

    injectThemeCSS(finalPreset, config)
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Maz theme plugin options
     * @description You should install the plugin to use this property
     * @example
     * ```ts
     * import { MazUi } from 'maz-ui/plugins/maz-ui'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(MazUi)
     *
     * const { setColorMode, toggleDarkMode } = useMazTheme()
     * setColorMode('dark')
     * toggleDarkMode()
     */
    $mazThemeState: ThemeState
  }
}
