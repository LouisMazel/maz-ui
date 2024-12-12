import type { StrictOptions } from './types'

export const CONFIG: {
  mode: StrictOptions['mode']
  scrollToErrorSelector: string
  debounceTime: number
  throttleTime: number
} = {
  mode: 'lazy',
  scrollToErrorSelector: '.has-field-error',
  debounceTime: 300,
  throttleTime: 1000,
} as const
