import { beforeEach, describe, expect, it, vi } from 'vitest'

import aosPlugin from '../aos'

const { MockAosHandler, mockAosPlugin, mockRouter, aosInstances } = vi.hoisted(() => {
  const aosInstances: any[] = []
  class MockAosHandler {
    observe = vi.fn()
    constructor(...args: any[]) {
      aosInstances.push({ args, instance: this })
    }
  }
  return {
    MockAosHandler,
    aosInstances,
    mockAosPlugin: { install: vi.fn() },
    mockRouter: { push: vi.fn() },
  }
})

vi.mock('maz-ui/plugins/aos', () => ({
  AosPlugin: mockAosPlugin,
  AosHandler: MockAosHandler,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useRouter: vi.fn(() => mockRouter),
}))

describe('aos plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    aosInstances.length = 0
  })

  it('should install AosPlugin on the vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      $config: { public: { mazUi: { plugins: { aos: true } } } },
      vueApp,
    }

    const result = (aosPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalled()
    expect(result.provide.mazAos).toBeInstanceOf(MockAosHandler)
  })

  it('should pass options from config when aos is an object', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const aosOptions = { delay: 200, duration: 500 }
    const context = {
      $config: { public: { mazUi: { plugins: { aos: aosOptions } } } },
      vueApp,
    }

    ;(aosPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ delay: 200, duration: 500 }),
    )
  })

  it('should use router when router option is truthy', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      $config: { public: { mazUi: { plugins: { aos: { router: true } } } } },
      vueApp,
    }

    ;(aosPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ router: mockRouter }),
    )
  })

  it('should not use router when router option is falsy', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      $config: { public: { mazUi: { plugins: { aos: { router: false } } } } },
      vueApp,
    }

    ;(aosPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ router: undefined }),
    )
  })

  it('should pass empty options when aos is boolean true', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      $config: { public: { mazUi: { plugins: { aos: true } } } },
      vueApp,
    }

    ;(aosPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(expect.anything(), {})
  })
})
