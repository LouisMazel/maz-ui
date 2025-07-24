import { WaitHandler } from 'maz-ui/plugins/wait'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const waitServer = {
    loaders: { value: [] },
    anyLoading: { value: false },
    isLoading: () => false,
    stop: () => {},
    start: () => {},
  } as unknown as WaitHandler

  return {
    provide: {
      mazWait: import.meta.server ? waitServer : new WaitHandler(),
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazWait: WaitHandler
  }
}
