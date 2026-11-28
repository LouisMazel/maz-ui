import type { AosHandler } from '../plugins/aos.ts'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

/**
 * @deprecated Use `vReveal` (`maz-ui/directives/vReveal`) or `useReveal` instead: `useReveal({ selector: '.prose > *' })`
 * Removed in v6 (plans/ROADMAP.md)
 */
export function useAos() {
  return useInjectStrict<AosHandler>('mazAos', undefined, '[maz-ui](useAos) AosPlugin is not installed')
}
