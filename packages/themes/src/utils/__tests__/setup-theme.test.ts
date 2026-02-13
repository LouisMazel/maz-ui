import type { ThemePreset } from '../../types'
import type { SetupThemeReturn } from '../setup-theme'

vi.mock('../get-color-mode', () => ({
  getColorMode: vi.fn(() => 'light'),
  getSavedColorMode: vi.fn(() => null),
  getSystemColorMode: vi.fn(() => 'light'),
}))

vi.mock('../get-preset', () => ({
  getPreset: vi.fn(),
}))

vi.mock('../inject-theme-css', () => ({
  injectThemeCSS: vi.fn(),
}))

vi.mock('../preset-merger', () => ({
  mergePresets: vi.fn((preset: ThemePreset) => preset),
}))

vi.mock('../update-document-class', () => ({
  updateDocumentClass: vi.fn(),
}))

vi.mock('@maz-ui/utils', () => ({
  isServer: vi.fn(() => false),
}))

vi.mock('../../../../lib/src/composables/useMutationObserver', () => ({
  useMutationObserver: vi.fn(() => ({ stop: vi.fn() })),
}))

const { getColorMode, getSavedColorMode, getSystemColorMode } = await import('../get-color-mode')
const { getPreset } = await import('../get-preset')
const { injectThemeCSS } = await import('../inject-theme-css')
const { mergePresets } = await import('../preset-merger')
const { updateDocumentClass } = await import('../update-document-class')
const { isServer } = await import('@maz-ui/utils')
const { useMutationObserver } = await import('../../../../lib/src/composables/useMutationObserver')
const { defaultOptions, setupTheme } = await import('../setup-theme')

const mockPreset: ThemePreset = {
  name: 'test',
  colors: {
    light: {
      'background': '0 0% 100%',
      'foreground': '210 8% 14%',
      'primary': '210 100% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '272 99% 54%',
      'secondary-foreground': '0 0% 100%',
      'accent': '164 76% 46%',
      'accent-foreground': '0 0% 100%',
      'info': '188 78% 41%',
      'info-foreground': '0 0% 100%',
      'contrast': '235 16% 15%',
      'contrast-foreground': '255 0% 95%',
      'destructive': '356 96% 58%',
      'destructive-foreground': '0 0% 100%',
      'success': '80 61% 50%',
      'success-foreground': '210 8% 14%',
      'warning': '40 97% 59%',
      'warning-foreground': '210 8% 14%',
      'overlay': '0 0% 40%',
      'muted': '0 0% 54%',
      'border': '220 13% 91%',
      'shadow': '240 6% 10%',
    },
    dark: {
      'background': '235 16% 15%',
      'foreground': '0 0% 85%',
      'primary': '210 100% 56%',
      'primary-foreground': '0 0% 100%',
      'secondary': '272 99% 54%',
      'secondary-foreground': '0 0% 100%',
      'accent': '164 76% 46%',
      'accent-foreground': '0 0% 100%',
      'info': '188 78% 41%',
      'info-foreground': '0 0% 100%',
      'contrast': '0 0% 100%',
      'contrast-foreground': '210 8% 14%',
      'destructive': '1 100% 71%',
      'destructive-foreground': '0 0% 100%',
      'success': '80 61% 50%',
      'success-foreground': '210 8% 14%',
      'warning': '40 97% 59%',
      'warning-foreground': '210 8% 14%',
      'overlay': '0 0% 15%',
      'muted': '255 0% 54%',
      'border': '238 17% 25%',
      'shadow': '240 4% 16%',
    },
  },
  foundation: {
    'radius': '0.5rem',
    'border-width': '1px',
  },
}

describe('setup-theme', () => {
  beforeEach(() => {
    vi.mocked(getColorMode).mockReturnValue('light')
    vi.mocked(getSavedColorMode).mockReturnValue(undefined)
    vi.mocked(getSystemColorMode).mockReturnValue('light')
    vi.mocked(isServer).mockReturnValue(false)
    vi.mocked(mergePresets).mockImplementation((preset: ThemePreset) => preset)
    vi.mocked(useMutationObserver).mockReturnValue({ stop: vi.fn() } as never)

    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  describe('given defaultOptions', () => {
    describe('when inspecting default values', () => {
      it('then it has strategy set to hybrid', () => {
        expect(defaultOptions.strategy).toBe('hybrid')
      })

      it('then it has overrides set to empty object', () => {
        expect(defaultOptions.overrides).toEqual({})
      })

      it('then it has darkModeStrategy set to class', () => {
        expect(defaultOptions.darkModeStrategy).toBe('class')
      })

      it('then it has preset set to undefined', () => {
        expect(defaultOptions.preset).toBeUndefined()
      })

      it('then it has injectCriticalCSS set to true', () => {
        expect(defaultOptions.injectCriticalCSS).toBe(true)
      })

      it('then it has injectFullCSS set to true', () => {
        expect(defaultOptions.injectFullCSS).toBe(true)
      })

      it('then it has mode set to both', () => {
        expect(defaultOptions.mode).toBe('both')
      })

      it('then it has darkClass set to dark', () => {
        expect(defaultOptions.darkClass).toBe('dark')
      })

      it('then it has colorMode set to auto', () => {
        expect(defaultOptions.colorMode).toBe('auto')
      })
    })
  })

  describe('given setupTheme function', () => {
    describe('when preset object is provided (sync path)', () => {
      it('then it returns a SetupThemeReturn synchronously, not a Promise', () => {
        const result = setupTheme({ preset: mockPreset })

        expect(result).not.toBeInstanceOf(Promise)
        expect(result).toHaveProperty('themeState')
        expect(result).toHaveProperty('cleanup')
      })

      it('then it sets the preset on themeState', () => {
        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        expect(result.themeState.value.preset).toStrictEqual(mockPreset)
      })

      it('then it calls updateDocumentClass during creation', () => {
        setupTheme({ preset: mockPreset })

        expect(updateDocumentClass).toHaveBeenCalled()
      })

      it('then it calls injectThemeCSS with the preset', () => {
        setupTheme({ preset: mockPreset })

        expect(injectThemeCSS).toHaveBeenCalledWith(mockPreset, expect.objectContaining({
          strategy: 'hybrid',
        }))
      })
    })

    describe('when no preset is provided (async path)', () => {
      it('then it returns a Promise', () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        const result = setupTheme({})

        expect(result).toBeInstanceOf(Promise)
      })

      it('then it calls getPreset to resolve the preset', async () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        await setupTheme({})

        expect(getPreset).toHaveBeenCalled()
      })

      it('then it returns a SetupThemeReturn after resolution', async () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        const result = await setupTheme({})

        expect(result).toHaveProperty('themeState')
        expect(result).toHaveProperty('cleanup')
        expect(result.themeState.value.preset).toStrictEqual(mockPreset)
      })
    })

    describe('when config resolution uses saved color mode', () => {
      it('then it uses saved color mode over provided colorMode', () => {
        vi.mocked(getSavedColorMode).mockReturnValue('dark')
        vi.mocked(getColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'light' }) as SetupThemeReturn

        expect(result.themeState.value.colorMode).toBe('dark')
      })
    })

    describe('when mode is dark and no saved color mode exists', () => {
      it('then it resolves colorMode to dark', () => {
        vi.mocked(getSavedColorMode).mockReturnValue(undefined)
        vi.mocked(getColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, mode: 'dark' }) as SetupThemeReturn

        expect(result.themeState.value.colorMode).toBe('dark')
      })
    })

    describe('when no colorMode or mode specified and no saved mode', () => {
      it('then it defaults to auto', () => {
        vi.mocked(getSavedColorMode).mockReturnValue(undefined)

        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        expect(result.themeState.value.colorMode).toBe('auto')
      })
    })

    describe('when colorMode is auto and mode is both', () => {
      it('then it uses getSystemColorMode to determine isDark', () => {
        vi.mocked(getSystemColorMode).mockReturnValue('dark')
        vi.mocked(getColorMode).mockReturnValue('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' }) as SetupThemeReturn

        expect(getSystemColorMode).toHaveBeenCalled()
        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when colorMode is dark', () => {
      it('then isDark is true', () => {
        vi.mocked(getSavedColorMode).mockReturnValue(undefined)
        vi.mocked(getColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'dark' }) as SetupThemeReturn

        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when colorMode is light', () => {
      it('then isDark is false', () => {
        vi.mocked(getColorMode).mockReturnValue('light')
        vi.mocked(getSystemColorMode).mockReturnValue('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'light', mode: 'both' }) as SetupThemeReturn

        expect(result.themeState.value.isDark).toBe(false)
      })
    })

    describe('when strategy is buildtime', () => {
      it('then it does not call injectThemeCSS', () => {
        setupTheme({ preset: mockPreset, strategy: 'buildtime' })

        expect(injectThemeCSS).not.toHaveBeenCalled()
      })

      it('then it returns synchronously even without a preset object', () => {
        const result = setupTheme({ strategy: 'buildtime' })

        expect(result).not.toBeInstanceOf(Promise)
      })

      it('then cleanup is a no-op function', () => {
        const result = setupTheme({ preset: mockPreset, strategy: 'buildtime' }) as SetupThemeReturn

        expect(() => result.cleanup()).not.toThrow()
      })
    })

    describe('when overrides are non-empty', () => {
      it('then it calls mergePresets with the preset and overrides', () => {
        const overrides = { colors: { light: { primary: '100 50% 50%' as const } } }

        setupTheme({ preset: mockPreset, overrides })

        expect(mergePresets).toHaveBeenCalledWith(mockPreset, overrides)
      })
    })

    describe('when overrides are empty', () => {
      it('then it does not call mergePresets', () => {
        setupTheme({ preset: mockPreset, overrides: {} })

        expect(mergePresets).not.toHaveBeenCalled()
      })

      it('then it uses the preset as-is', () => {
        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        expect(result.themeState.value.preset).toStrictEqual(mockPreset)
      })
    })

    describe('when running on server (isServer returns true)', () => {
      it('then watchColorSchemeFromMedia returns a no-op cleanup', () => {
        vi.mocked(isServer).mockReturnValue(true)

        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        expect(() => result.cleanup()).not.toThrow()
      })

      it('then matchMedia is not called', () => {
        vi.mocked(isServer).mockReturnValue(true)
        const matchMediaMock = vi.fn()
        vi.stubGlobal('matchMedia', matchMediaMock)

        setupTheme({ preset: mockPreset })

        expect(matchMediaMock).not.toHaveBeenCalled()
      })

      it('then useMutationObserver is not called', () => {
        vi.mocked(isServer).mockReturnValue(true)

        setupTheme({ preset: mockPreset })

        expect(useMutationObserver).not.toHaveBeenCalled()
      })
    })

    describe('when running on client with auto colorMode', () => {
      it('then it attaches a matchMedia change listener', () => {
        const addEventListenerMock = vi.fn()
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: false,
          addEventListener: addEventListenerMock,
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)

        setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' })

        expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
      })

      it('then it calls useMutationObserver on document.documentElement', () => {
        vi.mocked(isServer).mockReturnValue(false)

        setupTheme({ preset: mockPreset })

        expect(useMutationObserver).toHaveBeenCalledWith(
          document.documentElement,
          expect.any(Function),
          { attributes: true },
        )
      })
    })

    describe('when running on client with non-auto colorMode', () => {
      it('then it does not attach a matchMedia change listener', () => {
        const addEventListenerMock = vi.fn()
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: false,
          addEventListener: addEventListenerMock,
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getColorMode).mockReturnValue('dark')
        vi.mocked(getSavedColorMode).mockReturnValue(undefined)

        setupTheme({ preset: mockPreset, colorMode: 'dark' })

        expect(addEventListenerMock).not.toHaveBeenCalled()
      })
    })

    describe('when cleanup is called', () => {
      it('then it removes the matchMedia listener and stops the mutation observer', () => {
        const removeEventListenerMock = vi.fn()
        const stopMock = vi.fn()
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: removeEventListenerMock,
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(useMutationObserver).mockReturnValue({ stop: stopMock } as never)

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' }) as SetupThemeReturn

        result.cleanup()

        expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
        expect(stopMock).toHaveBeenCalled()
      })
    })

    describe('when themeState values are set from config', () => {
      it('then it populates strategy, darkClass, darkModeStrategy, and mode from config', () => {
        const result = setupTheme({
          preset: mockPreset,
          strategy: 'runtime',
          darkClass: 'my-dark',
          darkModeStrategy: 'media',
          mode: 'both',
        }) as SetupThemeReturn

        expect(result.themeState.value.strategy).toBe('runtime')
        expect(result.themeState.value.darkClass).toBe('my-dark')
        expect(result.themeState.value.darkModeStrategy).toBe('media')
        expect(result.themeState.value.mode).toBe('both')
      })
    })
  })
})
