import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createVueAppMock } from '../../../__tests__/fixtures/vue-app'
import mazUiPlugin from '../maz-ui'

const { mockInstall, mockRouter, mockAosInstance, flags, externalOpener } = vi.hoisted(() => ({
  externalOpener: { fn: undefined as undefined | (() => void) },
  mockInstall: vi.fn(),
  mockRouter: { afterEach: vi.fn() },
  mockAosInstance: { runAnimations: vi.fn() },
  flags: { loader: undefined as undefined | ((code: string) => Promise<string | undefined>) },
}))

vi.mock('maz-ui/plugins/maz-ui', () => ({
  MazUi: { install: mockInstall },
  getMotionClasses: (motion?: string) => (motion && motion !== 'auto' ? [`m-motion-${motion}`] : []),
}))

vi.mock('maz-ui/plugins/aos', () => ({
  getAosInstance: () => mockAosInstance,
}))

vi.mock('#build/maz-ui-flags.mjs', () => ({
  get default() {
    return flags.loader
  },
}))

vi.mock('#build/maz-ui-open-external.mjs', () => ({
  get default() {
    return externalOpener.fn
  },
}))

vi.mock('@maz-ui/themes/utils', () => ({
  getSystemColorMode: vi.fn(() => 'light'),
  resolveThemeContext: vi.fn(() => Promise.resolve({ preset: { name: 'maz-ui' }, colorMode: 'auto', isDark: false, presetBase: 'maz-ui' })),
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useHead: vi.fn(),
  useRequestHeaders: vi.fn(),
  useRouter: () => mockRouter,
}))

async function runPlugin(mazUi: Record<string, unknown> = {}) {
  const vueApp = createVueAppMock()
  const result = await (mazUiPlugin as (...args: any[]) => any)({
    vueApp,
    $config: {
      public: { mazUi },
    },
  })

  return {
    options: mockInstall.mock.lastCall?.[1],
    result,
  }
}

describe('maz-ui plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    flags.loader = undefined
    externalOpener.fn = undefined
  })

  describe('given the openExternal template', () => {
    describe('when it exports a function', () => {
      it('then it is given to the MazUi plugin', async () => {
        externalOpener.fn = vi.fn()

        const { options } = await runPlugin({})

        expect(options.openExternal).toBe(externalOpener.fn)
      })
    })

    describe('when it exports nothing', () => {
      it('then no opener is given', async () => {
        const { options } = await runPlugin({})

        expect(options.openExternal).toBeUndefined()
      })
    })
  })

  describe('given toast and dialog options', () => {
    describe('when the plugin runs', () => {
      it('then they are given to the MazUi plugin', async () => {
        const toast = { position: 'top-right' }
        const dialog = { acceptText: 'Yes' }

        const { options } = await runPlugin({ toast, dialog })

        expect(options.toast).toBe(toast)
        expect(options.dialog).toBe(dialog)
      })
    })
  })

  describe('given the translations messages of the module template', () => {
    describe('when the plugin runs', () => {
      it('then they are given with the translations options', async () => {
        const { options } = await runPlugin({ translations: { locale: 'fr' } })

        expect(options.translations).toMatchObject({ locale: 'fr', messages: expect.any(Object) })
      })
    })
  })

  describe('given defaults', () => {
    describe('when they are empty', () => {
      it('then no defaults are given', async () => {
        const { options } = await runPlugin({ defaults: {} })

        expect(options.defaults).toBeUndefined()
      })
    })

    describe('when they are set', () => {
      it('then they are given as is', async () => {
        const defaults = { global: { roundedSize: 'lg' } }

        const { options } = await runPlugin({ defaults })

        expect(options.defaults).toBe(defaults)
      })
    })

    describe('when the local flags are enabled', () => {
      it('then the global flag source is the loader of the flags, after the other defaults', async () => {
        flags.loader = vi.fn(() => Promise.resolve('svg'))

        const { options } = await runPlugin({ defaults: { global: { roundedSize: 'lg' }, MazBtn: { size: 'sm' } } })

        expect(options.defaults).toEqual({
          global: { flagSrc: flags.loader, roundedSize: 'lg' },
          MazBtn: { size: 'sm' },
        })
      })
    })

    describe('when the local flags are enabled and a global flag source is set in defaults', () => {
      it('then the flag source of the defaults wins', async () => {
        flags.loader = vi.fn(() => Promise.resolve('svg'))

        const { options } = await runPlugin({ defaults: { global: { flagSrc: '/mine/{code}.svg' } } })

        expect(options.defaults.global.flagSrc).toBe('/mine/{code}.svg')
      })
    })

    describe('when the local flags are enabled without other defaults', () => {
      it('then only the flag source is given', async () => {
        flags.loader = vi.fn(() => Promise.resolve('svg'))

        const { options } = await runPlugin()

        expect(options.defaults).toEqual({ global: { flagSrc: flags.loader } })
      })
    })
  })

  describe('given aos', () => {
    describe('when it is disabled', () => {
      it('then aos is not installed', async () => {
        const { options } = await runPlugin({ aos: false })

        expect(options.aos).toBe(false)
      })
    })

    describe('when it is enabled', () => {
      it('then aos is installed without router', async () => {
        const { options } = await runPlugin({ aos: true })

        expect(options.aos).toEqual({ router: undefined })
      })
    })

    describe('when it has options and the router', () => {
      it('then the options are given with the router of the app, without the module options', async () => {
        const { options } = await runPlugin({ aos: { delay: 200, injectCss: false, router: true } })

        expect(options.aos).toEqual({ delay: 200, router: mockRouter })
      })
    })
  })

  describe('given the deprecated plugins.aos option', () => {
    describe('when the plugin runs', () => {
      it('then $mazAos is provided', async () => {
        const { result } = await runPlugin({ aos: true, plugins: { aos: true } })

        expect(result.provide).toEqual({ mazAos: mockAosInstance })
      })
    })
  })

  describe('given the aos option', () => {
    describe('when the plugin runs', () => {
      it('then nothing is provided', async () => {
        const { result } = await runPlugin({ aos: true })

        expect(result.provide).toEqual({})
      })
    })
  })
})
