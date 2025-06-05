import { ToasterHandler } from 'maz-ui/plugins'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toasterOptions = $config.public.mazUi?.injectUseToast

  const options = typeof toasterOptions === 'object' ? toasterOptions : undefined

  const instance = new ToasterHandler(vueApp, options)

  const toasterServer = {
    show: () => {},
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {},
    message: () => {},
  } as unknown as ToasterHandler

  return {
    provide: {
      toast: import.meta.server ? toasterServer : instance,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $toast: ToasterHandler
  }
}
