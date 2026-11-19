import type { DialogHandler } from '../plugins/dialog/DialogHandler.ts'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

export function useDialog() {
  return useInjectStrict<DialogHandler>('mazDialog', undefined, '[maz-ui](useDialog) DialogPlugin is not installed')
}
