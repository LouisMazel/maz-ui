import type { WaitHandler } from 'maz-ui/plugins'
import { useNuxtApp } from 'nuxt/app'

export function useWait(): WaitHandler {
  const { $wait } = useNuxtApp()

  return $wait
}
