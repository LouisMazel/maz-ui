import type { ColorMode, CriticalCSSOptions, ThemeMode, ThemePreset, ThemeState } from '@maz-ui/themes'
import type { MazUiNuxtThemeOptions } from './../../types'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { CSS_IDS, generateCriticalCSS, generateFullCSS, getPreset, mergePresets } from '@maz-ui/themes/utils'
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

function injectThemeCSSOnServer({
  mode,
  preset,
  config,
}: {
  mode: ThemeMode
  preset: ThemePreset
  config: MazUiNuxtThemeOptions
}): void {
  const cssOptions: CriticalCSSOptions = {
    mode,
    darkSelectorStrategy: config.darkModeStrategy ?? 'class',
    prefix: 'maz',
  } satisfies CriticalCSSOptions

  const criticalCSS = generateCriticalCSS(preset, cssOptions)

  useHead({
    style: [
      {
        innerHTML: criticalCSS,
        id: CSS_IDS.CRITICAL,
      },
    ],
  })

  if (config.injectFullCSSOnServer) {
    const fullCSS = generateFullCSS(preset, cssOptions)

    useHead({
      style: [{ innerHTML: fullCSS, id: CSS_IDS.FULL }],
    })
  }
}

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const options = $config.public.mazUi.theme

  let preset = await getPreset(options?.preset)

  if (options?.overrides) {
    preset = mergePresets(preset, options.overrides)
  }

  const isClientSideRendering = import.meta.client && !document.getElementById(CSS_IDS.CRITICAL)

  const config = {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    colorMode: options.mode && options.mode !== 'both' ? options.mode : options.colorMode ?? 'auto',
    mode: 'both',
    injectFullCSSOnServer: false,
    injectCriticalCSS: true,
    injectFullCSS: true,
    ...options,
    preset,
  } satisfies MazUiNuxtThemeOptions

  const colorMode = config.mode !== 'both' ? config.mode : getServerInitialColorMode(config.colorMode)

  const isDark = colorMode === 'auto' && config.mode === 'both'
    ? getServerInitialColorMode(config.colorMode) === 'dark'
    : colorMode === 'dark' || config.mode === 'dark'

  if (isDark && config.darkModeStrategy === 'class') {
    useHead({
      htmlAttrs: {
        class: 'dark',
      },
    })
  }

  if (import.meta.server) {
    injectThemeCSSOnServer({
      mode: config.mode,
      preset: config.preset,
      config,
    })
  }

  MazUiTheme.install(vueApp, {
    ...config,
    colorMode,
    strategy: config.strategy,
    darkModeStrategy: config.darkModeStrategy,
    injectFullCSS: isClientSideRendering,
    injectCriticalCSS: isClientSideRendering,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
