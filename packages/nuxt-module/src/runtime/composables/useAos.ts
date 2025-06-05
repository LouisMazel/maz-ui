import type { AosHandler } from 'maz-ui/plugins/aos'
import { useNuxtApp } from 'nuxt/app'

export function useAos(): AosHandler {
  const { $aos } = useNuxtApp()

  return $aos
}
