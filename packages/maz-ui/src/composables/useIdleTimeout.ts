import type { IdleTimeoutCallback, IdleTimeoutOptions } from '@maz-ui/utils/helpers/idleTimeout'
import {
  IdleTimeout,

} from '@maz-ui/utils/helpers/idleTimeout'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
