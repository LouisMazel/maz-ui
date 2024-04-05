import { injectStrict } from '../helpers/inject-strict'
import type { AosHandler } from '../plugins/aos'

export function useAos() {
  return injectStrict<AosHandler>('aos')
}
