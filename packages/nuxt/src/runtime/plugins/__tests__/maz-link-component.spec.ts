import { describe, expect, it, vi } from 'vitest'

import mazLinkComponentPlugin from '../maz-link-component'

const MockNuxtLink = { name: 'NuxtLink' }

vi.mock('#imports', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  defineNuxtLink: vi.fn(() => MockNuxtLink),
}))

describe('maz-link-component plugin', () => {
  describe('When the plugin is initialized', () => {
    it('Then it provides NuxtLink component via mazLinkComponent key', () => {
      const mockProvide = vi.fn()
      const vueApp = { provide: mockProvide }

      ;(mazLinkComponentPlugin as (...args: any[]) => any)({ vueApp })

      expect(mockProvide).toHaveBeenCalledWith('mazLinkComponent', MockNuxtLink)
    })
  })

  describe('When defineNuxtLink is called', () => {
    it('Then it is called with an empty options object', async () => {
      const { defineNuxtLink } = await import('#imports')
      const vueApp = { provide: vi.fn() }

      ;(mazLinkComponentPlugin as (...args: any[]) => any)({ vueApp })

      expect(defineNuxtLink).toHaveBeenCalledWith({})
    })
  })
})
