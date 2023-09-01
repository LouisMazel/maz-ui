import { ToasterHandler } from './../../../modules'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp }) => {
  const instance = new ToasterHandler(vueApp, {
    position: 'top',
    timeout: 10_000,
    persistent: false,
  })

  /* eslint-disable @typescript-eslint/no-empty-function */
  const toasterServer = {
    show: () => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
  } as unknown as ToasterHandler
  /* eslint-enable @typescript-eslint/no-empty-function */

  return {
    provide: {
      toast: (process.client ? instance : toasterServer) as ToasterHandler,
    },
  }
})
