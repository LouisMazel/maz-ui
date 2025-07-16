import { DialogHandler } from 'maz-ui/plugins/dialog'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const dialogOptions = $config.public.mazUi?.plugins?.dialog

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
      mazDialog: import.meta.server ? dialogServer : instance,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $mazDialog: DialogHandler
  }
}
