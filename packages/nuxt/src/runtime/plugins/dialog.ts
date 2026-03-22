import type { DialogHandler } from 'maz-ui/plugins/dialog'
import { defineNuxtPlugin } from 'nuxt/app'

const dialogServer = {
  open: () => {
    return {
      promise: Promise.resolve(),
      destroy: () => {},
      close: () => {},
    }
  },
} as unknown as DialogHandler

export default defineNuxtPlugin(async ({ vueApp, $config }) => {
  if (import.meta.server) {
    return {
      provide: {
        mazDialog: dialogServer,
      },
    }
  }

  const { DialogHandler } = await import('maz-ui/plugins/dialog')

  const dialogOptions = $config.public.mazUi?.plugins?.dialog
  const options = typeof dialogOptions === 'object' ? dialogOptions : undefined

  return {
    provide: {
      mazDialog: new DialogHandler(vueApp, options),
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazDialog: DialogHandler
  }
}
