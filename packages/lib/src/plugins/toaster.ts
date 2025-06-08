import type { App } from 'vue'
import type { ToasterOptions } from './toaster/types'
import { ToasterHandler } from './toaster/ToasterHandler'

export function createToaster(app: App, options?: ToasterOptions): ToasterHandler {
  return new ToasterHandler(app, options)
}

export const ToasterPlugin = {
  install(app: App, options?: ToasterOptions) {
    app.provide('toast', createToaster(app, options))
  },
}

export { ToasterHandler } from './toaster/ToasterHandler'
export type { ToasterOptions, ToasterPosition } from './toaster/types'
