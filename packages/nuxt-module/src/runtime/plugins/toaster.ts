import { ToasterHandler } from 'maz-ui/plugins/toaster'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toasterOptions = $config.public.mazUi?.composables?.useToast

  const options = typeof toasterOptions === 'object' ? toasterOptions : undefined

  const instance = new ToasterHandler(vueApp, options)

  const toasterServer = {
    show: (_message: string) => {},
    success: (_message: string) => {},
    error: (_message: string) => {},
    warning: (_message: string) => {},
    info: (_message: string) => {},
    message: (_message: string) => {},
  } as unknown as ToasterHandler

  return {
    provide: {
      mazToast: import.meta.server ? toasterServer : instance,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $mazToast: ToasterHandler
  }
}
