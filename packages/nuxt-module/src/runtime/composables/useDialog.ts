import type { DialogHandler } from 'maz-ui/plugins'
import { useNuxtApp } from '#imports'

export function useDialog(): DialogHandler {
  const { $dialog } = useNuxtApp()

  return $dialog
}
