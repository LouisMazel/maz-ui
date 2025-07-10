import type { DeepKeyOf, DeepPartial, FlattenObjectKeys } from '@maz-ui/utils/src/ts-helpers/index.js'
import type { Ref } from 'vue'
import type defaultMessages from './locales/en'

export type TranslationKey = NonNullable<DeepKeyOf<MazTranslationsSchema>>

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
   * Whether to preload the fallback locale
   * @default true
   */
  preloadFallback?: boolean
  /**
   * Modify existing or add new languages
   */
  messages?: Record<string, MazTranslationsSchema | (() => Promise<MazTranslationsSchema>)>
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
}

export type MazTranslationsFlattenSchema = Record<FlattenObjectKeys<typeof defaultMessages>, string>
export type MazTranslationsNestedSchema = typeof defaultMessages
export type MazTranslationsSchema = DeepPartial<MazTranslationsFlattenSchema | MazTranslationsNestedSchema>
