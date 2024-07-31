import { injectStrict } from '../helpers/inject-strict'
import type { WaitHandler } from '../plugins/wait'

export function useWait() {
  return injectStrict<WaitHandler>('wait')
}
