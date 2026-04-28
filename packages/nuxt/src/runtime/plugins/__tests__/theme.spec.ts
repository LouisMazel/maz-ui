import { beforeEach, describe, expect, it, vi } from 'vitest'

import themePlugin from '../theme'

const { mockInstall, mockGetPreset, mockMergePresets, mockGenerateCSS, mockGetSystemColorMode, mockUseCookie, mockUseHead, mockUseRequestHeaders } = vi.hoisted(() => ({
  mockInstall: vi.fn(),
  mockGetPreset: vi.fn(() => Promise.resolve({ colors: {} })),
  mockMergePresets: vi.fn((_a: any, _b: any) => ({ colors: {}, merged: true })),
  mockGenerateCSS: vi.fn(() => '.maz { color: red }'),
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
              strategy: 'hybrid',
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
        strategy: 'hybrid',
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

  it('should add dark class to html when colorMode is dark and strategy is class', async () => {
    const context = createContext({ colorMode: 'dark', darkModeStrategy: 'class' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseHead).toHaveBeenCalledWith({
      htmlAttrs: { class: 'dark' },
    })
  })

  it('should not add dark class when colorMode is light', async () => {
    const context = createContext({ colorMode: 'light' })
    await (themePlugin as (...args: any[]) => any)(context)
    const darkClassCalls = mockUseHead.mock.calls.filter(
      ([arg]) => arg.htmlAttrs?.class === 'dark',
    )
    expect(darkClassCalls).toHaveLength(0)
  })

  it('should detect dark mode from system when colorMode is auto on client', async () => {
    mockGetSystemColorMode.mockReturnValue('dark')
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseHead).toHaveBeenCalledWith({
      htmlAttrs: { class: 'dark' },
    })
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

  it('should use resolved color mode cookie when color mode cookie is auto', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
      if (name === 'maz-color-mode') {
        return { value: 'auto' }
      }
      if (name === 'maz-resolved-color-mode') {
        return { value: 'dark' }
      }
      return { value: undefined }
    }) as any)
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseHead).toHaveBeenCalledWith({
      htmlAttrs: { class: 'dark' },
    })
  })

  it('should ignore invalid resolved color mode cookie values', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
      if (name === 'maz-resolved-color-mode') {
        return { value: 'invalid' }
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

  it('should use resolved color mode light from cookie', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
      if (name === 'maz-resolved-color-mode') {
        return { value: 'light' }
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

  it('should resolve the saved preset cookie when no options.preset is provided', async () => {
    const presetCookie: { value: string | null } = { value: 'nova' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith('nova')
  })

  it('should clear the cookie and fall back to the default when the saved preset cannot be resolved', async () => {
    const presetCookie: { value: string | null } = { value: 'unknown' }
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? presetCookie : { value: undefined }
    }) as any)
    mockGetPreset
      .mockRejectedValueOnce(new Error('not found'))
      .mockResolvedValueOnce({ colors: {}, name: 'fallback' } as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenNthCalledWith(1, 'unknown')
    expect(mockGetPreset).toHaveBeenNthCalledWith(2, undefined)
    // The retry path resaves the resolved fallback name.
    expect(presetCookie.value).toBe('fallback')
  })

  it('should rethrow the resolution error when there is no saved preset to retry', async () => {
    mockUseCookie.mockReturnValue({ value: undefined })
    mockGetPreset.mockRejectedValueOnce(new Error('boom'))
    const context = createContext({ preset: 'broken' })
    await expect((themePlugin as (...args: any[]) => any)(context)).rejects.toThrow('boom')
  })

  it('should ignore an empty maz-preset cookie value', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
      return name === 'maz-preset' ? { value: '' } : { value: undefined }
    }) as any)
    const context = createContext({ preset: undefined })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGetPreset).toHaveBeenCalledWith(undefined)
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
})
