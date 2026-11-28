import type { WaitHandler } from 'maz-ui/plugins/wait'
import { defineNuxtPlugin } from 'nuxt/app'

const waitServer = {
  loaders: { value: [] },
  anyLoading: { value: false },
  isLoading: () => false,
  stop: () => {},
  start: () => {},
} as unknown as WaitHandler

// Removed in v6 (plans/ROADMAP.md): plugin of the deprecated `plugins.wait` option, for `$mazWait`
export default defineNuxtPlugin(async () => {
  if (import.meta.server) {
    return {
      provide: {
        mazWait: waitServer,
      },
    }
  }

  // The handler of `useWait()`
  const { waitInstance } = await import('maz-ui/plugins/wait')

  return {
    provide: {
      mazWait: waitInstance,
    },
  }
})

declare module 'nuxt/app' {
  interface NuxtApp {
    /**
     * @deprecated use `useWait()`, removed in v6
     */
    $mazWait: WaitHandler
  }
}
