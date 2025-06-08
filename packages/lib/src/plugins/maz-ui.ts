import type { ColorMode, ThemeConfig } from '@maz-ui/themes'
import type { Plugin } from 'vue'
import {
  _initThemeState,
  generateCriticalThemeCSS,
  generateThemeCSS,
  injectCSS,
  mazUi,
} from '@maz-ui/themes'

export interface MazThemePluginOptions extends ThemeConfig {
  prefix?: string
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
  install(app, options = {}) {
    const {
      preset = mazUi,
      strategy = 'runtime',
      darkMode = 'class',
      prefix = 'maz',
      overrides,
    } = options

    let finalPreset = preset

    if (overrides) {
      finalPreset = {
        ...preset,
        appearance: {
          ...preset.appearance,
          ...overrides.appearance,
        },
        colors: {
          light: { ...preset.colors.light, ...overrides.colors?.light },
          dark: { ...preset.colors.dark, ...overrides.colors?.dark },
        },
      }
    }

    const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

    let initialColorMode: ColorMode
    if (darkMode === 'auto') {
      initialColorMode = 'auto'
    }
    else {
      initialColorMode = systemPrefersDark ? 'dark' : 'light'
    }

    const initialIsDark = initialColorMode === 'auto' ? systemPrefersDark : initialColorMode === 'dark'

    _initThemeState({
      currentPreset: finalPreset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy,
    })

    if (strategy === 'runtime' || strategy === 'hybrid') {
      if (typeof document !== 'undefined') {
        const criticalCSS = generateCriticalThemeCSS(finalPreset, { darkMode, prefix })
        const fullCSS = generateThemeCSS(finalPreset, { darkMode, prefix })

        injectCSS(criticalCSS, 'maz-theme-critical')

        if (strategy === 'runtime') {
          injectCSS(fullCSS, 'maz-theme-full')
        }
        else if (strategy === 'hybrid') {
          requestIdleCallback(() => {
            injectCSS(fullCSS, 'maz-theme-full')
          }, { timeout: 100 })
        }
      }
    }

    app.config.globalProperties.$mazTheme = {
      preset: finalPreset,
      strategy,
      darkMode,
    }
  },
}
