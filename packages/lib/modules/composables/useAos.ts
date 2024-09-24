import type { AosHandler } from '../plugins/aos'
import { injectStrict } from '../helpers/inject-strict'

export function useAos() {
  return injectStrict<AosHandler>('aos')
}
