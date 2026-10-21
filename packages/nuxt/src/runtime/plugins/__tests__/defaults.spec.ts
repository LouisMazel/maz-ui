import { GLOBAL_CONFIG_INJECTION_KEY } from 'maz-ui/composables/useGlobalConfig'
import { describe, expect, it, vi } from 'vitest'

import defaultsPlugin from '../defaults'

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('defaults plugin', () => {
  it('provides the global config when defaults are set', () => {
    const provide = vi.fn()
    const defaults = { global: { roundedSize: 'lg' }, MazBtn: { roundedSize: 'full' } }
    const context = {
      vueApp: { provide },
      $config: { public: { mazUi: { defaults } } },
    }

    ;(defaultsPlugin as (...args: any[]) => any)(context)

    expect(provide).toHaveBeenCalledWith(GLOBAL_CONFIG_INJECTION_KEY, defaults)
  })

  it('does not provide anything when defaults are empty', () => {
    const provide = vi.fn()
    const context = {
      vueApp: { provide },
      $config: { public: { mazUi: { defaults: {} } } },
    }

    ;(defaultsPlugin as (...args: any[]) => any)(context)

    expect(provide).not.toHaveBeenCalled()
  })

  it('does not provide anything when defaults are missing', () => {
    const provide = vi.fn()
    const context = {
      vueApp: { provide },
      $config: { public: { mazUi: {} } },
    }

    ;(defaultsPlugin as (...args: any[]) => any)(context)

    expect(provide).not.toHaveBeenCalled()
  })
})
