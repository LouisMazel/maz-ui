import { injectStrict } from '../helpers/inject-strict'
import type { WaitHandler } from './../plugins/wait'

export const useWait = () => {
  const wait = injectStrict<WaitHandler>('wait')

  return {
    wait,
  }
}
