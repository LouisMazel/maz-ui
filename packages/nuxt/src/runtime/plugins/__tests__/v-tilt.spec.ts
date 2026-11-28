import { describe, expect, it, vi } from 'vitest'

import vTiltPlugin from '../v-tilt'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: {
    install: vi.fn(),
  },
}))

vi.mock('maz-ui/directives/vTilt', () => ({
  vTiltInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-tilt plugin', () => {
  it('should install vTilt directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vTiltPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
