import type { Plugin } from 'vue'
import type { ToastOptions } from './toast/types'
import { ToastHandler } from './toast/ToastHandler'

export const ToastPlugin: Plugin<[ToastOptions?]> = {
  install(app, options) {
    const toastHandler = new ToastHandler(app, options)
    app.provide('mazToast', toastHandler)
    app.config.globalProperties.$mazToast = toastHandler
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Toast handler instance
     * @description You should install the plugin to use this property
     * @example
     * ```ts
     * import { ToastPlugin } from 'maz-ui/plugins/toast'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(ToastPlugin)
     *
     * const toast = useToast()
     * toast.success('Hello, world!')
     */
    $mazToast: ToastHandler
  }
}

export { ToastHandler }
export type { ToastOptions, ToastPosition } from './toast/types'
