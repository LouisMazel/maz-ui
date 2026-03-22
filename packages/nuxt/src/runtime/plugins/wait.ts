import type { WaitHandler } from 'maz-ui/plugins/wait'
import { defineNuxtPlugin } from 'nuxt/app'

const waitServer = {
  loaders: { value: [] },
  anyLoading: { value: false },
  isLoading: () => false,
  stop: () => {},
  start: () => {},
} as unknown as WaitHandler

export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    return {
      provide: {
        mazWait: waitServer,
      },
    }
  }

  const { WaitHandler } = await import('maz-ui/plugins/wait')

  return {
    provide: {
      mazWait: new WaitHandler(),
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    $mazWait: WaitHandler
  }
}
