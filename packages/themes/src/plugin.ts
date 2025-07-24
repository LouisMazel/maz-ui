import type { App } from 'vue'
import type { DarkModeStrategy, ThemeConfig, ThemePreset, ThemeState } from './types'
import { reactive } from 'vue'
import { getPreset } from './utils'
import {
  CSS_IDS,
  generateCriticalCSS,
  generateFullCSS,
  injectCSS,
} from './utils/css-generator'
import { getColorMode, getSystemPrefersDark } from './utils/get-color-mode'

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
    mode: config.mode,
    darkSelector: config.darkModeStrategy,
  }

  if (config.injectCriticalCSS) {
    const criticalCSS = generateCriticalCSS(finalPreset, cssOptions)
    injectCSS(criticalCSS, CSS_IDS.CRITICAL)
  }

  if (!config.injectFullCSS) {
    return
  }

  const fullCSS = generateFullCSS(finalPreset, cssOptions)

  if (config.strategy === 'runtime') {
    injectCSS(fullCSS, CSS_IDS.FULL)
  }
  else if (config.strategy === 'hybrid') {
    requestIdleCallback(() => {
      injectCSS(fullCSS, CSS_IDS.FULL)
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
      strategy: 'runtime',
      darkModeStrategy: 'class',
      colorMode: options.mode !== 'both' ? options.mode : options.colorMode,
      injectCriticalCSS: true,
      injectFullCSS: true,
      mode: 'both',
      ...options,
    } satisfies MazUiThemeOptions

    const colorMode = config.mode !== 'both' ? config.mode : getColorMode(config.colorMode)

    const isDark = colorMode === 'auto' && config.mode === 'both'
      ? getSystemPrefersDark() === 'dark'
      : colorMode === 'dark' || config.mode === 'dark'

    const themeState = reactive<ThemeState>({
      // @ts-expect-error - empty currentPreset to avoid error
      currentPreset: {},
      mode: config.mode,
      colorMode,
      isDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    })

    applyDarkMode(config.darkModeStrategy, isDark)

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
