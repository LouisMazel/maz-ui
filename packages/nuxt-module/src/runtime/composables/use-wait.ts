import type { WaitHandler } from 'maz-ui'
import { useNuxtApp } from '#imports'

export function useWait(): WaitHandler {
  const { $wait } = useNuxtApp()

  return $wait
}
