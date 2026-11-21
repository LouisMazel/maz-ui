import { describe, expect, it, vi } from 'vitest'

import waitPlugin from '../wait'

const { MockWaitHandler } = vi.hoisted(() => {
  class MockWaitHandler {
    loaders = { value: [] }
    anyLoading = { value: false }
    isLoading = vi.fn(() => false)
    stop = vi.fn()
    start = vi.fn()
  }
  return { MockWaitHandler }
})

vi.mock('maz-ui/plugins/wait', () => ({
  waitInstance: new MockWaitHandler(),
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('wait plugin', () => {
  it('should provide the wait handler of useWait in client mode (import.meta.server is false)', async () => {
    const { waitInstance } = await import('maz-ui/plugins/wait')

    const result = await (waitPlugin as (...args: any[]) => any)()

    expect(result.provide.mazWait).toBe(waitInstance)
  })
})
