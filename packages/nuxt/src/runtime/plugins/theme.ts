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

function injectThemeCSS({
  mode,
  preset,
  config,
}: {
  mode: ThemeMode
  preset: ThemePreset
  config: MazUiNuxtThemeOptions
}): void {
  const cssOptions = {
    mode,
    darkSelectorStrategy: config.darkModeStrategy ?? 'class',
    prefix: 'maz',
  } satisfies CriticalCSSOptions

  const shouldInjectCriticalCSSOnServer = config.injectCriticalCSS && import.meta.server
  const criticalCSSAlreadyInjected = import.meta.client && document.getElementById(CSS_IDS.CRITICAL)
  const shouldInjectCriticalCSSOnClient = config.injectCriticalCSS && import.meta.client && !criticalCSSAlreadyInjected

  if (shouldInjectCriticalCSSOnServer || shouldInjectCriticalCSSOnClient) {
    const criticalCSS = generateCriticalCSS(preset, cssOptions)

    useHead({
      style: [{ innerHTML: criticalCSS, id: CSS_IDS.CRITICAL }],
    })
  }

  const shouldInjectFullCSSOnServer = config.injectAllCSSOnServer && import.meta.server
  const fullCSSAlreadyInjected = import.meta.client && document.getElementById(CSS_IDS.FULL)
  const shouldInjectFullCSSOnClient = config.injectFullCSS && import.meta.client && !fullCSSAlreadyInjected

  if (shouldInjectFullCSSOnServer || shouldInjectFullCSSOnClient) {
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

  const config = {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    colorMode: options.mode && options.mode !== 'both' ? options.mode : options.colorMode ?? 'auto',
    mode: 'both',
    injectAllCSSOnServer: false,
    injectCriticalCSS: true,
    injectFullCSS: true,
    overrides: {},
    ...options,
    preset,
  } satisfies Required<MazUiNuxtThemeOptions>

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

  injectThemeCSS({
    mode: config.mode,
    preset: config.preset,
    config,
  })

  MazUiTheme.install(vueApp, {

    colorMode,
    preset: config.preset,
    strategy: config.strategy,
    darkModeStrategy: config.darkModeStrategy,
    mode: config.mode,

    injectFullCSS: false,
    injectCriticalCSS: false,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
