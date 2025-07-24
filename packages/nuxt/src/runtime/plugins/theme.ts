import type { ColorMode, CriticalCSSOptions, MazUiThemeOptions, ThemeState } from '@maz-ui/themes'
import { generateFullCSS, mergePresets } from '@maz-ui/themes'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { getPreset } from '@maz-ui/themes/utils'
import { generateCriticalCSS } from '@maz-ui/themes/utils/css-generator'
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'

function getServerInitialColorMode(colorMode: ColorMode): ColorMode {
  if (colorMode !== 'auto') {
    return colorMode
  }

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

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const options = $config.public.mazUi.theme

  let preset = await getPreset(options?.preset)

  if (options?.overrides) {
    preset = mergePresets(preset, options.overrides)
  }

  const config = {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    colorMode: options.mode && options.mode !== 'both' ? options.mode : options.colorMode ?? 'auto',
    mode: 'both',
    injectFullCSSOnServer: true,
    ...options,
    preset,
  } satisfies MazUiThemeOptions

  const colorMode = config.mode !== 'both' ? config.mode : getServerInitialColorMode(config.colorMode)

  const isDark = colorMode === 'auto' && config.mode === 'both'
    ? getServerInitialColorMode(config.colorMode) === 'dark'
    : colorMode === 'dark' || config.mode === 'dark'

  const themeState = {
    currentPreset: config.preset,
    colorMode,
    mode: config.mode,
    isDark,
    strategy: config.strategy,
    darkModeStrategy: config.darkModeStrategy,
  } satisfies ThemeState

  if (import.meta.server) {
    const cssOptions: CriticalCSSOptions = {
      mode: themeState.mode,
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

    if (isDark && config.darkModeStrategy === 'class') {
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

    injectFullCSS: config.spa ? true : !config.injectFullCSSOnServer,
    injectCriticalCSS: !!config.spa,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
