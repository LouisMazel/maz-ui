import type { DeepKeyOf, DeepPartial, FlattenObjectKeys } from '@maz-ui/utils/src/ts-helpers/index.js'
import type { Ref } from 'vue'
import type defaultMessages from './locales/en'

export type TranslationKey = NonNullable<DeepKeyOf<MazTranslationsSchema>>

export interface MazTranslationsOptions {
  locale?: string
  fallbackLocale?: string
  preloadFallback?: boolean
  messages?: Record<string, MazTranslationsSchema | (() => Promise<MazTranslationsSchema>)>
}

export interface MazTranslationsInstance {
  locale: Ref<string>
  t: (key: TranslationKey, variables?: Record<string, any>) => string
  setLocale: (locale: string) => Promise<void>
}

export type MazTranslationsFlattenSchema = Record<FlattenObjectKeys<typeof defaultMessages>, string>
export type MazTranslationsNestedSchema = typeof defaultMessages
export type MazTranslationsSchema = DeepPartial<MazTranslationsFlattenSchema | MazTranslationsNestedSchema>
