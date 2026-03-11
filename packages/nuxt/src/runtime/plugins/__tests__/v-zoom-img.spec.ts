import { describe, expect, it, vi } from 'vitest'

import vZoomImgPlugin from '../v-zoom-img'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: { install: vi.fn() },
}))

vi.mock('maz-ui/directives/vZoomImg', () => ({
  vZoomImgInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-zoom-img plugin', () => {
  it('should install vZoomImg directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vZoomImgPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
