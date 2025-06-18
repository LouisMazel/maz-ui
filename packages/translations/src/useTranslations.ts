import type { MazTranslationsInstance } from './types'
import { inject } from 'vue'

export function useTranslations(): MazTranslationsInstance {
  const injected = inject<MazTranslationsInstance>('mazTranslations')

  if (!injected) {
    throw new Error('MazTranslations plugin or MazUi plugin not installed. Please install the plugin first.')
  }

  return injected
}
