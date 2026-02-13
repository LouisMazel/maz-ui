import type { GlobalState, MazUiTranslationsMessages, MazUiTranslationsSchema } from './types'
import { reactive, ref } from 'vue'

export const locale = ref<string>('en')

export const globalState = reactive<GlobalState>({
  loadedLocales: new Set<string>(),
  messages: {} as Record<string, Partial<MazUiTranslationsSchema>>,
  userMessages: {} as MazUiTranslationsMessages,
  loadingPromises: new Map<string, Promise<void>>(),
})
