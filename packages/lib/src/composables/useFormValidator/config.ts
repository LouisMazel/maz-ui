import type { BaseFormPayload, ExtractModelKey, FormSchema, StrictOptions } from './types'

export const CONFIG: {
  mode: StrictOptions<BaseFormPayload, ExtractModelKey<FormSchema<BaseFormPayload>>>['mode']
  scrollToErrorSelector: string
  debounceTime: number
  throttleTime: number
} = {
  mode: 'lazy',
  scrollToErrorSelector: '.has-field-error',
  debounceTime: 300,
  throttleTime: 1000,
} as const
