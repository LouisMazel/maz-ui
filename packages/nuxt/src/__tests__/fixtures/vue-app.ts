import { vi } from 'vitest'

/** A Vue app that installs the plugins it uses, with the translations ready */
export function createVueAppMock() {
  const app = {
    use: vi.fn((plugin: { install?: (...args: any[]) => unknown }, options?: unknown) => {
      plugin.install?.(app, options)
      return app
    }),
    provide: vi.fn(),
    config: {
      globalProperties: {
        $mazTranslations: { ready: Promise.resolve() },
      } as Record<string, any>,
    },
  }

  return app
}
