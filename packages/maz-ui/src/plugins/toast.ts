import type { Plugin } from 'vue'
import type { ToastOptions } from './toast/types.ts'
import { warnDeprecated } from '../utils/warnDeprecated.ts'
import { ToastHandler } from './toast/ToastHandler.ts'

/**
 * @deprecated `useToast()` works without it, it will be removed in v6: give its options to the MazUi plugin (`toast`). https://maz-ui.com/plugins/toast
 */
// Removed in v6 (plans/ROADMAP.md): deprecated ToastPlugin
export const ToastPlugin: Plugin<[ToastOptions?]> = {
  install(app, options) {
    warnDeprecated('ToastPlugin', 'ToastPlugin is deprecated and will be removed in v6: useToast() works without it, remove app.use(ToastPlugin) and give its options to the MazUi plugin: app.use(MazUi, { toast: { ... } }). https://maz-ui.com/plugins/toast')

    const toastHandler = new ToastHandler(app, options)
    app.provide('mazToast', toastHandler)
    app.config.globalProperties.$mazToast = toastHandler
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Toast handler instance, provided by the deprecated `ToastPlugin`
     * @deprecated use `useToast()` from `maz-ui/composables/useToast`, it will be removed in v6
     */
    // Removed in v6 (plans/ROADMAP.md): deprecated ToastPlugin
    $mazToast: ToastHandler
  }
}

export { ToastHandler }
export type { ToastOptions, ToastPosition } from './toast/types.ts'
