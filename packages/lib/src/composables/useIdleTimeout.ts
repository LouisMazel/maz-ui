import type { IdleTimeoutCallback, IdleTimeoutOptions } from '../helpers/idleTimeout'
import {
  IdleTimeout,

} from '../helpers/idleTimeout'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
