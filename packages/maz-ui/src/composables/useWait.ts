import type { WaitHandler } from '../plugins/wait.ts'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

export function useWait() {
  return useInjectStrict<WaitHandler>('mazWait', undefined, '[maz-ui](useWait) WaitPlugin is not installed')
}
