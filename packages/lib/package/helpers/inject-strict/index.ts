import { inject } from 'vue'

export function injectStrict<T>(key: string, fallback?: T) {
  const resolved = inject(key, fallback)

  if (!resolved) {
    throw new Error(`[maz-ui](injectStrict) Could not resolve ${key}`)
  }

  return resolved
}
