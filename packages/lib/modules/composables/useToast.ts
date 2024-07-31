import { injectStrict } from '../helpers/inject-strict'
import type { ToasterHandler } from '../plugins/toaster'

export function useToast() {
  return injectStrict<ToasterHandler>('toast')
}
