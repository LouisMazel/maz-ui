import type { MazUiTranslationsInstance } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { getCurrentInstance, hasInjectionContext, inject } from 'vue'
import { getActiveTranslations } from '../utils/active-instance'

/**
 * Translations instance of the current component tree (plugin or `MazUiProvider`). Outside a
 * component, the instance installed in the browser (never on the server).
 */
export function useTranslations(): MazUiTranslationsInstance {
  if (hasInjectionContext()) {
    const injected = inject<MazUiTranslationsInstance | undefined>('mazTranslations', undefined)
      ?? getCurrentInstance()?.appContext.config.globalProperties.$mazTranslations
    if (injected) {
      return injected
    }
  }

  const active = isServer()
    ? undefined
    : getActiveTranslations()
  if (active) {
    return active
  }

  throw new Error('[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin, or wrap your components in a MazUiProvider, before using useTranslations composable')
}
