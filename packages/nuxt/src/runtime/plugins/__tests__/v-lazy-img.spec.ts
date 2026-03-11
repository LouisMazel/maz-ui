import { describe, expect, it, vi } from 'vitest'

import vLazyImgPlugin from '../v-lazy-img'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: { install: vi.fn() },
}))

vi.mock('maz-ui/directives/vLazyImg', () => ({
  vLazyImgInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-lazy-img plugin', () => {
  it('should install vLazyImg directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      vueApp,
      $config: { public: { mazUi: { directives: { vLazyImg: true } } } },
    }

    ;(vLazyImgPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(mockInstall, undefined)
  })

  it('should pass options when vLazyImg config is an object', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const lazyImgOptions = { baseClass: 'lazy' }
    const context = {
      vueApp,
      $config: { public: { mazUi: { directives: { vLazyImg: lazyImgOptions } } } },
    }

    ;(vLazyImgPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(mockInstall, lazyImgOptions)
  })
})
