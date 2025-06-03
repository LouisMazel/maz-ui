import type { ToasterHandler } from '../plugins/toaster/ToasterHandler'
import { useInjectStrict } from '../composables/useInjectStrict'

export function useToast() {
  return useInjectStrict<ToasterHandler>('toast')
}
