import type { ToasterOptions } from './types'
import { ToasterHandler } from './toaster-handler'
import type { App } from 'vue'

const defaultOptions: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: true,
}

export let instance: ToasterHandler

export const plugin = {
  install(app: App, options?: ToasterOptions) {
    instance = new ToasterHandler(app, {
      ...defaultOptions,
      ...options,
    })

    app.provide('toast', instance)
  },
}

export type { ToasterOptions, ToasterPositions } from './types'
export { ToasterHandler } from './toaster-handler'
