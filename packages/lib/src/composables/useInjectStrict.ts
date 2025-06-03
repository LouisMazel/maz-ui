import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export function useInjectStrict<T>(key: string | InjectionKey<T> | symbol, fallback?: T) {
  const resolved = inject(key, fallback)

  if (!resolved) {
    throw new TypeError(`[maz-ui](injectStrict) Could not resolve ${key.toString()}`)
  }

  return resolved
}
