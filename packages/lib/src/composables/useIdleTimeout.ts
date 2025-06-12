import type { IdleTimeoutCallback, IdleTimeoutOptions } from '../utils/idleTimeout'
import {
  IdleTimeout,

} from '../utils/idleTimeout'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
