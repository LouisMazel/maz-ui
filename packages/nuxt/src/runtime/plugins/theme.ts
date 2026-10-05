import type { ColorMode, CSSOptions, MazUiThemeOptions, ThemePreset, ThemePresetName, ThemeState } from '@maz-ui/themes'
import type { Ref } from 'vue'
import { MazUiTheme } from '@maz-ui/themes/plugin'
import { CSS_ID, generateCSS, getPreset, mergePresets, resolveColorSchemeContent } from '@maz-ui/themes/utils'
import { getSystemColorMode } from '@maz-ui/themes/utils/get-color-mode'
import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'

function getSavedColorMode(): ColorMode | undefined {
  const colorModeCookie = useCookie<ColorMode>('maz-color-mode')
  if (colorModeCookie.value && ['light', 'dark', 'auto'].includes(colorModeCookie.value)) {
    return colorModeCookie.value
  }

  return undefined
}

function getSavedResolvedColorMode(): 'light' | 'dark' | undefined {
  const resolvedCookie = useCookie<'light' | 'dark'>('maz-resolved-color-mode')
  if (resolvedCookie.value && ['light', 'dark'].includes(resolvedCookie.value)) {
    return resolvedCookie.value
  }
  return undefined
}

function getInitialColorMode() {
  // Server: the resolved cookie is only an SSR seed (written client-side on a
  // prior visit) to avoid FOUC, then client hints, else neutral.
  if (import.meta.server) {
    const resolvedColorMode = getSavedResolvedColorMode()
    if (resolvedColorMode) {
      return resolvedColorMode
    }

    const headers = useRequestHeaders()

    if (headers['sec-ch-prefers-color-scheme'] === 'dark') {
      return 'dark'
    }

    const userAgent = headers['user-agent']?.toLowerCase()
    if (userAgent?.includes('dark')) {
      return 'dark'
    }

    return 'auto'
  }

  // Client: always read the live system preference so `auto` keeps following
  // OS changes across reloads instead of freezing on a stale resolved cookie.
  return getSystemColorMode()
}

function getColorModeBlockingScript(config: Required<MazUiThemeOptions>): string {
  const darkClass = config.darkClass
  const cookieMaxAge = 60 * 60 * 24 * 365

  return `(function(){try{var d=document.documentElement,m='${config.mode}',dc='${darkClass}';if(m==='light')return;var c=(document.cookie.match(/maz-color-mode=([^;]+)/)||[])[1];if(c==='light')return;if(c==='dark'||m==='dark'){d.classList.add(dc);return}var r=(document.cookie.match(/maz-resolved-color-mode=([^;]+)/)||[])[1];if(r==='light')return;if(r==='dark'){d.classList.add(dc);return}if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches){d.classList.add(dc);document.cookie='maz-resolved-color-mode=dark;path=/;max-age=${cookieMaxAge};SameSite=Lax'}else{document.cookie='maz-resolved-color-mode=light;path=/;max-age=${cookieMaxAge};SameSite=Lax'}}catch(e){}})()`
}

function injectThemeCSS(config: Required<MazUiThemeOptions>) {
  if (config.strategy === 'buildtime')
    return

  const css = generateCSS(config.preset, {
    mode: config.mode,
    darkSelectorStrategy: config.darkModeStrategy,
    prefix: 'maz',
    darkClass: config.darkClass,
    lightClass: config.lightClass,
  } satisfies CSSOptions)

  useHead({
    style: [{
      innerHTML: css,
      id: CSS_ID,
    }],
  })
}

/**
 * Parse a `maz-preset` cookie value. Format is `"<base>:<active>"`; a legacy
 * plain-name value (no `:`) is treated as unscoped and returns `null` so it
 * cannot override the configured preset.
 */
function parseSavedPreset(raw: string | null | undefined): { base: string, active: string } | null {
  if (!raw) {
    return null
  }

  const separatorIndex = raw.indexOf(':')
  if (separatorIndex === -1) {
    return null
  }

  const base = raw.slice(0, separatorIndex)
  const active = raw.slice(separatorIndex + 1)
  return base && active ? { base, active } : null
}

async function resolvePreset(
  options: { preset?: ThemePreset | ThemePresetName } | undefined,
  persistPreset: boolean,
): Promise<{ preset: ThemePreset, baseName: string }> {
  const presetObject = options?.preset && typeof options.preset !== 'string' ? options.preset : undefined

  // The configured preset IS the app identity (the "base").
  const basePreset = presetObject ?? await getPreset(options?.preset)
  const baseName = basePreset.name

  if (!persistPreset) {
    return { preset: basePreset, baseName }
  }

  const presetCookie = useCookie<string | null>('maz-preset')
  const saved = parseSavedPreset(presetCookie.value)

  // Honor a persisted runtime switch only when it belongs to THIS app's
  // configured preset; a foreign/stale cookie never wins over the config.
  if (saved && saved.base === baseName && saved.active !== baseName) {
    try {
      return { preset: await getPreset(saved.active as ThemePresetName), baseName }
    }
    catch {
      // Stale active name → fall back to the configured base (cookie healed on write).
    }
  }

  return { preset: basePreset, baseName }
}

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const options = $config.public.mazUi.theme
  const persistPreset = options?.persistPreset !== false

  const resolved = await resolvePreset(options, persistPreset)
  let preset = resolved.preset

  if (options?.overrides) {
    preset = mergePresets(preset, options.overrides)
  }

  if (persistPreset) {
    const presetCookie = useCookie<string>('maz-preset', {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
    const value = `${resolved.baseName}:${preset.name}`
    if (presetCookie.value !== value) {
      presetCookie.value = value
    }
  }

  const config = {
    strategy: 'runtime',
    darkClass: 'dark',
    lightClass: 'light',
    darkModeStrategy: 'class',
    mode: 'both',
    overrides: {},
    persistPreset: true,
    ...options,
    colorMode: getSavedColorMode() ?? options?.colorMode ?? 'auto',
    preset,
  } satisfies Required<MazUiThemeOptions>

  const isDark = config.colorMode === 'auto' && config.mode === 'both'
    ? getInitialColorMode() === 'dark'
    : config.colorMode === 'dark' || config.mode === 'dark'

  if (import.meta.server) {
    if (isDark && config.darkModeStrategy === 'class') {
      useHead({
        htmlAttrs: {
          class: config.darkClass,
        },
      })
    }

    injectThemeCSS(config)

    useHead({
      meta: [{
        name: 'color-scheme',
        content: resolveColorSchemeContent(config.mode, config.colorMode),
        id: 'maz-color-scheme',
      }],
    })

    if (config.colorMode === 'auto' && config.mode === 'both' && config.darkModeStrategy === 'class') {
      useHead({
        script: [{ innerHTML: getColorModeBlockingScript(config), tagPosition: 'head', id: 'maz-color-mode-blocking' }],
        meta: [{ 'http-equiv': 'Accept-CH', 'content': 'Sec-CH-Prefers-Color-Scheme', 'id': 'maz-color-http-accept-ch' }],
      })
    }
  }

  MazUiTheme.install?.(vueApp, {
    ...config,
    colorMode: getSavedColorMode() ?? config.colorMode,
    // @ts-expect-error _isDark is a private property
    _isDark: isDark,
  })
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazThemeState: Ref<ThemeState>
  }
}
