import { ref, type Ref } from 'vue'

const handler = ref<IdleTimeout>()

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
  const instance = new IdleTimeout(callback, options)

  handler.value = instance

  const idle = handler as Ref<IdleTimeout>

  return {
    idle,
  }
}
