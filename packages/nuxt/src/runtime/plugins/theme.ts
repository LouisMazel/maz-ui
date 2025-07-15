import {
  type ColorMode,
  type CriticalCSSOptions,
  generateFullCSS,
  type MazUiThemeOptions,
  mergePresets,
  type ThemeState,
} from '@maz-ui/themes'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { getPreset } from '@maz-ui/themes/utils'
import { generateCriticalCSS } from '@maz-ui/themes/utils/css-generator'
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'

function getServerInitialColorMode(): ColorMode {
  const colorModeCookie = useCookie<ColorMode>('maz-color-mode')

  if (colorModeCookie.value && ['light', 'dark', 'auto'].includes(colorModeCookie.value)) {
    return colorModeCookie.value
  }

  if (import.meta.server) {
    const headers = useRequestHeaders()

    if (headers['sec-ch-prefers-color-scheme'] === 'dark') {
      return 'dark'
    }

    const userAgent = headers['user-agent']?.toLowerCase()
    if (userAgent?.includes('dark')) {
      return 'dark'
    }
  }

  return 'auto'
}

function getServerIsDark(colorMode: ColorMode): boolean {
  return colorMode === 'dark'
}

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const themeConfig = $config.public.mazUi?.theme

  let preset = await getPreset(themeConfig?.preset)

  if (themeConfig?.overrides) {
    preset = mergePresets(preset, themeConfig.overrides)
  }

  const config = {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    colorMode: 'auto',
    injectFullCSSOnServer: true,
    ...themeConfig,
    preset,
  } satisfies MazUiThemeOptions

  const initialColorMode
    = config.colorMode === 'auto' ? getServerInitialColorMode() : (config.colorMode ?? 'auto')
  const serverIsDark = getServerIsDark(initialColorMode)
  const initialIsDark = initialColorMode === 'dark' || (initialColorMode === 'auto' && serverIsDark)

  const themeState = {
    currentPreset: config.preset,
    colorMode: initialColorMode,
    isDark: initialIsDark,
    strategy: config.strategy,
    darkModeStrategy: config.darkModeStrategy,
  } satisfies ThemeState

  if (import.meta.server) {
    const cssOptions: CriticalCSSOptions = {
      mode: config.colorMode === 'auto' ? 'both' : config.colorMode,
      darkSelectorStrategy: config.darkModeStrategy ?? 'class',
      prefix: 'maz',
    } satisfies CriticalCSSOptions

    const criticalCSS = generateCriticalCSS(themeState.currentPreset, cssOptions)

    useHead({
      style: [
        {
          innerHTML: criticalCSS,
          id: 'maz-theme-critical',
        },
      ],
    })

    if (config.injectFullCSSOnServer) {
      const fullCSS = generateFullCSS(themeState.currentPreset, cssOptions)

      useHead({
        style: [{ innerHTML: fullCSS, id: 'maz-theme-full' }],
      })
    }

    if (initialIsDark && config.darkModeStrategy === 'class') {
      useHead({
        htmlAttrs: {
          class: 'dark',
        },
      })
    }
  }

  MazUiTheme.install(vueApp, {
    ...config,

    preset: themeState.currentPreset,
    colorMode: themeState.colorMode,
    strategy: themeState.strategy,
    darkModeStrategy: themeState.darkModeStrategy,

    injectFullCSS: !config.injectFullCSSOnServer,
    injectCriticalCSS: false,
  })
})

declare module '#app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
