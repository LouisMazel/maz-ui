import type { App } from 'vue'
import type { DialogOptions } from './dialog/DialogHandler'
import { DialogHandler } from './dialog/DialogHandler'

export const DialogPlugin = {
  install(app: App, options?: DialogOptions) {
    const dialogHandler = new DialogHandler(app, options)
    app.provide('dialog', dialogHandler)
    app.config.globalProperties.$dialog = dialogHandler
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Dialog handler instance
     * @description You should install the plugin to use this property
     * @examl
     * ```ts
     * import { DialogPlugin } from 'maz-ui/plugins/dialog'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(DialogPlugin)
     *
     * const dialog = useDialog()
     * dialog.open({
     *   title: 'Hello',
     *   message: 'This is a dialog',
     * })
     */
    $dialog: DialogHandler
  }
}

export { DialogHandler, type DialogOptions } from './dialog/DialogHandler'
