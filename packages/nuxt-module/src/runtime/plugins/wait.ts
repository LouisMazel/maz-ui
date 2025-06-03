import { WaitHandler } from 'maz-ui/plugins'
import { defineNuxtPlugin } from '#imports'

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
      wait: import.meta.server ? waitServer : new WaitHandler(),
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $wait: WaitHandler
  }
}
