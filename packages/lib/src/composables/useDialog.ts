import type { DialogHandler } from '../plugins/dialog/DialogHandler'
import { useInjectStrict } from '../composables/useInjectStrict'

export function useDialog() {
  return useInjectStrict<DialogHandler>('mazDialog', undefined, '[maz-ui](useDialog) DialogPlugin is not installed')
}
