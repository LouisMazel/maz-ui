import { describe, expect, it, vi } from 'vitest'

import vRipplePlugin from '../v-ripple'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: {
    install: vi.fn(),
  },
}))

vi.mock('maz-ui/directives/vRipple', () => ({
  vRippleInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-ripple plugin', () => {
  it('should install vRipple directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vRipplePlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
