import type { ToasterHandler } from 'maz-ui/plugins'
import { useNuxtApp } from 'nuxt/app'

export function useToast(): ToasterHandler {
  const { $toast } = useNuxtApp()

  return $toast
}
