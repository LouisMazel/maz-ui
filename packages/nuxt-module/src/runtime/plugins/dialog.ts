import { DialogHandler } from 'maz-ui/plugins'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const dialogOptions = $config.public.mazUi?.injectUseDialog

  const options = typeof dialogOptions === 'object' ? dialogOptions : undefined

  const instance = new DialogHandler(vueApp, options)

  const dialogServer = {
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
      dialog: import.meta.server ? dialogServer : instance,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $dialog: DialogHandler
  }
}
