import { defineNuxtPlugin } from 'nuxt/app'
import { MazUiPlugin } from 'maz-ui/plugins/maz-ui'
import { _initThemeState } from '@maz-ui/themes/composables/useTheme'

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  const themeConfig = $config.public.mazUi?.theme

  if (themeConfig === false) {
    return
  }

  if (import.meta.server) {
    return
  }

  const { mazUi } = await import('@maz-ui/themes/presets/mazUi')

  const config = {
    preset: mazUi,
    strategy: 'hybrid' as const,
    darkModeStrategy: 'class' as const,
    prefix: 'maz',
    ...themeConfig,
  }

  // 🔧 FIX: Patcher temporairement globalProperties pour éviter le conflit
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    vueApp.config.globalProperties,
    '$mazThemeState',
  )

  // Supprimer temporairement la propriété si elle existe
  if (originalDescriptor && vueApp.config.globalProperties.$mazThemeState) {
    delete vueApp.config.globalProperties.$mazThemeState
  }

  try {
    // 🎉 Utiliser MazUiPlugin qui fait tout le travail !
    await MazUiPlugin.install(vueApp, config)

    // Récupérer le themeState créé par MazUiPlugin
    const themeState = vueApp.config.globalProperties.$mazThemeState

    // Initialiser le composable useTheme avec le state de MazUiPlugin
    _initThemeState(themeState)
  }
  catch (error) {
    // Restaurer la propriété originale en cas d'erreur
    if (originalDescriptor) {
      Object.defineProperty(
        vueApp.config.globalProperties,
        '$mazThemeState',
        originalDescriptor,
      )
    }
    throw error
  }
})

declare module '#app' {
  interface NuxtApp {
    $mazThemeState: ThemeState
  }
}
