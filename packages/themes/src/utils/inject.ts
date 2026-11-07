import type { App, Ref } from 'vue'
import type { ThemeState } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { setActiveThemeState } from './theme-state-registry'

export function injectThemeState({
  app,
  themeState,
}: {
  app?: App
  themeState: Ref<ThemeState>
}) {
  if (!app) {
    throw new Error('[@maz-ui/themes](injectThemeState) No app provided')
  }

  app.provide('mazThemeState', themeState)
  app.config.globalProperties.$mazThemeState = themeState
  if (!isServer())
    setActiveThemeState(themeState)
}
