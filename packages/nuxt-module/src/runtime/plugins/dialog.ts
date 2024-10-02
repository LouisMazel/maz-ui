import { DialogHandler } from 'maz-ui'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const dialogOptions = $config.public.mazUi?.injectUseDialog

  const options = typeof dialogOptions === 'object' ? dialogOptions : undefined

  const instance = new DialogHandler(vueApp, options)

  const toasterServer = {
    open: () => {
      return {
        promise: Promise.resolve(),
        destroy: () => {},
        close: () => {},
      }
    },
  } as unknown as DialogHandler

  return {
    provide: {
      dialog: import.meta.server ? toasterServer : instance,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $dialog: DialogHandler
  }
}
