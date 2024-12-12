import type { AosHandler } from '@plugins/aos'
import { injectStrict } from '@helpers/injectStrict'

export function useAos() {
  return injectStrict<AosHandler>('aos')
}
