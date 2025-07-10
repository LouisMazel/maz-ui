import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export function useInjectStrict<T>(key: string | InjectionKey<T> | symbol, fallback?: T, errorMessage?: string) {
  const resolved = inject(key, fallback)

  if (!resolved) {
    throw new TypeError(errorMessage || `[maz-ui](injectStrict) Could not resolve ${key.toString()}`)
  }

  return resolved
}
