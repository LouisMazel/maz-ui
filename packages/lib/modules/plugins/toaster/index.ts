import type { ToasterOptions } from './types'
import { ToasterHandler } from './toaster-handler'
import type { App } from 'vue'

export let toastInstance: ToasterHandler

export function createToaster(app: App, options?: ToasterOptions): ToasterHandler {
  return new ToasterHandler(app, options)
}

export const installToaster = {
  install(app: App, options?: ToasterOptions) {
    toastInstance = new ToasterHandler(app, options)

    app.provide('toast', toastInstance)
  },
}

export type { ToasterOptions, ToasterPosition, ToasterPositions } from './types'
export { ToasterHandler } from './toaster-handler'
