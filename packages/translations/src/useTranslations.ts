import type { MazTranslationsInstance } from './types'
import { inject } from 'vue'

export function useTranslations(): MazTranslationsInstance {
  const injected = inject<MazTranslationsInstance>('mazTranslations')

  if (!injected) {
    throw new Error('[@maz-ui/translations] You must install the MazUi or MazTranslations plugin before using useTranslations composable')
  }

  return injected
}
