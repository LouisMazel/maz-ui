import type { ToasterHandler } from './../../../modules'
import { useNuxtApp } from 'nuxt/app'

export function useToast() {
  const { $toast } = useNuxtApp()

  return $toast as ToasterHandler
}
