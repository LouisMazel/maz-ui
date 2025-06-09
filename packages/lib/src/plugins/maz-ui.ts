import type { BaseThemePreset, ColorMode, DarkMode, ThemeConfig, ThemeState } from '@maz-ui/themes'
import type { App, InjectionKey } from 'vue'
import {
  generateCriticalCSS,
  generateFullCSS,
  injectCSS,
} from '@maz-ui/themes/utils'

export const mazThemeInjectionKey: InjectionKey<ThemeState> = Symbol('mazTheme')

export interface MazThemePluginOptions extends ThemeConfig {
  prefix?: string
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

/**
 * Injecte le CSS selon la stratégie
 */
function injectThemeCSS(finalPreset: BaseThemePreset, config: MazThemePluginOptions) {
  if (typeof document === 'undefined')
    return

  const cssOptions = {
    mode: 'both' as const,
    darkSelector: config.darkModeStrategy === 'media' ? 'media' as const : 'class' as const,
    prefix: config.prefix,
  }

  const criticalCSS = generateCriticalCSS(finalPreset, cssOptions)
  injectCSS(criticalCSS, 'maz-theme-critical')

  const fullCSS = generateFullCSS(finalPreset, cssOptions)

  if (config.strategy === 'runtime') {
    injectCSS(fullCSS, 'maz-theme-full')
  }
  else {
    requestIdleCallback(() => {
      injectCSS(fullCSS, 'maz-theme-full')
    }, { timeout: 100 })
  }
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
  async install(app: App, options: MazThemePluginOptions = {}) {
    const { mazUi } = await import('@maz-ui/themes/presets/mazUi')

    const config = {
      preset: mazUi,
      strategy: 'runtime' as const,
      darkModeStrategy: 'class' as const,
      prefix: 'maz' as const,
      overrides: undefined,
      ...options,
    }

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

    applyDarkMode(config.darkModeStrategy, initialColorMode)

    if (config.strategy === 'runtime' || config.strategy === 'hybrid') {
      injectThemeCSS(finalPreset, config)
    }

    app.provide(mazThemeInjectionKey, {
      currentPreset: finalPreset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    })

    app.config.globalProperties.$mazTheme = {
      currentPreset: finalPreset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    }
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
    $mazTheme: ThemeState
  }
}
