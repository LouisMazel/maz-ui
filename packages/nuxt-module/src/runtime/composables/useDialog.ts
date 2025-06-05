import type { DialogHandler } from 'maz-ui/plugins/dialog'
import { useNuxtApp } from 'nuxt/app'

export function useDialog(): DialogHandler {
  const { $dialog } = useNuxtApp()

  return $dialog
}
