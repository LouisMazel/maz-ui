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
    mockUseCookie.mockReturnValue({ value: 'dark' })
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
})
