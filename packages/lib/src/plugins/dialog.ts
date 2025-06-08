import type { App } from 'vue'
import type { DialogOptions } from './dialog/DialogHandler'
import { DialogHandler } from './dialog/DialogHandler'

export const DialogPlugin = {
  install(app: App, options?: DialogOptions) {
    app.provide('dialog', new DialogHandler(app, options))
  },
}

export { DialogHandler, type DialogOptions } from './dialog/DialogHandler'
