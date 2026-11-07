import { beforeEach, describe, expect, it, vi } from 'vitest'

import themePlugin from '../theme'

const { mockInstall, mockUseHead, mockUseRequestHeaders } = vi.hoisted(() => ({
  mockInstall: vi.fn(),
  mockUseHead: vi.fn(),
  mockUseRequestHeaders: vi.fn(() => ({} as Record<string, string>)),
}))

vi.mock('@maz-ui/themes/plugin', () => ({
  MazUiTheme: { install: mockInstall },
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  useHead: (...args: any[]) => mockUseHead(...args),
  // @ts-expect-error - test
  useRequestHeaders: (...args: any[]) => mockUseRequestHeaders(...args),
}))

function createContext(themeOptions: Record<string, any> = {}) {
  return {
    vueApp: {},
    $config: {
      public: {
        mazUi: {
          theme: {
            preset: 'folio',
            ...themeOptions,
          },
        },
      },
    },
  }
}

async function runPlugin(themeOptions: Record<string, any> = {}, headers: Record<string, string> = {}) {
  mockUseRequestHeaders.mockReturnValue(headers)
  const context = createContext(themeOptions)
  await (themePlugin as (...args: any[]) => any)(context)

  return {
    head: mockUseHead.mock.lastCall?.[0],
    install: mockInstall.mock.lastCall?.[1],
  }
}

describe('theme plugin (server)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('given a request without cookie nor client hint', () => {
    describe('when the plugin renders the page', () => {
      it('then it reads only the theme headers of the request', async () => {
        await runPlugin()

        expect(mockUseRequestHeaders).toHaveBeenCalledWith(['cookie', 'sec-ch-prefers-color-scheme'])
      })

      it('then it renders the CSS, the meta, the client hint request and the blocking script without class', async () => {
        const { head } = await runPlugin()

        expect(head.htmlAttrs).toEqual({})
        expect(head.style).toEqual([
          {
            id: 'maz-theme-css',
            innerHTML: expect.stringContaining(':root'),
          },
        ])
        expect(head.meta).toEqual([
          { name: 'color-scheme', content: 'light dark', id: 'maz-color-scheme' },
          { 'http-equiv': 'Accept-CH', 'content': 'Sec-CH-Prefers-Color-Scheme', 'id': 'maz-color-http-accept-ch' },
        ])
        expect(head.script).toEqual([
          {
            id: 'maz-color-mode-blocking',
            innerHTML: expect.stringContaining('maz-color-mode'),
            tagPosition: 'head',
          },
        ])
      })

      it('then it installs the configured preset', async () => {
        const { install } = await runPlugin()

        expect(install.preset.name).toBe('folio')
        expect(install).toMatchObject({ _presetBase: 'folio', _colorMode: 'auto', _isDark: false })
      })
    })
  })

  describe('given no theme config', () => {
    describe('when the plugin renders the page', () => {
      it('then it installs the default preset', async () => {
        await (themePlugin as (...args: any[]) => any)({
          vueApp: {},
          $config: {
            public: { mazUi: {} },
          },
        })

        expect(mockInstall.mock.lastCall?.[1]).toMatchObject({ _presetBase: 'maz-ui', _colorMode: 'auto' })
      })
    })
  })

  describe('given the dark client hint', () => {
    describe('when the color mode is auto', () => {
      it('then the page is rendered dark', async () => {
        const { head, install } = await runPlugin({}, { 'sec-ch-prefers-color-scheme': 'dark' })

        expect(head.htmlAttrs).toEqual({ class: 'dark' })
        expect(install._isDark).toBe(true)
      })
    })
  })

  describe('given the system part of the color mode cookie', () => {
    describe('when the color mode is auto', () => {
      it('then the page is rendered with it', async () => {
        const { head } = await runPlugin({}, { cookie: 'maz-color-mode=%3Adark' })

        expect(head.htmlAttrs).toEqual({ class: 'dark' })
      })
    })
  })

  describe('given a color mode chosen by the user', () => {
    describe('when the system is dark', () => {
      it('then the choice wins and no client hint is requested', async () => {
        const { head, install } = await runPlugin({}, {
          'cookie': 'maz-color-mode=light%3Adark',
          'sec-ch-prefers-color-scheme': 'dark',
        })

        expect(head.htmlAttrs).toEqual({ class: 'light' })
        expect(head.meta).toEqual([
          { name: 'color-scheme', content: 'light', id: 'maz-color-scheme' },
        ])
        expect(install).toMatchObject({ _colorMode: 'light', _isDark: false })
      })
    })
  })

  describe('given a preset switched at runtime', () => {
    describe('when the cookie belongs to the configured preset', () => {
      it('then the switched preset is rendered and installed', async () => {
        const { install } = await runPlugin({}, { cookie: 'maz-preset=folio%3Aocean' })

        expect(install.preset.name).toBe('ocean')
        expect(install._presetBase).toBe('folio')
      })
    })

    describe('when the cookie belongs to another app', () => {
      it('then the configured preset is kept', async () => {
        const { install } = await runPlugin({}, { cookie: 'maz-preset=nova%3Aocean' })

        expect(install.preset.name).toBe('folio')
      })
    })

    describe('when persistPreset is disabled', () => {
      it('then the cookie is ignored', async () => {
        const { install } = await runPlugin({ persistPreset: false }, { cookie: 'maz-preset=folio%3Aocean' })

        expect(install.preset.name).toBe('folio')
      })
    })
  })

  describe('given overrides', () => {
    describe('when the plugin renders the page', () => {
      it('then they are merged into the installed preset', async () => {
        const { install } = await runPlugin({
          overrides: {
            foundation: { 'border-width': '3px' },
          },
        })

        expect(install.preset.foundation['border-width']).toBe('3px')
      })
    })
  })

  describe('given the buildtime strategy', () => {
    describe('when the plugin renders the page', () => {
      it('then no CSS is rendered', async () => {
        const { head, install } = await runPlugin({ strategy: 'buildtime' })

        expect(head.style).toEqual([])
        expect(install._presetBase).toBe('folio')
      })
    })
  })

  describe('given the media dark mode strategy', () => {
    describe('when the system is dark', () => {
      it('then no class nor script is rendered', async () => {
        const { head } = await runPlugin({ darkModeStrategy: 'media' }, { 'sec-ch-prefers-color-scheme': 'dark' })

        expect(head.htmlAttrs).toEqual({})
        expect(head.script).toEqual([])
      })
    })
  })
})
