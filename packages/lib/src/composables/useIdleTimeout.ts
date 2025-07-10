import type { IdleTimeoutCallback, IdleTimeoutOptions } from '@maz-ui/utils/src/helpers/idleTimeout.js'
import {
  IdleTimeout,

} from '@maz-ui/utils/src/helpers/idleTimeout.js'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
