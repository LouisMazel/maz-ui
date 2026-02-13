import type { MazUiTranslationsInstance } from '../types'
import { getCurrentInstance, inject } from 'vue'

export function useTranslations(): MazUiTranslationsInstance {
  const injected = inject<MazUiTranslationsInstance | undefined>('mazTranslations', undefined)

  if (injected) {
    return injected
  }

  const instance = getCurrentInstance()
  if (instance?.appContext?.app?.config?.globalProperties?.$mazTranslations) {
    return instance.appContext.app.config.globalProperties.$mazTranslations
  }

  throw new Error('[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin, or wrap your components in a MazUiProvider, before using useTranslations composable')
}
