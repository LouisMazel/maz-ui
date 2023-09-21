import {
  IdleTimeout,
  type IdleTimeoutCallback,
  type IdleTimeoutOptions,
} from '../helpers/idle-timeout'

export const useIdleTimeout = ({
  callback,
  options,
}: {
  callback: IdleTimeoutCallback
  options?: IdleTimeoutOptions
}) => {
  return new IdleTimeout(callback, options)
}
