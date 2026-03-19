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
  mockUseRequestHeaders: vi.fn(() => ({} as Record<string, string>)),
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

describe('theme plugin (server)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetPreset.mockResolvedValue({ colors: {} })
    mockUseCookie.mockReturnValue({ value: undefined })
    mockGetSystemColorMode.mockReturnValue('light')
    mockUseRequestHeaders.mockReturnValue({})
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

  it('should call injectThemeCSS on server', async () => {
    const context = createContext({ injectCriticalCSS: true, injectAllCSSOnServer: false })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGenerateCSS).toHaveBeenCalled()
    expect(mockUseHead).toHaveBeenCalledWith(
      expect.objectContaining({
        style: expect.arrayContaining([
          expect.objectContaining({ id: 'maz-theme-css' }),
        ]),
      }),
    )
  })

  it('should inject critical CSS when injectCriticalCSS is true and injectAllCSSOnServer is false', async () => {
    const context = createContext({
      injectCriticalCSS: true,
      injectAllCSSOnServer: false,
    })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGenerateCSS).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ onlyCritical: true }),
    )
  })

  it('should inject full CSS when injectAllCSSOnServer is true', async () => {
    const context = createContext({
      injectAllCSSOnServer: true,
    })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGenerateCSS).toHaveBeenCalledWith(
      expect.anything(),
      expect.not.objectContaining({ onlyCritical: true }),
    )
  })

  it('should detect dark mode from sec-ch-prefers-color-scheme header', async () => {
    mockUseRequestHeaders.mockReturnValue({ 'sec-ch-prefers-color-scheme': 'dark' })
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseHead).toHaveBeenCalledWith({
      htmlAttrs: { class: 'dark' },
    })
  })

  it('should detect dark mode from user-agent header', async () => {
    mockUseRequestHeaders.mockReturnValue({ 'user-agent': 'SomeBrowser/1.0 dark mode' })
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockUseHead).toHaveBeenCalledWith({
      htmlAttrs: { class: 'dark' },
    })
  })

  it('should return auto when no dark mode indicators present', async () => {
    mockUseRequestHeaders.mockReturnValue({ 'user-agent': 'SomeBrowser/1.0' })
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        _isDark: false,
      }),
    )
  })

  it('should use saved color mode from cookie on server', async () => {
    mockUseCookie.mockReturnValue({ value: 'dark' })
    const context = createContext({ colorMode: 'auto', mode: 'both' })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockInstall).toHaveBeenCalledWith(
      context.vueApp,
      expect.objectContaining({
        colorMode: 'dark',
      }),
    )
  })

  it('should pass darkClass and darkModeStrategy to CSS options', async () => {
    const context = createContext({
      darkClass: 'custom-dark',
      darkModeStrategy: 'media',
    })
    await (themePlugin as (...args: any[]) => any)(context)
    expect(mockGenerateCSS).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        darkSelectorStrategy: 'media',
        darkClass: 'custom-dark',
      }),
    )
  })

  it('should inject blocking script when colorMode is auto, mode is both, and darkModeStrategy is class', async () => {
    const context = createContext({ colorMode: 'auto', mode: 'both', darkModeStrategy: 'class' })
    await (themePlugin as (...args: any[]) => any)(context)
    const scriptCall = mockUseHead.mock.calls.find(
      ([arg]: any[]) => arg.script,
    )
    expect(scriptCall).toBeDefined()
    expect(scriptCall![0].script[0].innerHTML).toContain('prefers-color-scheme')
    expect(scriptCall![0].script[0].id).toBe('maz-color-mode-blocking')
    expect(scriptCall![0].meta[0]['http-equiv']).toBe('Accept-CH')
  })

  it('should not inject blocking script when mode is light', async () => {
    const context = createContext({ colorMode: 'auto', mode: 'light', darkModeStrategy: 'class' })
    await (themePlugin as (...args: any[]) => any)(context)
    const scriptCall = mockUseHead.mock.calls.find(
      ([arg]: any[]) => arg.script,
    )
    expect(scriptCall).toBeUndefined()
  })

  it('should not inject blocking script when darkModeStrategy is media', async () => {
    const context = createContext({ colorMode: 'auto', mode: 'both', darkModeStrategy: 'media' })
    await (themePlugin as (...args: any[]) => any)(context)
    const scriptCall = mockUseHead.mock.calls.find(
      ([arg]: any[]) => arg.script,
    )
    expect(scriptCall).toBeUndefined()
  })

  it('should not inject blocking script when colorMode is dark', async () => {
    const context = createContext({ colorMode: 'dark', mode: 'both', darkModeStrategy: 'class' })
    await (themePlugin as (...args: any[]) => any)(context)
    const scriptCall = mockUseHead.mock.calls.find(
      ([arg]: any[]) => arg.script,
    )
    expect(scriptCall).toBeUndefined()
  })

  it('should use configured darkClass in blocking script', async () => {
    const context = createContext({ colorMode: 'auto', mode: 'both', darkModeStrategy: 'class', darkClass: 'my-dark' })
    await (themePlugin as (...args: any[]) => any)(context)
    const scriptCall = mockUseHead.mock.calls.find(
      ([arg]: any[]) => arg.script,
    )
    expect(scriptCall![0].script[0].innerHTML).toContain('my-dark')
  })

  it('should use resolved color mode cookie on server', async () => {
    mockUseCookie.mockImplementation(((name: string) => {
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
})
