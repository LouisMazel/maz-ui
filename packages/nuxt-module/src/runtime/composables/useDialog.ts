import type { DialogHandler } from 'maz-ui/plugins'
import { useNuxtApp } from 'nuxt/app'

export function useDialog(): DialogHandler {
  const { $dialog } = useNuxtApp()

  return $dialog
}
