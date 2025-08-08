import type { DeepKeyOf, DeepPartial, FlattenObjectKeys } from '@maz-ui/utils/ts-helpers'
import type { Ref } from 'vue'
import type defaultMessages from './locales/en'

export type TranslationKey = NonNullable<DeepKeyOf<MazUiTranslationsFlattenSchema>>

export type MazUiTranslationsMessages = Record<string, MazUiTranslationsSchema | (() => Promise<MazUiTranslationsSchema>) | (() => Promise<{ default: MazUiTranslationsSchema }>)>

export interface MazUiTranslationsOptions {
  /**
   * The locale to use
   * @default 'en'
   */
  locale?: string
  /**
   * The fallback locale to use
   * @default 'en'
   */
  fallbackLocale?: string
  /**
   * Whether to preload the fallback locale asynchronously
   * @default true
   */
  preloadFallback?: boolean
  /**
   * Modify existing or add new languages
   */
  messages?: MazUiTranslationsMessages
}

export interface MazUiTranslationsInstance {
  /**
   * The current locale
   */
  locale: Ref<string>
  /**
   * The translation function
   */
  t: (key: TranslationKey, variables?: Record<string, any>) => string
  /**
   * The function to set the locale dynamically
   */
  setLocale: (locale: string) => Promise<void>
  /**
   * The function to get the available locales
   */
  getAvailableLocales: () => string[]
  /**
   * The function to get the loaded locales
   */
  getLoadedLocales: () => string[]
  /**
   * The function to add messages to a locale
   */
  setLocaleMessage: (locale: string, messages: Partial<MazUiTranslationsSchema>) => void
  /**
   * The function to check if a locale is loaded
   */
  isLocaleLoaded: (locale: string) => boolean
  /**
   * The function to check if a locale is loading
   */
  isLocaleLoading: (locale: string) => boolean
  /**
   * The function to get the messages
   */
  getMessages: () => Record<string, Partial<MazUiTranslationsSchema>>
}

export type MazUiTranslationsFlattenSchema = Record<FlattenObjectKeys<typeof defaultMessages>, string>
export type MazUiTranslationsNestedSchema = typeof defaultMessages
export type MazUiTranslationsSchema = DeepPartial<MazUiTranslationsFlattenSchema | MazUiTranslationsNestedSchema>
