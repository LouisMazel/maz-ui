import { AosHandler, type AosOptions, AosPlugin } from 'maz-ui/plugins/aos'
import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin(({ $config, vueApp }) => {
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

declare module '#app' {
  interface NuxtApp {
    $mazAos: AosHandler
  }
}
