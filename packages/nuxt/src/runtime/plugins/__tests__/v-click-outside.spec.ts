import { describe, expect, it, vi } from 'vitest'

import vClickOutsidePlugin from '../v-click-outside'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: { install: vi.fn() },
}))

vi.mock('maz-ui/directives/vClickOutside', () => ({
  vClickOutsideInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-click-outside plugin', () => {
  it('should install vClickOutside directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vClickOutsidePlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
