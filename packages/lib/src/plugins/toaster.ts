import type { App } from 'vue'
import type { ToasterOptions } from './toaster/types'
import { ToasterHandler } from './toaster/ToasterHandler'

export function createToaster(app: App, options?: ToasterOptions): ToasterHandler {
  return new ToasterHandler(app, options)
}

export const ToasterPlugin = {
  install(app: App, options?: ToasterOptions) {
    const toasterHandler = createToaster(app, options)
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

export type { ToasterOptions, ToasterPosition } from './toaster/types'
