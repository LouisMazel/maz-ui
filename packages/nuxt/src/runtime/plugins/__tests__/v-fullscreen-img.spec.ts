import { describe, expect, it, vi } from 'vitest'

import vFullscreenImgPlugin from '../v-fullscreen-img'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: { install: vi.fn() },
}))

vi.mock('maz-ui/directives/vFullscreenImg', () => ({
  vFullscreenImgInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-fullscreen-img plugin', () => {
  it('should install vFullscreenImg directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vFullscreenImgPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
