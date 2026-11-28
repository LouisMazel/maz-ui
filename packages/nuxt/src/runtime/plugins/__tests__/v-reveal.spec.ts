import { describe, expect, it, vi } from 'vitest'

import vRevealPlugin from '../v-reveal'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: {
    install: vi.fn(),
  },
}))

vi.mock('maz-ui/directives/vReveal', () => ({
  vRevealInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-reveal plugin', () => {
  it('should install vReveal directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }

    ;(vRevealPlugin as (...args: any[]) => any)({ vueApp })

    expect(mockUse).toHaveBeenCalledWith(mockInstall)
  })
})
