import type { ToastHandler } from 'maz-ui/plugins/toast'
import { useNuxtApp } from 'nuxt/app'

export function useToast(): ToastHandler {
  const { $mazToast } = useNuxtApp()

  return $mazToast
}
