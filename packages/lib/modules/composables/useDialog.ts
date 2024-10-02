import type { DialogHandler } from '../plugins/dialog/DialogHandler'
import { injectStrict } from '../helpers/inject-strict'

export function useDialog() {
  return injectStrict<DialogHandler>('dialog')
}
