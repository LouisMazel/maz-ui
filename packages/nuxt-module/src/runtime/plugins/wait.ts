import { WaitHandler } from 'maz-ui/src/plugins/wait'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const waitServer = {
    loaders: { value: [] },
    anyLoading: { value: false },
    isLoading: () => console.log('[SSR] Is Loading'),
    stop: () => console.log('[SSR] Stop'),
    start: () => console.log('[SSR] Start'),
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
