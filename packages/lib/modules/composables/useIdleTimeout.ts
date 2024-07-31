import {
  IdleTimeout,
  type IdleTimeoutCallback,
  type IdleTimeoutOptions,
} from '../helpers/idle-timeout'

export function useIdleTimeout({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) {
  return new IdleTimeout(callback, options)
}
