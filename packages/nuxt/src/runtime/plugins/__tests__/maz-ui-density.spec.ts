import { useHead } from 'nuxt/app'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createVueAppMock } from '../../../__tests__/fixtures/vue-app'
import mazUiPlugin from '../maz-ui'

const { mockInstall } = vi.hoisted(() => ({ mockInstall: vi.fn() }))

vi.mock('maz-ui/plugins/maz-ui', () => ({
  MazUi: { install: mockInstall },
  getMotionClasses: (motion?: string) => (motion && motion !== 'auto' ? [`m-motion-${motion}`] : []),
}))

vi.mock('maz-ui/plugins/aos', () => ({ getAosInstance: () => ({}) }))
vi.mock('#build/maz-ui-flags.mjs', () => ({ default: undefined }))
vi.mock('#build/maz-ui-open-external.mjs', () => ({ default: undefined }))

vi.mock('@maz-ui/themes/utils', () => ({
  getSystemColorMode: vi.fn(() => 'light'),
  resolveThemeContext: vi.fn(() => Promise.resolve({ preset: { name: 'maz-ui' }, colorMode: 'auto', isDark: false, presetBase: 'maz-ui' })),
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useHead: vi.fn(),
  useRequestHeaders: vi.fn(),
  useRouter: () => ({ afterEach: vi.fn() }),
}))

async function runPlugin(mazUi: Record<string, unknown> = {}) {
  await (mazUiPlugin as (...args: any[]) => any)({
    vueApp: createVueAppMock(),
    $config: { public: { mazUi } },
  })

  return mockInstall.mock.lastCall?.[1]
}

describe('given the density option of the Nuxt plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the density is compact', () => {
    it('then the server renders the compact class on html', async () => {
      await runPlugin({ density: 'compact' })

      expect(useHead).toHaveBeenCalledWith({ htmlAttrs: { class: 'm-density-compact' } })
    })

    it('then the option is given to the MazUi plugin', async () => {
      const options = await runPlugin({ density: 'compact' })

      expect(options.density).toBe('compact')
    })
  })

  describe('when the density is compact and the motion is reduced', () => {
    it('then the html element gets both classes in one attribute', async () => {
      await runPlugin({ density: 'compact', motion: 'reduced' })

      expect(useHead).toHaveBeenCalledWith({ htmlAttrs: { class: 'm-motion-reduced m-density-compact' } })
    })
  })

  describe('when the density is default', () => {
    it('then no class is rendered', async () => {
      await runPlugin({ density: 'default' })

      expect(useHead).not.toHaveBeenCalled()
    })
  })
})
