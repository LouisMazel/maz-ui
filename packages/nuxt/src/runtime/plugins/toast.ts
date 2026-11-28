import type { ToastHandler } from 'maz-ui/plugins/toast'
import { defineNuxtPlugin } from 'nuxt/app'

const toastServer = {
  show: (_message: string) => {},
  success: (_message: string) => {},
  error: (_message: string) => {},
  warning: (_message: string) => {},
  info: (_message: string) => {},
  message: (_message: string) => {},
} as unknown as ToastHandler

// Removed in v6 (plans/ROADMAP.md): plugin of the deprecated `plugins.toast` option, for `$mazToast`
export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  if (import.meta.server) {
    return {
      provide: {
        mazToast: toastServer,
      },
    }
  }

  const { ToastHandler } = await import('maz-ui/plugins/toast')

  const toastOptions = $config.public.mazUi?.plugins?.toast
  const options = typeof toastOptions === 'object'
    ? toastOptions
    : undefined

  const mazToast = new ToastHandler(vueApp, options)
  // `useToast()` uses the same handler
  vueApp.provide('mazToast', mazToast)

  return {
    provide: {
      mazToast,
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    /**
     * @deprecated use `useToast()`, removed in v6
     */
    $mazToast: ToastHandler
  }
}
