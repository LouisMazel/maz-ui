import type { ColorMode, ThemeConfig } from '@maz-ui/themes'
import type { Plugin } from 'vue'
import {
  _initThemeState,
  generateCriticalCSS,
  generateFullCSS,
  injectCSS,
} from '@maz-ui/themes'

export interface MazThemePluginOptions extends ThemeConfig {
  prefix?: string
}

function applyDarkModeImmediately(darkMode: string, initialColorMode: ColorMode) {
  if (typeof document === 'undefined')
    return

  const isDarkMode = initialColorMode === 'dark'
    || (initialColorMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (darkMode !== 'class') {
    return
  }

  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

function getInitialColorMode(darkMode: string): ColorMode {
  // 1. Priorité: préférence sauvegardée de l'utilisateur
  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('maz-color-mode') as ColorMode | null
    if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
      return savedMode
    }
  }

  // 2. Fallback: configuration du plugin
  if (darkMode === 'auto') {
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
function injectThemeCSS(finalPreset: any, config: any) {
  if (typeof document === 'undefined')
    return

  const cssOptions = {
    mode: 'both' as const,
    darkSelector: config.darkMode === 'media' ? 'media' as const : 'class' as const,
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
 * import { MazUi } from 'maz-ui/src/plugins/index.ts'
 *
 * app.use(MazUi, {
 *   preset: defaultPreset,
 *   strategy: 'hybrid',
 *   darkMode: 'class',
 * })
 * ```
 */
export const MazUi: Plugin<MazThemePluginOptions> = {
  async install(app, options = {}) {
    const { mazUi } = await import('@maz-ui/themes/presets/mazUi')

    const config = {
      preset: mazUi,
      strategy: 'runtime' as const,
      darkMode: 'class' as const,
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

    const initialColorMode = getInitialColorMode(config.darkMode)
    const systemPrefersDark = typeof window !== 'undefined'
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialIsDark = initialColorMode === 'auto'
      ? systemPrefersDark
      : initialColorMode === 'dark'

    applyDarkModeImmediately(config.darkMode, initialColorMode)

    if (config.strategy === 'runtime' || config.strategy === 'hybrid') {
      injectThemeCSS(finalPreset, config)

      _initThemeState({
        currentPreset: finalPreset,
        colorMode: initialColorMode,
        isDark: initialIsDark,
        strategy: config.strategy,
      })
    }

    app.config.globalProperties.$mazTheme = {
      ...config,
      preset: finalPreset,
    }

    app.provide('mazTheme', config)
    app.config.globalProperties.$mazTheme = {
      ...config,
      preset: finalPreset,
    }
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Maz theme plugin options
     * @description You should install the plugin to use this property
     * @examl
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
    $mazTheme: MazThemePluginOptions
  }
}
