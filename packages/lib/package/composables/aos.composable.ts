import { injectStrict } from '../helpers/inject-strict'
import type { AosHandler } from './../plugins/aos'

export const useAos = () => {
  const aos = injectStrict<AosHandler>('aos')

  return {
    aos,
  }
}
