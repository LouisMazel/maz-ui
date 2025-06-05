import type { ToasterHandler } from 'maz-ui/plugins/toaster'
import { useNuxtApp } from 'nuxt/app'

export function useToast(): ToasterHandler {
  const { $toast } = useNuxtApp()

  return $toast
}
