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

// Removed in v6 (plans/ROADMAP.md): plugin of the deprecated `plugins.dialog` option, for `$mazDialog`
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
  const options = typeof dialogOptions === 'object'
    ? dialogOptions
    : undefined

  const mazDialog = new DialogHandler(vueApp, options)
  // `useDialog()` uses the same handler
  vueApp.provide('mazDialog', mazDialog)

  return {
    provide: {
      mazDialog,
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    /**
     * @deprecated use `useDialog()`, removed in v6
     */
    $mazDialog: DialogHandler
  }
}
