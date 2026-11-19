import type { AosHandler } from '../plugins/aos.ts'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

export function useAos() {
  return useInjectStrict<AosHandler>('mazAos', undefined, '[maz-ui](useAos) AosPlugin is not installed')
}
