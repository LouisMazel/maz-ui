import type { DialogHandler } from 'maz-ui'
import { useNuxtApp } from '#imports'

export function useDialog(): DialogHandler {
  const { $dialog } = useNuxtApp()

  return $dialog
}
