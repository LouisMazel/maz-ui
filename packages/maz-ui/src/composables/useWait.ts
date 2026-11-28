import type { WaitHandler } from '../plugins/wait.ts'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { hasInjectionContext, inject } from 'vue'
import { ServerWaitHandler, waitInstance } from '../plugins/wait.ts'

let serverInstance: ServerWaitHandler | undefined

/**
 * The loaders shared by the whole app: works without any plugin, in a component, a store or any module
 */
export function useWait(): WaitHandler {
  // Removed in v6 (plans/ROADMAP.md): handler provided by the deprecated WaitPlugin
  const provided = hasInjectionContext()
    ? inject<WaitHandler | undefined>('mazWait', undefined)
    : undefined

  if (provided) {
    return provided
  }

  if (isServer()) {
    serverInstance ??= new ServerWaitHandler()
    return serverInstance
  }

  return waitInstance
}
