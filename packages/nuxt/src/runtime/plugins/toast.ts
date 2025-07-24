import { ToastHandler } from 'maz-ui/plugins/toast'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(({ vueApp, $config }) => {
  const toastOptions = $config.public.mazUi?.plugins?.toast

  const options = typeof toastOptions === 'object' ? toastOptions : undefined

  const instance = new ToastHandler(vueApp, options)

  const toastServer = {
    show: (_message: string) => {},
    success: (_message: string) => {},
    error: (_message: string) => {},
    warning: (_message: string) => {},
    info: (_message: string) => {},
    message: (_message: string) => {},
  } as unknown as ToastHandler

  return {
    provide: {
      mazToast: import.meta.server ? toastServer : instance,
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazToast: ToastHandler
  }
}
