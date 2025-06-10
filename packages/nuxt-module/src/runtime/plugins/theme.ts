import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'
import { MazUiPlugin } from 'maz-ui/src/plugins/maz-ui.js'
import {
  generateFullCSS,
  mergePresets,
  type ColorMode,
  type CriticalCSSOptions,
  type ThemePreset,
  type ThemeState,
} from '@maz-ui/themes'
import type { MazUiPluginOptions } from 'maz-ui/src/plugins/maz-ui.js'
import { generateCriticalCSS } from '@maz-ui/themes/src/index.js'
import type { ThemePresetName } from '~/src/types'

function getServerInitialColorMode(): ColorMode {
  // 1. Priorité: cookie de préférence utilisateur
  const colorModeCookie = useCookie<ColorMode>('maz-color-mode', {
    // default: () => 'auto',
  })

  if (colorModeCookie.value && ['light', 'dark', 'auto'].includes(colorModeCookie.value)) {
    return colorModeCookie.value
  }

  // 2. Headers du navigateur (si disponibles)
  if (import.meta.server) {
    const headers = useRequestHeaders()

    // Client Hints pour le color scheme
    if (headers['sec-ch-prefers-color-scheme'] === 'dark') {
      return 'dark'
    }

    // User-Agent hints (moins fiable)
    const userAgent = headers['user-agent']?.toLowerCase()
    if (userAgent?.includes('dark')) {
      return 'dark'
    }
  }

  // 3. Fallback: configuration du module
  return 'auto'
}

function getServerIsDark(colorMode: ColorMode): boolean {
  if (colorMode === 'dark') return true
  if (colorMode === 'light') return false

  // Pour 'auto', on assume light côté serveur par défaut
  return false
}

async function getPreset(preset: ThemePresetName | ThemePreset | undefined) {
  if (typeof preset === 'object') {
    return preset
  }

  if (!preset) {
    const { mazUi } = await import('@maz-ui/themes/presets/mazUi')
    return mazUi
  }

  if (preset === 'mazUi') {
    const { mazUi } = await import('@maz-ui/themes/presets/mazUi')
    return mazUi
  }

  if (preset === 'ocean') {
    const { ocean } = await import('@maz-ui/themes/presets/ocean')
    return ocean
  }

  if (preset === 'pristine') {
    const { pristine } = await import('@maz-ui/themes/presets/pristine')
    return pristine
  }

  throw new TypeError(`[@maz-ui/nuxt] Preset ${preset} not found`)
}

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const themeConfig = $config.public.mazUi?.theme

  if (themeConfig === false) {
    return
  }

  let preset = await getPreset(themeConfig?.preset)

  if (themeConfig?.overrides) {
    preset = mergePresets(preset, themeConfig.overrides)
  }

  const config = {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    prefix: 'maz',
    injectCriticalCSS: false,
    injectFullCSS: true,
    ...themeConfig,
    preset,
  } satisfies MazUiPluginOptions

  if (import.meta.server) {
    const initialColorMode = getServerInitialColorMode()
    const serverIsDark = getServerIsDark(initialColorMode)
    const initialIsDark
      = initialColorMode === 'dark' || (initialColorMode === 'auto' && serverIsDark)

    const themeState = {
      currentPreset: config.preset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    } satisfies ThemeState

    const cssOptions: CriticalCSSOptions = {
      mode: 'both',
      darkSelector: config.darkModeStrategy === 'media' ? 'media' : 'class',
      prefix: config.prefix,
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

  MazUiPlugin.install(vueApp, {
    ...config,
    injectFullCSS: !config.injectFullCSSOnServer,
    injectCriticalCSS: false,
  })
})

declare module '#app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
