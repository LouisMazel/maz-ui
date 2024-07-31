import { type AosHandler } from 'maz-ui'
import { useNuxtApp } from '#imports'

export function useAos(): AosHandler {
  const { $aos } = useNuxtApp()

  return $aos
}
