import type { Ref } from 'vue'
import type { GlobalState, MazUiTranslationsMessages, MazUiTranslationsSchema } from './types'
import { reactive, ref } from 'vue'

/**
 * State of a translations instance: every `createMazUiTranslations()` has its own, so two apps,
 * a `MazUiProvider` or two server requests never share their locale nor their messages.
 */
export interface TranslationsStore {
  locale: Ref<string>
  state: GlobalState
  /** Messages added with `setLocaleMessage`, applied over the loaded messages */
  overrides: Record<string, Partial<MazUiTranslationsSchema>>
  /** Locales whose last load failed: not retried automatically by `t()` */
  failedLocales: Set<string>
  /** Incremented by every `setLocale`: the last call wins over a slower previous one */
  localeRequest: number
}

function createGlobalState(): GlobalState {
  return reactive<GlobalState>({
    loadedLocales: new Set<string>(),
    messages: {} as Record<string, Partial<MazUiTranslationsSchema>>,
    userMessages: {} as MazUiTranslationsMessages,
    loadingPromises: new Map<string, Promise<void>>(),
  })
}

/**
 * @deprecated Use the `locale` of the instance (`useTranslations().locale`): this ref is only the
 * locale of the plugin installed in the browser, never the one of a `MazUiProvider` nor of a server request.
 */
export const locale = ref<string>('en')

/**
 * @deprecated Use the methods of the instance (`useTranslations()`): this state is only the one of
 * the plugin installed in the browser, never the one of a `MazUiProvider` nor of a server request.
 */
export const globalState = createGlobalState()

/**
 * Store of the deprecated `locale` and `globalState` exports, used by the plugin in the browser and
 * by the standalone functions called without a store.
 * @internal
 */
export const legacyStore: TranslationsStore = {
  locale,
  state: globalState,
  overrides: {},
  failedLocales: new Set(),
  localeRequest: 0,
}

/** @internal */
export function createTranslationsStore(initialLocale = 'en'): TranslationsStore {
  return {
    locale: ref(initialLocale),
    state: createGlobalState(),
    overrides: {},
    failedLocales: new Set(),
    localeRequest: 0,
  }
}
