import { describe, expect, it, vi } from 'vitest'

import vTooltipPlugin from '../v-tooltip'

const { mockInstall } = vi.hoisted(() => ({
  mockInstall: { install: vi.fn() },
}))

vi.mock('maz-ui/directives/vTooltip', () => ({
  vTooltipInstall: mockInstall,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
}))

describe('v-tooltip plugin', () => {
  it('should install vTooltip directive on vue app', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const context = {
      vueApp,
      $config: { public: { mazUi: { directives: { vTooltip: true } } } },
    }

    ;(vTooltipPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(mockInstall, undefined)
  })

  it('should pass options when vTooltip config is an object', () => {
    const mockUse = vi.fn()
    const vueApp = { use: mockUse }
    const tooltipOptions = { position: 'top' }
    const context = {
      vueApp,
      $config: { public: { mazUi: { directives: { vTooltip: tooltipOptions } } } },
    }

    ;(vTooltipPlugin as (...args: any[]) => any)(context)

    expect(mockUse).toHaveBeenCalledWith(mockInstall, tooltipOptions)
  })
})
