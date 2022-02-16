import { ToasterOptions, ToasterPositions } from './types'
import { ToasterHandler } from './toaster-handler'

const defaultOptions: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: true,
}

export const plugin = {
  install(app, options?: ToasterOptions) {
    const toaster = new ToasterHandler(app, {
      ...defaultOptions,
      ...options,
    })

    app.provide('toast', toaster)
    app.config.globalProperties.$toaster = toaster
  },
}

export { ToasterHandler, ToasterOptions, ToasterPositions }
