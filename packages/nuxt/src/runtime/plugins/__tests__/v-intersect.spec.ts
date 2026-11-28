import { describe, expect, it, vi } from 'vitest'

import vIntersectPlugin from '../v-intersect'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: {
    install: vi.fn(),
  },
}))

vi.mock('maz-ui/directives/vIntersect', () => ({
  vIntersectInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-intersect plugin', () => {
  it('should install vIntersect directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vIntersectPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
