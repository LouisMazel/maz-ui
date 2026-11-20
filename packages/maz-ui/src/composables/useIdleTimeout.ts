import type { IdleTimeoutCallback, IdleTimeoutOptions } from '@maz-ui/utils/helpers/idleTimeout'
import { IdleTimeout } from '@maz-ui/utils/helpers/idleTimeout'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { getCurrentScope, onScopeDispose } from 'vue'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  const instance = new IdleTimeout(callback, options)

  if (getCurrentScope() && isClient()) {
    onScopeDispose(() => instance.destroy())
  }

  return instance
}
