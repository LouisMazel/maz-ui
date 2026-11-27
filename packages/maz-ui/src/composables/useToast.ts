import { hasInjectionContext, inject } from 'vue'
import { ToastHandler } from '../plugins/toast/ToastHandler.ts'
import { createAppHandlerResolver, injectMazUiContext } from '../utils/mazUiContext.ts'

const resolveToastHandler = createAppHandlerResolver(({ app, toast }) => new ToastHandler(app, toast))

/**
 * Show toasts, with the options given to the MazUi plugin (`toast`): works without any other plugin
 */
export function useToast() {
  // Removed in v6 (plans/ROADMAP.md): handler provided by the deprecated ToastPlugin
  const provided = hasInjectionContext()
    ? inject<ToastHandler | undefined>('mazToast', undefined)
    : undefined

  const toast = provided ?? resolveToastHandler(injectMazUiContext('useToast'))

  return {
    message: toast.message.bind(toast),
    success: toast.success.bind(toast),
    error: toast.error.bind(toast),
    info: toast.info.bind(toast),
    warning: toast.warning.bind(toast),
    accent: toast.accent.bind(toast),
    neutral: toast.neutral.bind(toast),
  }
}
