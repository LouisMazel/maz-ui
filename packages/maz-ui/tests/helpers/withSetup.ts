import type { App } from 'vue'
import { createApp } from 'vue'

/**
 * Helper function to test composables within a Vue app setup context
 * Supports providers for dependency injection and proper TypeScript typing
 */
export function withSetup<T extends () => unknown>(
  composable: T,
  providers?: Record<string, any>,
): [ReturnType<T>, App<Element>] {
  let result: any
  const app = createApp({
    setup() {
      result = composable()
      return {}
    },
    template: '<div></div>',
  })

  // Apply providers if any
  if (providers) {
    Object.entries(providers).forEach(([key, value]) => {
      app.provide(key, value)
    })
  }

  app.mount(document.createElement('div'))
  return [result, app]
}
