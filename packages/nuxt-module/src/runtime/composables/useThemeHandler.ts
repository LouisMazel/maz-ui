import {
  useThemeHandler as useThemeHandlerComposable,
  type ThemeHandlerOptions,
} from 'maz-ui/composables/useThemeHandler'
import { useNuxtApp } from 'nuxt/app'

export function useThemeHandler(
  options?: ThemeHandlerOptions,
): ReturnType<typeof useThemeHandlerComposable> {
  const { $config } = useNuxtApp()

  const themeHandlerOptions = $config.public.mazUi?.injectUseThemeHandler

  const mergedOptions: ThemeHandlerOptions
    = typeof themeHandlerOptions === 'object'
      ? { ...themeHandlerOptions, ...options }
      : { ...options }

  return useThemeHandlerComposable(mergedOptions)
}
