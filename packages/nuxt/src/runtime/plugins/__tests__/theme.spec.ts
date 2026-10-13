import { beforeEach, describe, expect, it, vi } from 'vitest'

import themePlugin from '../theme'

const { mockInstall, mockGetPreset, mockMergePresets, mockGenerateCSS, mockResolveColorSchemeContent, mockGetSystemColorMode, mockUseCookie, mockUseHead, mockUseRequestHeaders } = vi.hoisted(() => ({
  mockInstall: vi.fn(),
  mockGetPreset: vi.fn(() => Promise.resolve({ colors: {} })),
  mockMergePresets: vi.fn((_a: any, _b: any) => ({ colors: {}, merged: true })),
  mockGenerateCSS: vi.fn(() => '.maz { color: red }'),
  mockResolveColorSchemeContent: vi.fn(() => 'light dark'),
  mockGetSystemColorMode: vi.fn(() => 'light'),
  mockUseCookie: vi.fn(() => ({ value: undefined as string | undefined })),
  mockUseHead: vi.fn(),
  mockUseRequestHeaders: vi.fn(() => ({})),
}))

vi.mock('@maz-ui/themes/plugin', () => ({
  MazUiTheme: { install: mockInstall },
}))

vi.mock('@maz-ui/themes/utils', () => ({
  CSS_ID: 'maz-theme-css',
  generateCSS: mockGenerateCSS,
  getPreset: mockGetPreset,
  mergePresets: mockMergePresets,
  resolveColorSchemeContent: mockResolveColorSchemeContent,
}))

vi.mock('@maz-ui/themes/utils/get-color-mode', () => ({
  getSystemColorMode: mockGetSystemColorMode,
}))

vi.mock('nuxt/app', () => ({
  defineNuxtPlugin: vi.fn((fn: (...args: any[]) => any) => fn),
  // @ts-expect-error - test
  useCookie: (...args: any[]) => mockUseCookie(...args),
  useHead: (...args: any[]) => mockUseHead(...args),
  // @ts-expect-error - test
  useRequestHeaders: (...args: any[]) => mockUseRequestHeaders(...args),
}))

describe('theme plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPreset.mockResolvedValue({ colors: {} })
    mockUseCookie.mockReturnValue({ value: undefined })
    mockGetSystemColorMode.mockReturnValue('light')
  })

  function createContext(themeOptions: Record<string, any> = {}) {
    return {
      vueApp: {},
      $config: {
        public: {
          mazUi: {
            theme: {
              preset: 'maz-ui',
              strategy: 'runtime',
              darkModeStrategy: 'class',
              colorMode: 'auto',
              mode: 'both',
              ...themeOptions,
            },
          },
        },
      },
    }
  }

  it('should call getPreset with the preset name', async () => {
    const context = createContext({ preset: 'custom-preset' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith('custom-preset')
  })

  it('should merge presets when overrides are provided', async () => {
    const overrides = { colors: { primary: '#ff0000' } }
    const context = createContext({ overrides })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockMergePresets).toHaveBeenCalledWith({ colors: {} }, overrides)
  })

  it('should not merge presets when no overrides', async () => {
    const context = createContext()
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockMergePresets).not.toHaveBeenCalled()
  })

  it('should install MazUiTheme on the vueApp', async () => {
    const context = createContext()
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        strategy: 'runtime',
        darkClass: 'dark',
        darkModeStrategy: 'class',
      }),
    )
  })

  it('should use saved color mode from cookie when available', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
      return { value: name === 'maz-color-mode' ? 'dark' : undefined }
    }) as any)
    const context = createContext({ colorMode: 'auto' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        colorMode: 'dark',
      }),
    )
  })

  it('does not register htmlAttrs class via useHead on client when colorMode is dark', async () => {
    const context = createContext({ colorMode: 'dark', darkModeStrategy: 'class' })
    await (themePlugin as (...args: any[]) => any)(context)
    const htmlAttrsCalls = mockUseHead.mock.calls.filter(
      ([arg]) => arg.htmlAttrs?.class !== undefined,
    )
    expect(htmlAttrsCalls).toHaveLength(0)
  })

  it('does not register htmlAttrs class via useHead on client when colorMode is light', async () => {
    const context = createContext({ colorMode: 'light' })
    await (themePlugin as (...args: any[]) => any)(context)
    const htmlAttrsCalls = mockUseHead.mock.calls.filter(
      ([arg]) => arg.htmlAttrs?.class !== undefined,
    )
    expect(htmlAttrsCalls).toHaveLength(0)
  })

  it('detects dark mode from system when colorMode is auto on client and forwards isDark to install', async () => {
    mockGetSystemColorMode.mockReturnValue('dark')
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({ _isDark: true }),
    )
    const htmlAttrsCalls = mockUseHead.mock.calls.filter(
      ([arg]) => arg.htmlAttrs?.class !== undefined,
    )
    expect(htmlAttrsCalls).toHaveLength(0)
  })

  it('should set isDark true when mode is dark', async () => {
    const context = createContext({ colorMode: 'light', mode: 'dark' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        _isDark: true,
      }),
    )
  })

  it('should use cookie color mode for getSavedColorMode', async () => {
    mockUseCookie.mockReturnValue({ value: 'light' })
    const context = createContext({ colorMode: 'auto' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseCookie).toHaveBeenCalledWith('maz-color-mode')
  })

  it('should ignore invalid cookie values in getSavedColorMode', async () => {
    mockUseCookie.mockReturnValue({ value: 'invalid' })
    const context = createContext({ colorMode: 'auto' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        colorMode: 'auto',
      }),
    )
  })

  it('ignores a stale resolved color mode cookie on the client and follows the live system dark preference', async () => {
    mockGetSystemColorMode.mockReturnValue('dark')
    mockUseCookie.mockImplementation(((name: string) => {
      if (name === 'maz-color-mode') {
        return { value: 'auto' }
      }
      if (name === 'maz-resolved-color-mode') {
        return { value: 'light' }
      }
      return { value: undefined }
    }) as any)
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({ _isDark: true }),
    )
  })

  it('follows the live system light preference on the client even when the resolved cookie is dark', async () => {
    mockGetSystemColorMode.mockReturnValue('light')
    mockUseCookie.mockImplementation(((name: string) => {
      if (name === 'maz-resolved-color-mode') {
        return { value: 'dark' }
      }
      return { value: undefined }
    }) as any)
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        _isDark: false,
      }),
    )
  })

  it('should restore a scoped switch when the cookie base matches the resolved default', async () => {
    const presetCookie: { value: string | null } = { value: 'maz-ui:nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset
      .mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
      .mockResolvedValueOnce({ name: 'nova', colors: {} } as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenNthCalledWith(1, undefined)
    expect(mockGetPreset).toHaveBeenNthCalledWith(2, 'nova')
    expect(presetCookie.value).toBe('maz-ui:nova')
  })

  it('should restore a scoped switch for the configured string preset', async () => {
    const presetCookie: { value: string | null } = { value: 'maz-ui:nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset
      .mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
      .mockResolvedValueOnce({ name: 'nova', colors: {} } as any)
    const context = createContext({ preset: 'maz-ui' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith('nova')
  })

  it('should keep the custom preset object when a foreign cookie targets another base', async () => {
    const presetCookie: { value: string | null } = { value: 'other-app:nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    const customPreset = { name: 'custom-app-theme', colors: {} } as any
    const context = createContext({ preset: customPreset })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).not.toHaveBeenCalled()
    expect(presetCookie.value).toBe('custom-app-theme:custom-app-theme')
  })

  it('should keep the configured string preset when a foreign cookie targets another base', async () => {
    const presetCookie: { value: string | null } = { value: 'other-app:nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset.mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
    const context = createContext({ preset: 'maz-ui' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).not.toHaveBeenCalledWith('nova')
    expect(presetCookie.value).toBe('maz-ui:maz-ui')
  })

  it('should heal the cookie to the object base when the scoped active fails to resolve', async () => {
    const presetCookie: { value: string | null } = { value: 'custom-app-theme:unknown' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset.mockRejectedValueOnce(new Error('not found'))
    const customPreset = { name: 'custom-app-theme', colors: {} } as any
    const context = createContext({ preset: customPreset })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith('unknown')
    expect(presetCookie.value).toBe('custom-app-theme:custom-app-theme')
  })

  it('should fall back to the resolved default when the scoped active fails to resolve', async () => {
    const presetCookie: { value: string | null } = { value: 'maz-ui:unknown' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset
      .mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
      .mockRejectedValueOnce(new Error('not found'))
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenNthCalledWith(1, undefined)
    expect(mockGetPreset).toHaveBeenNthCalledWith(2, 'unknown')
    expect(presetCookie.value).toBe('maz-ui:maz-ui')
  })

  it('should rethrow the resolution error when the configured preset cannot be resolved', async () => {
    mockUseCookie.mockReturnValue({ value: undefined })
    mockGetPreset.mockRejectedValueOnce(new Error('boom'))
    const context = createContext({ preset: 'broken' })
    await expect((themePlugin as (...args: any[]) => any)(context)).rejects.toThrow('boom')
  })

  it('should ignore a maz-preset cookie with an empty base segment', async () => {
    const presetCookie: { value: string | null } = { value: ':nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset.mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith(undefined)
    expect(mockGetPreset).not.toHaveBeenCalledWith('nova')
    expect(presetCookie.value).toBe('maz-ui:maz-ui')
  })

  it('should ignore a legacy plain-name maz-preset cookie value', async () => {
    const presetCookie: { value: string | null } = { value: 'nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset.mockResolvedValueOnce({ name: 'maz-ui', colors: {} } as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith(undefined)
    expect(mockGetPreset).not.toHaveBeenCalledWith('nova')
    expect(presetCookie.value).toBe('maz-ui:maz-ui')
  })

  it('should default colorMode to auto when neither cookie nor options provide one', async () => {
    mockUseCookie.mockReturnValue({ value: undefined })
    const context = createContext({ colorMode: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({ colorMode: 'auto' }),
    )
  })

  it('should skip the lookup when the scoped cookie active matches the preset object base', async () => {
    const presetCookie: { value: string | null } = { value: 'custom-app-theme:custom-app-theme' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    const customPreset = { name: 'custom-app-theme', colors: {} } as any
    const context = createContext({ preset: customPreset })
    await (themePlugin as (...args: any[]) => any)(context)
    // No getPreset call: object IS the preset and no switch is persisted.
    expect(mockGetPreset).not.toHaveBeenCalled()
  })

  it('should skip cookie read and write when persistPreset is false', async () => {
    const presetCookie: { value: string | null } = { value: 'nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    const context = createContext({ preset: undefined, persistPreset: false })
    await (themePlugin as (...args: any[]) => any)(context)
    // Cookie value untouched (no read used it, no write replaced it).
    expect(presetCookie.value).toBe('nova')
    // The cookie value was NOT used as preset name to resolve.
    expect(mockGetPreset).not.toHaveBeenCalledWith('nova')
  })

  describe('Given the plugin boots on the client with darkModeStrategy class', () => {
    describe.each([
      { label: 'colorMode dark', themeOptions: { colorMode: 'dark', mode: 'both' } },
      { label: 'colorMode auto with system dark', themeOptions: { colorMode: 'auto', mode: 'both' }, systemColorMode: 'dark' as const },
      { label: 'mode dark', themeOptions: { colorMode: 'light', mode: 'dark' } },
    ])('When isDark resolves to true via $label', ({ themeOptions, systemColorMode }) => {
      it('Then no htmlAttrs entry is registered via useHead so navigation cannot re-apply the boot class', async () => {
        if (systemColorMode) {
          mockGetSystemColorMode.mockReturnValue(systemColorMode)
        }

        const context = createContext(themeOptions)
        await (themePlugin as (...args: any[]) => any)(context)

        const htmlAttrsCalls = mockUseHead.mock.calls.filter(
          ([arg]) => arg.htmlAttrs !== undefined,
        )
        expect(htmlAttrsCalls).toHaveLength(0)
      })
    })
  })
})
