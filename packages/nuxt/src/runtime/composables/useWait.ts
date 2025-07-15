import type { WaitHandler } from 'maz-ui/plugins/wait'
import { useNuxtApp } from 'nuxt/app'

export function useWait(): WaitHandler {
  const { $mazWait } = useNuxtApp()

  return $mazWait
}
