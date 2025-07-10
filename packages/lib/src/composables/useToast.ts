import type { ToastHandler } from '../plugins/toast/ToastHandler'
import { useInjectStrict } from '../composables/useInjectStrict'

export function useToast() {
  const toast = useInjectStrict<ToastHandler>('mazToast', undefined, '[maz-ui](useToast) ToastPlugin is not installed')

  return {
    message: toast.message.bind(toast),
    success: toast.success.bind(toast),
    error: toast.error.bind(toast),
    info: toast.info.bind(toast),
    warning: toast.warning.bind(toast),
  }
}
