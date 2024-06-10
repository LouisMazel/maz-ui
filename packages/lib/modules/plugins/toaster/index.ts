import type { App } from 'vue'
import type { ToasterOptions } from './types'
import { ToasterHandler } from './toaster-handler'

export function createToaster(app: App, options?: ToasterOptions): ToasterHandler {
  return new ToasterHandler(app, options)
}

export const installToaster = {
  install(app: App, options?: ToasterOptions) {
    app.provide('toast', createToaster(app, options))
  },
}

export type { ToasterOptions, ToasterPosition, ToasterPositions } from './types'
export { ToasterHandler } from './toaster-handler'
