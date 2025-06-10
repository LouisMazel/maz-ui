import { defineNuxtPlugin, useCookie, useHead, useRequestHeaders } from 'nuxt/app'
import { MazUiPlugin } from 'maz-ui/src/plugins/maz-ui.js'
import type { ColorMode, CriticalCSSOptions, ThemeState } from '@maz-ui/themes'
import type { MazThemePluginOptions } from 'maz-ui/plugins'
import { generateCriticalCSS } from '@maz-ui/themes/src/index.js'

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

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const themeConfig = $config.public.mazUi?.theme

  if (themeConfig === false) {
    return
  }

  const { mazUi } = await import('@maz-ui/themes/presets/mazUi')

  const config: Required<Omit<MazThemePluginOptions, 'overrides'>> = {
    preset: mazUi,
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    prefix: 'maz',
    ...themeConfig,
  }

  if (import.meta.server) {
    const initialColorMode = getServerInitialColorMode()
    const serverIsDark = getServerIsDark(initialColorMode)
    const initialIsDark
      = initialColorMode === 'dark' || (initialColorMode === 'auto' && serverIsDark)

    const themeState: ThemeState = {
      currentPreset: config.preset,
      colorMode: initialColorMode,
      isDark: initialIsDark,
      strategy: config.strategy,
      darkModeStrategy: config.darkModeStrategy,
    }

    // Générer le CSS critique côté serveur
    const cssOptions: CriticalCSSOptions = {
      mode: 'both',
      darkSelector: config.darkModeStrategy === 'media' ? 'media' : 'class',
      prefix: config.prefix,
    } satisfies CriticalCSSOptions

    const criticalCSS = generateCriticalCSS(themeState.currentPreset, cssOptions)
    // const fullCSS = generateFullCSS(themeState.currentPreset, cssOptions)

    useHead({
      style: [
        {
          innerHTML: criticalCSS,
          id: 'maz-theme-critical-ssr',
        },
        // {
        //   innerHTML: fullCSS,
        //   id: 'maz-theme-full-ssr',
        // },
      ],
    })

    // Ajouter la classe dark si nécessaire
    if (initialIsDark && config.darkModeStrategy === 'class') {
      useHead({
        htmlAttrs: {
          class: 'dark',
        },
      })
    }

    // Injecter dans Vue
    // vueApp.provide('mazThemeState', themeState)
  }

  const ssrCriticalStyle = document?.getElementById('maz-theme-critical-ssr')
  if (ssrCriticalStyle) {
    ssrCriticalStyle.remove()
  }

  // Côté client : utilisation complète du MazUiPlugin
  MazUiPlugin.install(vueApp, config)
})

declare module '#app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
