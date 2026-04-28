import type { ColorMode, CSSOptions, ThemePreset, ThemePresetName, ThemeState } from '@maz-ui/themes'
import type { Ref } from 'vue'
import type { MazUiNuxtThemeOptions } from './../../types'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { CSS_ID, generateCSS, getPreset, mergePresets } from '@maz-ui/themes/utils'
import { getSystemColorMode } from '@maz-ui/themes/utils/get-color-mode'
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'

function getSavedColorMode(): ColorMode | undefined {
  const colorModeCookie = useCookie<ColorMode>('maz-color-mode')
  if (colorModeCookie.value && ['light', 'dark', 'auto'].includes(colorModeCookie.value)) {
    return colorModeCookie.value
  }

  return undefined
}

function getSavedPresetName(): string | undefined {
  const presetCookie = useCookie<string | null>('maz-preset')
  return presetCookie.value || undefined
}

function clearSavedPresetName(): void {
  const presetCookie = useCookie<string | null>('maz-preset')
  presetCookie.value = null
}

function saveResolvedPresetName(name: string): void {
  const presetCookie = useCookie<string>('maz-preset', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })
  if (presetCookie.value !== name) {
    presetCookie.value = name
  }
}

function getSavedResolvedColorMode(): 'light' | 'dark' | undefined {
  const resolvedCookie = useCookie<'light' | 'dark'>('maz-resolved-color-mode')
  if (resolvedCookie.value && ['light', 'dark'].includes(resolvedCookie.value)) {
    return resolvedCookie.value
  }
  return undefined
}

function getInitialColorMode() {
  const resolvedColorMode = getSavedResolvedColorMode()
  if (resolvedColorMode) {
    return resolvedColorMode
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

function getColorModeBlockingScript(config: Required<MazUiNuxtThemeOptions>): string {
  const darkClass = config.darkClass
  const cookieMaxAge = 60 * 60 * 24 * 365

  return `(function(){try{var d=document.documentElement,m='${config.mode}',dc='${darkClass}';if(m==='light')return;var c=(document.cookie.match(/maz-color-mode=([^;]+)/)||[])[1];if(c==='light')return;if(c==='dark'||m==='dark'){d.classList.add(dc);return}var r=(document.cookie.match(/maz-resolved-color-mode=([^;]+)/)||[])[1];if(r==='light')return;if(r==='dark'){d.classList.add(dc);return}if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){d.classList.add(dc);document.cookie='maz-resolved-color-mode=dark;path=/;max-age=${cookieMaxAge};SameSite=Lax'}else{document.cookie='maz-resolved-color-mode=light;path=/;max-age=${cookieMaxAge};SameSite=Lax'}}catch(e){}})()`
}

function injectThemeCSS(config: Required<MazUiNuxtThemeOptions>) {
  const cssOptions = {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    prefix: 'maz',
    darkClass: config.darkClass,
  } satisfies CSSOptions

  if (config.injectCriticalCSS && !config.injectAllCSSOnServer) {
    const criticalCSS = generateCSS(config.preset, {
      ...cssOptions,
      onlyCritical: true,
    })

    useHead({
      style: [{ innerHTML: criticalCSS, id: CSS_ID }],
    })
  }

  if (config.injectAllCSSOnServer) {
    const fullCSS = generateCSS(config.preset, cssOptions)

    useHead({
      style: [{ innerHTML: fullCSS, id: CSS_ID }],
    })
  }
}

/* eslint-disable sonarjs/no-commented-code */
// function getInjectCSSStates(config: Required<MazUiNuxtThemeOptions>) {
//   const isCSSAlreadyInjected = import.meta.client && !!document.getElementById(CSS_ID)

//   return {
//     shouldInjectCSSOnClient: config.injectAllCSSOnServer === false && !isCSSAlreadyInjected,
//   }
// }
/* eslint-enable sonarjs/no-commented-code */

async function resolvePreset(options: { preset?: ThemePreset | ThemePresetName } | undefined, persistPreset: boolean) {
  // Custom preset object passed explicitly by the consumer always wins —
  // it's app-controlled, never user-controlled. The cookie only beats a
  // string preset name (which is treated as the default to load).
  if (options?.preset && typeof options.preset !== 'string') {
    return getPreset(options.preset)
  }

  const savedName = persistPreset ? getSavedPresetName() : undefined
  const presetToResolve = (savedName ?? options?.preset) as ThemePresetName | undefined

  try {
    return await getPreset(presetToResolve)
  }
  catch (error) {
    if (!savedName) {
      throw error
    }
    clearSavedPresetName()
    return getPreset(options?.preset)
  }
}

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const options = $config.public.mazUi.theme
  const persistPreset = options?.persistPreset !== false

  let preset = await resolvePreset(options, persistPreset)

  if (options?.overrides) {
    preset = mergePresets(preset, options.overrides)
  }

  if (persistPreset) {
    saveResolvedPresetName(preset.name)
  }

  const config = {
    strategy: 'hybrid',
    darkClass: 'dark',
    darkModeStrategy: 'class',
    mode: 'both',
    injectAllCSSOnServer: false,
    injectCriticalCSS: true,
    injectFullCSS: true,
    overrides: {},
    persistPreset: true,
    ...options,
    colorMode: getSavedColorMode() ?? options?.colorMode ?? 'auto',
    preset,
  } satisfies Required<MazUiNuxtThemeOptions>

  const isDark = config.colorMode === 'auto' && config.mode === 'both'
    ? getInitialColorMode() === 'dark'
    : config.colorMode === 'dark' || config.mode === 'dark'

  if (isDark && config.darkModeStrategy === 'class') {
    useHead({
      htmlAttrs: {
        class: config.darkClass,
      },
    })
  }

  if (import.meta.server) {
    injectThemeCSS(config)

    if (config.colorMode === 'auto' && config.mode === 'both' && config.darkModeStrategy === 'class') {
      useHead({
        script: [{ innerHTML: getColorModeBlockingScript(config), tagPosition: 'head', id: 'maz-color-mode-blocking' }],
        meta: [{ 'http-equiv': 'Accept-CH', 'content': 'Sec-CH-Prefers-Color-Scheme', 'id': 'maz-color-http-accept-ch' }],
      })
    }
  }

  // const { shouldInjectCSSOnClient } = getInjectCSSStates(config)

  MazUiTheme.install?.(vueApp, {
    ...config,
    colorMode: getSavedColorMode() ?? config.colorMode,
    // @ts-expect-error _isDark is a private property
    _isDark: isDark,
    // injectFullCSS: !config.injectAllCSSOnServer || shouldInjectCSSOnClient,
    // injectCriticalCSS: shouldInjectCSSOnClient,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: Ref<ThemeState>
  }
}
