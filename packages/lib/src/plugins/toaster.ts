import type { App } from 'vue'
import type { ToasterOptions } from './toaster/types'
import { ToasterHandler } from './toaster/ToasterHandler'

export const ToasterPlugin = {
  install(app: App, options?: ToasterOptions) {
    const toasterHandler = new ToasterHandler(app, options)
    app.provide('toast', toasterHandler)
    app.config.globalProperties.$toast = toasterHandler
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
    $toast: ToasterHandler
  }
}

export { ToasterHandler }
export type { ToasterOptions, ToasterPosition } from './toaster/types'
