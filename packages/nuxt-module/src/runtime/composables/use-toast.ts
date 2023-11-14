import { useNuxtApp } from '#imports'
import { type ToasterHandler } from 'maz-ui'

export function useToast(): ToasterHandler {
  const { $toast } = useNuxtApp()

  return $toast
}
