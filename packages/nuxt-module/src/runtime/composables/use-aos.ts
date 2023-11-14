import { useNuxtApp } from '#imports'
import { type AosHandler } from 'maz-ui'

export function useAos(): AosHandler {
  const { $aos } = useNuxtApp()

  return $aos
}
