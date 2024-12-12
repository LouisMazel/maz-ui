import {
  IdleTimeout,
  type IdleTimeoutCallback,
  type IdleTimeoutOptions,
} from '@helpers/idleTimeout'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
