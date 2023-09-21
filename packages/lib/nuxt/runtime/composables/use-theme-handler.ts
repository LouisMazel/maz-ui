import { useThemeHandler as useThemeHandlerComposable } from '../../../modules'
import { useNuxtApp } from 'nuxt/app'

export function useThemeHandler() {
  const { $config } = useNuxtApp()

  const themeHandlerOptions = $config.public.mazUi?.injectUseThemeHandler

  const options = typeof themeHandlerOptions === 'object' ? themeHandlerOptions : undefined

  return useThemeHandlerComposable(options)
}
