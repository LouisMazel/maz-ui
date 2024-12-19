import type { WaitHandler } from '../plugins/wait'
import { injectStrict } from '../helpers/injectStrict'

export function useWait() {
  return injectStrict<WaitHandler>('wait')
}
