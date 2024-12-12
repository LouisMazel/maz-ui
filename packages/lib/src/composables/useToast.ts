import type { ToasterHandler } from '@plugins/toaster/ToasterHandler'
import { injectStrict } from '@helpers/injectStrict'

export function useToast() {
  return injectStrict<ToasterHandler>('toast')
}
