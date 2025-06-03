import type { AosHandler } from '../plugins/aos'
import { useInjectStrict } from '../composables/useInjectStrict'

export function useAos() {
  return useInjectStrict<AosHandler>('aos')
}
