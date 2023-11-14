import { useNuxtApp } from '#imports'
import type { WaitHandler } from 'maz-ui'

export function useWait(): WaitHandler {
  const { $wait } = useNuxtApp()

  return $wait
}
