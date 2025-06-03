import type { WaitHandler } from '../plugins/wait'
import { useInjectStrict } from '../composables/useInjectStrict'

export function useWait() {
  return useInjectStrict<WaitHandler>('wait')
}
