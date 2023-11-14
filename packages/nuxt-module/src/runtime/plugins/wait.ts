import { defineNuxtPlugin } from '#imports'
import { WaitHandler } from 'maz-ui'

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
      wait: process.server ? waitServer : new WaitHandler(),
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $wait: WaitHandler
  }
}
