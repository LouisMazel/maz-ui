import type { AosHandler, AosOptions } from 'maz-ui/plugins/aos'
import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin(async ({ $config, vueApp }) => {
  const { AosHandler, AosPlugin } = await import('maz-ui/plugins/aos')

  const aosOptions = $config.public.mazUi?.plugins?.aos

  const options: AosOptions
    = typeof aosOptions === 'object'
      ? { ...aosOptions, router: aosOptions.router ? useRouter() : undefined }
      : {}

  vueApp.use(AosPlugin, options)

  return {
    provide: {
      mazAos: new AosHandler(options),
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazAos: AosHandler
  }
}
