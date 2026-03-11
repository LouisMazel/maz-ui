import { describe, expect, it, vi } from 'vitest'

import waitPlugin from '../wait'

const { MockWaitHandler } = vi.hoisted(() => {
  class MockWaitHandler {
    start = vi.fn()
    stop = vi.fn()
  }
  return { MockWaitHandler }
})

vi.mock('maz-ui/plugins/wait', () => ({
  WaitHandler: MockWaitHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('wait plugin (server)', () => {
  it('should provide server stub on server', () => {
    const result = (waitPlugin as (...args: any[]) => any)()

    const stub = result.provide.mazWait
    expect(stub).not.toBeInstanceOf(MockWaitHandler)
    expect(stub.loaders).toEqual({ value: [] })
    expect(stub.anyLoading).toEqual({ value: false })
    expect(stub.isLoading()).toBe(false)
    stub.stop()
    stub.start()
  })
})
