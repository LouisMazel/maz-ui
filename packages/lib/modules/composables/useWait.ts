import type { WaitHandler } from '../plugins/wait'
import { injectStrict } from '../helpers/inject-strict'

export function useWait() {
  return injectStrict<WaitHandler>('wait')
}
