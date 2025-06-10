import type { ColorMode, DarkMode, ThemeConfig, ThemePreset, ThemeState } from '@maz-ui/themes/src/types/index.ts'
import type { App } from 'vue'
import { mazUi } from '@maz-ui/themes/src/presets/mazUi.ts'
import {
  generateCriticalCSS,
  generateFullCSS,
  injectCSS,
} from '@maz-ui/themes/src/utils/css-generator.ts'

export interface MazUiPluginOptions extends ThemeConfig {
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

function applyDarkMode(darkModeStrategy: DarkMode, initialColorMode: ColorMode) {
  if (typeof document === 'undefined')
    return

  const isDarkMode = initialColorMode === 'dark'
    || (initialColorMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (darkModeStrategy !== 'class') {
    return
  }

  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

function getInitialColorMode(darkModeStrategy: DarkMode): ColorMode {
  // 1. Priorité: préférence sauvegardée de l'utilisateur
  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('maz-color-mode') as ColorMode | null
    if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
      return savedMode
    }
  }

  // 2. Fallback: configuration du plugin
  if (darkModeStrategy === 'auto') {
    return 'auto'
  }

  // 3. Fallback final: préférences système
  const systemPrefersDark = typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches

  return systemPrefersDark ? 'dark' : 'light'
}

function injectThemeCSS(finalPreset: ThemePreset, config: MazUiPluginOptions) {
  if (typeof document === 'undefined')
    return

  const cssOptions = {
    mode: 'both' as const,
    darkSelector: config.darkModeStrategy === 'media' ? 'media' as const : 'class' as const,
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
export const MazUiPlugin = {
  install(app: App, options: MazUiPluginOptions = {}) {
    const config = {
      preset: mazUi,
      strategy: 'runtime' as const,
      darkModeStrategy: 'class' as const,
      prefix: 'maz' as const,
      injectCriticalCSS: true,
      injectFullCSS: true,
      ...options,
    } satisfies MazUiPluginOptions

    const finalPreset = config.overrides
      ? {
          ...config.preset,
          appearance: {
            ...config.preset.appearance,
            ...config.overrides.appearance,
          },
          colors: {
            light: { ...config.preset.colors.light, ...config.overrides.colors?.light },
            dark: { ...config.preset.colors.dark, ...config.overrides.colors?.dark },
          },
        }
      : config.preset

    const initialColorMode = getInitialColorMode(config.darkModeStrategy)
    const systemPrefersDark = typeof window !== 'undefined'
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialIsDark = initialColorMode === 'auto'
      ? systemPrefersDark
      : initialColorMode === 'dark'

    const themeState = {
      currentPreset: finalPreset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    }

    injectThemeState(app, themeState)

    applyDarkMode(config.darkModeStrategy, initialColorMode)

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
