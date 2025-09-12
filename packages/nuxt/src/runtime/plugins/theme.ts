import type { ColorMode, CriticalCSSOptions, ThemeState } from '@maz-ui/themes'
import type { Ref } from 'vue'
import type { MazUiNuxtThemeOptions } from './../../types'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { CSS_IDS, generateCriticalCSS, generateFullCSS, getPreset, mergePresets } from '@maz-ui/themes/utils'
import { getSystemColorMode } from '@maz-ui/themes/utils/get-color-mode'
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'

function getSavedColorMode(): ColorMode | undefined {
  const colorModeCookie = useCookie<ColorMode>('maz-color-mode')
  if (colorModeCookie.value && ['light', 'dark', 'auto'].includes(colorModeCookie.value)) {
    return colorModeCookie.value
  }

  return undefined
}

function getInitialColorMode(colorMode: ColorMode) {
  if (colorMode && ['light', 'dark'].includes(colorMode)) {
    return colorMode
  }

  const savedColorMode = getSavedColorMode()
  if (savedColorMode && ['light', 'dark'].includes(savedColorMode)) {
    return savedColorMode
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
  else {
    const systemColorMode = getSystemColorMode()
    if (systemColorMode === 'dark') {
      return 'dark'
    }
  }

  return 'auto'
}

function injectThemeCSS(config: Required<MazUiNuxtThemeOptions>) {
  const cssOptions = {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy ?? 'class',
    prefix: 'maz',
    darkClass: config.darkClass ?? 'dark',
  } satisfies CriticalCSSOptions

  if (config.injectCriticalCSS) {
    const criticalCSS = generateCriticalCSS(config.preset, cssOptions)

    useHead({
      style: [{ innerHTML: criticalCSS, id: CSS_IDS.CRITICAL }],
    })
  }

  if (config.injectAllCSSOnServer) {
    const fullCSS = generateFullCSS(config.preset, cssOptions)

    useHead({
      style: [{ innerHTML: fullCSS, id: CSS_IDS.FULL }],
    })
  }
}

function getInjectCSSStates(config: MazUiNuxtThemeOptions) {
  const criticalCSSAlreadyInjected = import.meta.client && !!document.getElementById(CSS_IDS.CRITICAL)
  const shouldInjectCriticalCSSOnClient = !!config.injectCriticalCSS && import.meta.client && !criticalCSSAlreadyInjected

  const fullCSSAlreadyInjected = import.meta.client && !!document.getElementById(CSS_IDS.FULL)
  const shouldInjectFullCSSOnClient = !!config.injectFullCSS && import.meta.client && !fullCSSAlreadyInjected

  return {
    shouldInjectCriticalCSSOnClient,
    shouldInjectFullCSSOnClient,
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
    darkClass: 'dark',
    darkModeStrategy: 'class',
    colorMode: getSavedColorMode() ?? options.colorMode ?? 'auto',
    mode: 'both',
    injectAllCSSOnServer: false,
    injectCriticalCSS: true,
    injectFullCSS: true,
    overrides: {},
    ...options,
    preset,
  } satisfies Required<MazUiNuxtThemeOptions>

  const isDark = config.colorMode === 'auto' && config.mode === 'both'
    ? getInitialColorMode(config.colorMode) === 'dark'
    : config.colorMode === 'dark' || config.mode === 'dark'

  if (isDark && config.darkModeStrategy === 'class') {
    useHead({
      htmlAttrs: {
        class: config.darkClass,
      },
    })
  }

  const { shouldInjectCriticalCSSOnClient, shouldInjectFullCSSOnClient } = getInjectCSSStates(config)

  if (import.meta.server) {
    injectThemeCSS(config)
  }

  MazUiTheme.install?.(vueApp, {
    ...config,
    colorMode: getSavedColorMode() ?? config.colorMode,
    // @ts-expect-error _isDark is a private property
    _isDark: isDark,
    injectFullCSS: shouldInjectFullCSSOnClient,
    injectCriticalCSS: shouldInjectCriticalCSSOnClient,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: Ref<ThemeState>
  }
}
