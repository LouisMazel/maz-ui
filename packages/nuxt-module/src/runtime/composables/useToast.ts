import type { ToasterHandler } from 'maz-ui/plugins'
import { useNuxtApp } from '#imports'

export function useToast(): ToasterHandler {
  const { $toast } = useNuxtApp()

  return $toast
}
