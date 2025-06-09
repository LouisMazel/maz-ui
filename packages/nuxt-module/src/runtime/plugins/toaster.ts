import { ToasterHandler } from 'maz-ui/plugins/toaster'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toasterOptions = $config.public.mazUi?.composables?.useToast

  const options = typeof toasterOptions === 'object' ? toasterOptions : undefined

  const instance = new ToasterHandler(vueApp, options)

  const toasterServer = {
    show: (message: string) => console.log('[SSR] Toast:', message),
    success: (message: string) => console.log('[SSR] Success:', message),
    error: (message: string) => console.log('[SSR] Error:', message),
    warning: (message: string) => console.log('[SSR] Warning:', message),
    info: (message: string) => console.log('[SSR] Info:', message),
    message: (message: string) => console.log('[SSR] Message:', message),
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
