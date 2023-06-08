import type { ToasterOptions } from './types'
import { ToasterHandler } from './toaster-handler'
import type { App } from 'vue'

const defaultOptions: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: true,
}

export let toastInstance: ToasterHandler

export function createToaster(app: App, options?: ToasterOptions): ToasterHandler {
  return new ToasterHandler(app, {
    ...defaultOptions,
    ...options,
  })
}

export const installToaster = {
  install(app: App, options?: ToasterOptions) {
    toastInstance = new ToasterHandler(app, {
      ...defaultOptions,
      ...options,
    })

    app.provide('toast', toastInstance)
  },
}

export type { ToasterOptions, ToasterPositions } from './types'
export { ToasterHandler } from './toaster-handler'
