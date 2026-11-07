import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import themePlugin from '../theme'

const { mockInstall, mockUseHead, mockGetSystemColorMode } = vi.hoisted(() => ({
  mockInstall: vi.fn(),
  mockUseHead: vi.fn(),
  mockGetSystemColorMode: vi.fn(() => 'light'),
}))

vi.mock('@maz-ui/themes/plugin', () => ({
  MazUiTheme: { install: mockInstall },
}))

vi.mock('@maz-ui/themes/utils', async importOriginal => ({
  ...await importOriginal<typeof import('@maz-ui/themes/utils')>(),
  getSystemColorMode: mockGetSystemColorMode,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useHead: (...args: any[]) => mockUseHead(...args),
  useRequestHeaders: vi.fn(),
}))

async function runPlugin(themeOptions: Record<string, any> = {}, cookie = '') {
  vi.stubGlobal('document', { cookie })
  vi.stubGlobal('window', {})
  const context = {
    vueApp: {},
    $config: {
      public: {
        mazUi: {
          theme: { preset: 'folio', ...themeOptions },
        },
      },
    },
  }
  await (themePlugin as (...args: any[]) => any)(context)

  return mockInstall.mock.lastCall?.[1]
}

describe('theme plugin (client)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSystemColorMode.mockReturnValue('light')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('given the plugin boots in the browser', () => {
    describe('when the theme is resolved', () => {
      it('then nothing is registered in the head so a navigation cannot re-apply the boot class', async () => {
        await runPlugin({ colorMode: 'dark' })

        expect(mockUseHead).not.toHaveBeenCalled()
      })
    })

    describe('when the color mode is auto and the system is dark', () => {
      it('then the live system preference wins over the system part of the cookie', async () => {
        mockGetSystemColorMode.mockReturnValue('dark')

        const install = await runPlugin({}, 'maz-color-mode=%3Alight')

        expect(install).toMatchObject({ _colorMode: 'auto', _isDark: true })
      })
    })

    describe('when the user chose a color mode', () => {
      it('then it is installed', async () => {
        const install = await runPlugin({ colorMode: 'auto' }, 'maz-color-mode=dark')

        expect(install).toMatchObject({ _colorMode: 'dark', _isDark: true })
      })
    })

    describe('when the preset cookie belongs to the configured preset', () => {
      it('then the switched preset is installed', async () => {
        const install = await runPlugin({}, 'maz-preset=folio%3Aocean')

        expect(install.preset.name).toBe('ocean')
        expect(install._presetBase).toBe('folio')
      })
    })

    describe('when the mode is dark only', () => {
      it('then the dark mode is installed', async () => {
        const install = await runPlugin({ mode: 'dark', colorMode: 'light' })

        expect(install._isDark).toBe(true)
      })
    })
  })
})
