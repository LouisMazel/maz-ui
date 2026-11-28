import { describe, expect, it, vi } from 'vitest'

import vMagneticPlugin from '../v-magnetic'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: {
    install: vi.fn(),
  },
}))

vi.mock('maz-ui/directives/vMagnetic', () => ({
  vMagneticInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-magnetic plugin', () => {
  it('should install vMagnetic directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vMagneticPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
