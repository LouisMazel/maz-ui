import { describe, expect, it, vi } from 'vitest'

import mazIconPathPlugin from '../maz-icon-path'

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('maz-icon-path plugin', () => {
  it('should provide mazIconPath from config', () => {
    const mockProvide = vi.fn()
    const vueApp = { provide: mockProvide }
    const context = {
      $config: { public: { mazUi: { general: { defaultMazIconPath: '/icons' } } } },
      vueApp,
    }

    const result = (mazIconPathPlugin as (...args: any[]) => any)(context)

    expect(mockProvide).toHaveBeenCalledWith('mazIconPath', '/icons')
    expect(result.provide.mazIconPath).toBe('/icons')
  })

  it('should provide undefined when no icon path configured', () => {
    const mockProvide = vi.fn()
    const vueApp = { provide: mockProvide }
    const context = {
      $config: { public: { mazUi: { general: {} } } },
      vueApp,
    }

    const result = (mazIconPathPlugin as (...args: any[]) => any)(context)

    expect(mockProvide).toHaveBeenCalledWith('mazIconPath', undefined)
    expect(result.provide.mazIconPath).toBeUndefined()
  })
})
