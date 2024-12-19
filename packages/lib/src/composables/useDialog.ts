import type { DialogHandler } from '../plugins/dialog/DialogHandler'
import { injectStrict } from '../helpers/injectStrict'

export function useDialog() {
  return injectStrict<DialogHandler>('dialog')
}
