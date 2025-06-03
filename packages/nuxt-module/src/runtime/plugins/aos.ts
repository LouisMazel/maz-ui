import { type AosOptions, AosHandler, installAos } from 'maz-ui/plugins'
import { defineNuxtPlugin, useRouter } from '#imports'

export default defineNuxtPlugin(({ $config, vueApp }) => {
  const aosOptions = $config.public.mazUi?.injectAos

  const options: AosOptions
    = typeof aosOptions === 'object'
      ? { ...aosOptions, router: aosOptions.router ? useRouter() : undefined }
      : {}

  vueApp.use(installAos, options)

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
