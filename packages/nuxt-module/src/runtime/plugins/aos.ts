import { defineNuxtPlugin, useRouter } from '#imports'
import { type AosOptions, AosHandler } from 'maz-ui'

export default defineNuxtPlugin(({ $config }) => {
  const aosOptions = $config.public.mazUi?.injectAos

  const options: AosOptions =
    typeof aosOptions === 'object'
      ? { ...aosOptions, router: aosOptions.router ? useRouter() : undefined }
      : {}

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
