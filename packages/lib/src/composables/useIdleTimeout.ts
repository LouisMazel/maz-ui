import type { IdleTimeoutCallback, IdleTimeoutOptions } from '@maz-ui/utils/src/utils/idleTimeout.js'
import {
  IdleTimeout,

} from '@maz-ui/utils/src/utils/idleTimeout.js'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
