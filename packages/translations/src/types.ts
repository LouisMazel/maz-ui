import type { DeepKeyOf, DeepPartial, FlattenObjectKeys } from '@maz-ui/utils/src/ts-helpers/index.js'
import type { Ref } from 'vue'
import type defaultMessages from './locales/en'

export type TranslationKey = NonNullable<DeepKeyOf<MazTranslationsFlattenSchema>>

export type MazTranslationsMessages = Record<string, MazTranslationsSchema | (() => Promise<MazTranslationsSchema>) | (() => Promise<{ default: MazTranslationsSchema }>)>

export interface MazTranslationsOptions {
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
  messages?: MazTranslationsMessages
}

export interface MazTranslationsInstance {
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
  setLocaleMessage: (locale: string, messages: Partial<MazTranslationsSchema>) => void
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
  getMessages: () => Record<string, Partial<MazTranslationsSchema>>
}

export type MazTranslationsFlattenSchema = Record<FlattenObjectKeys<typeof defaultMessages>, string>
export type MazTranslationsNestedSchema = typeof defaultMessages
export type MazTranslationsSchema = DeepPartial<MazTranslationsFlattenSchema | MazTranslationsNestedSchema>
