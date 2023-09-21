import { injectStrict } from '../helpers/inject-strict'
import type { AosHandler } from '../plugins/aos'

export const useAos = () => {
  return injectStrict<AosHandler>('aos')
}
