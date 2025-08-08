import type { MazUiTranslationsInstance } from './types'
import { inject } from 'vue'

export function useTranslations(): MazUiTranslationsInstance {
  const injected = inject<MazUiTranslationsInstance>('mazTranslations')

  if (!injected) {
    throw new Error('[@maz-ui/translations] You must install the MazUi or MazUiTranslations plugin before using useTranslations composable')
  }

  return injected
}
