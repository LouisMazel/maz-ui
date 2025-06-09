import { type AosOptions, AosHandler, AosPlugin } from 'maz-ui/plugins/aos'
import { defineNuxtPlugin, useRouter } from 'nuxt/app'

export default defineNuxtPlugin(({ $config, vueApp }) => {
  const aosOptions = $config.public.mazUi?.composables?.useAos

  const options: AosOptions
    = typeof aosOptions === 'object'
      ? { ...aosOptions, router: aosOptions.router ? useRouter() : undefined }
      : {}

  vueApp.use(AosPlugin, options)

  return {
    provide: {
      aos: new AosHandler(options),
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $aos: AosHandler
  }
}
