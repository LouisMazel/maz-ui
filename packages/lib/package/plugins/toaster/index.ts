import type { ToasterOptions } from './types'
import { ToasterHandler } from './toaster-handler'
import type { App } from 'vue'

const defaultOptions: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: true,
}

export const plugin = {
  install(app: App, options?: ToasterOptions) {
    const toaster = new ToasterHandler(app, {
      ...defaultOptions,
      ...options,
    })

    app.provide('toast', toaster)
    app.config.globalProperties.$toaster = toaster
  },
}

export type { ToasterOptions, ToasterPositions } from './types'
export { ToasterHandler } from './toaster-handler'
