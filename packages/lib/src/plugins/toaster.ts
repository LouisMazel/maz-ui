import type { App } from 'vue'
import type { ToasterOptions } from './toaster/types'
import { ToasterHandler } from './toaster/ToasterHandler'

export const ToasterPlugin = {
  install(app: App, options?: ToasterOptions) {
    const toasterHandler = new ToasterHandler(app, options)
    app.provide('mazToast', toasterHandler)
    app.config.globalProperties.$mazToast = toasterHandler
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Toaster handler instance
     * @description You should install the plugin to use this property
     * @examl
     * ```ts
     * import { ToasterPlugin } from 'maz-ui/plugins/toaster'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(ToasterPlugin)
     *
     * const toast = useToast()
     * toast.success('Hello, world!')
     */
    $mazToast: ToasterHandler
  }
}

export { ToasterHandler }
export type { ToasterOptions, ToasterPosition } from './toaster/types'
