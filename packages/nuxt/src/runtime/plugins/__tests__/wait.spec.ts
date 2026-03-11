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
  WaitHandler: MockWaitHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('wait plugin', () => {
  it('should provide mazWait as WaitHandler in client mode (import.meta.server is false)', () => {
    const result = (waitPlugin as (...args: any[]) => any)()

    expect(result.provide.mazWait).toBeInstanceOf(MockWaitHandler)
  })
})
