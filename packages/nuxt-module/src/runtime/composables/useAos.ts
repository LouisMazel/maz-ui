import type { AosHandler } from 'maz-ui/plugins'
import { useNuxtApp } from '#imports'

export function useAos(): AosHandler {
  const { $aos } = useNuxtApp()

  return $aos
}
