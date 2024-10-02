import type { App } from 'vue'
import type { DialogOptions } from './DialogHandler'
import { DialogHandler } from './DialogHandler'

export const installDialog = {
  install(app: App, options?: DialogOptions) {
    app.provide('dialog', new DialogHandler(app, options))
  },
}

export { DialogHandler, type DialogOptions } from './DialogHandler'
