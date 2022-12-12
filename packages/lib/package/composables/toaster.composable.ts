import { injectStrict } from './../helpers/inject-strict'
import type { ToasterHandler } from './../plugins/toaster'

export const useToast = () => {
  const toast = injectStrict<ToasterHandler>('toast')

  return {
    toast,
  }
}
