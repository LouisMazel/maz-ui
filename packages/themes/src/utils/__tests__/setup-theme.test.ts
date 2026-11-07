import type { ThemePreset } from '../../types'
import type { SetupThemeReturn } from '../setup-theme'
import { nextTick } from 'vue'

const { getColorMode, getSavedColorMode, getSavedPreset, getSystemColorMode, savePreset, saveResolvedColorMode } = vi.hoisted(() => ({
  getColorMode: vi.fn(() => 'light'),
  getSavedColorMode: vi.fn((): string | undefined => undefined),
  getSavedPreset: vi.fn((): { base: string, active: string } | null => null),
  getSystemColorMode: vi.fn(() => 'light'),
  savePreset: vi.fn(),
  saveResolvedColorMode: vi.fn(),
}))

vi.mock('../theme-preferences', async importOriginal => ({
  ...await importOriginal<typeof import('../theme-preferences')>(),
  getSystemColorMode,
  readColorModePreference: vi.fn(() => ({
    colorMode: getSavedColorMode(),
  })),
  readPresetPreference: vi.fn(() => getSavedPreset()),
  savePresetPreference: savePreset,
  saveSystemColorMode: saveResolvedColorMode,
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

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => false),
}))

vi.mock('../use-mutation-observer', () => ({
  useMutationObserver: vi.fn(() => ({
    stop: vi.fn(),
  })),
}))

const { getPreset } = await import('../get-preset')
const { injectThemeCSS } = await import('../inject-theme-css')
const { mergePresets } = await import('../preset-merger')
const { updateDocumentClass } = await import('../update-document-class')
const { isServer } = await import('@maz-ui/utils')
const { useMutationObserver } = await import('../use-mutation-observer')
const { defaultOptions, setupTheme } = await import('../setup-theme')

const mockPreset: ThemePreset = {
  name: 'test',
  colors: {
    light: {
      'surface': '0 0% 100%',
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
      'divider': '220 13% 91%',
      'shadow': '240 6% 10%',
    },
    dark: {
      'surface': '235 16% 15%',
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
      'divider': '238 17% 25%',
      'shadow': '240 4% 16%',
    },
  },
  foundation: {
    'border-width': '1px',
    'space': '0.25rem',
  },
  scales: {
    rounded: {
      'xs': '0.125rem',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      elevation: '0 4px 12px -2px rgb(0 0 0 / 0.08)',
    },
  },
}

describe('setup-theme', () => {
  beforeEach(() => {
    vi.mocked(getColorMode).mockReturnValue('light')
    vi.mocked(getSavedColorMode).mockReturnValue(undefined)
    vi.mocked(getSystemColorMode).mockReturnValue('light')
    vi.mocked(isServer).mockReturnValue(false)
    vi.mocked(mergePresets).mockImplementation((preset: ThemePreset) => preset)
    vi.mocked(useMutationObserver).mockReturnValue({
      stop: vi.fn(),
    } as never)

    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    document.documentElement.className = ''
  })

  describe('given defaultOptions', () => {
    describe('when inspecting default values', () => {
      it('then it has strategy set to runtime', () => {
        expect(defaultOptions.strategy).toBe('runtime')
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

      it('then it has mode set to both', () => {
        expect(defaultOptions.mode).toBe('both')
      })

      it('then it has darkClass set to dark', () => {
        expect(defaultOptions.darkClass).toBe('dark')
      })

      it('then it has colorMode set to auto', () => {
        expect(defaultOptions.colorMode).toBe('auto')
      })

      it('then it has lightClass set to light', () => {
        expect(defaultOptions.lightClass).toBe('light')
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

        expect(injectThemeCSS).toHaveBeenCalledWith(
          mockPreset,
          expect.objectContaining({ strategy: 'runtime' }),
        )
      })
    })

    describe('when no preset is provided (async resolution in background)', () => {
      it('then it returns a SetupThemeReturn synchronously', () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        const result = setupTheme({})

        expect(result).not.toBeInstanceOf(Promise)
        expect(result).toHaveProperty('themeState')
        expect(result).toHaveProperty('cleanup')
      })

      it('then it calls getPreset to resolve the default preset', () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        setupTheme({})

        expect(getPreset).toHaveBeenCalled()
      })

      it('then calling the noop cleanup does not throw', () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        const result = setupTheme({}) as SetupThemeReturn

        expect(() => result.cleanup()).not.toThrow()
      })

      it('then themeState preset is undefined initially and set after resolution', async () => {
        vi.mocked(getPreset).mockResolvedValue(mockPreset)

        const result = setupTheme({}) as SetupThemeReturn

        expect(result.themeState.value.preset).toBeUndefined()

        await vi.waitFor(() => {
          expect(result.themeState.value.preset).toStrictEqual(mockPreset)
        })
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

      it('then it does not swap to a scoped cookie active even when the base matches', () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'ocean', active: 'nova' })

        setupTheme({ preset: 'ocean' as unknown as ThemePreset, strategy: 'buildtime' })

        expect(getPreset).not.toHaveBeenCalled()
      })
    })

    describe('when overrides are non-empty', () => {
      it('then it calls mergePresets with the preset and overrides', () => {
        const overrides = {
          colors: {
            light: { primary: '100 50% 50%' as const },
          },
        }

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
          {
            attributes: true,
            attributeFilter: ['class'],
          },
        )
      })
    })

    describe('when running on client with non-auto colorMode', () => {
      it('then it still attaches a matchMedia change listener so later switches to auto react to system changes', () => {
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

        expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
      })

      it('then the listener only saves the system preference while colorMode is not auto', () => {
        let changeHandler: (() => void) | undefined
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: true,
          addEventListener: vi.fn((_event: string, handler: () => void) => {
            changeHandler = handler
          }),
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getColorMode).mockReturnValue('dark')
        vi.mocked(getSavedColorMode).mockReturnValue(undefined)

        setupTheme({ preset: mockPreset, colorMode: 'dark' })

        vi.mocked(updateDocumentClass).mockClear()
        vi.mocked(saveResolvedColorMode).mockClear()

        if (changeHandler) {
          changeHandler()
        }

        expect(updateDocumentClass).not.toHaveBeenCalled()
        expect(saveResolvedColorMode).toHaveBeenCalledWith('dark')
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

    describe('when matchMedia change event fires with auto colorMode', () => {
      it('then it re-applies the resolved class so maz-ui follows the system pref', () => {
        let changeHandler: (() => void) | undefined
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: true,
          addEventListener: vi.fn((_event: string, handler: () => void) => {
            changeHandler = handler
          }),
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' })
        vi.mocked(updateDocumentClass).mockClear()

        if (changeHandler) {
          changeHandler()
        }

        expect(updateDocumentClass).toHaveBeenCalledWith('auto', expect.any(Object))
      })

      it('then it saves the resolved color mode', () => {
        let changeHandler: (() => void) | undefined
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: true,
          addEventListener: vi.fn((_event: string, handler: () => void) => {
            changeHandler = handler
          }),
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' })

        vi.mocked(saveResolvedColorMode).mockClear()

        if (changeHandler) {
          changeHandler()
        }

        expect(saveResolvedColorMode).toHaveBeenCalledWith('dark')
      })

      it('then it only saves the system preference once colorMode flips away from auto', () => {
        let changeHandler: (() => void) | undefined
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: true,
          addEventListener: vi.fn((_event: string, handler: () => void) => {
            changeHandler = handler
          }),
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' }) as SetupThemeReturn

        result.themeState.value.colorMode = 'light'
        vi.mocked(updateDocumentClass).mockClear()
        vi.mocked(saveResolvedColorMode).mockClear()

        if (changeHandler) {
          changeHandler()
        }

        expect(updateDocumentClass).not.toHaveBeenCalled()
        expect(saveResolvedColorMode).toHaveBeenCalledWith('dark')
      })

      it('then it resolves to light when mediaQuery.matches is false', () => {
        let changeHandler: (() => void) | undefined
        vi.stubGlobal('matchMedia', vi.fn(() => ({
          matches: false,
          addEventListener: vi.fn((_event: string, handler: () => void) => {
            changeHandler = handler
          }),
          removeEventListener: vi.fn(),
        })))
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getSystemColorMode).mockReturnValue('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' }) as SetupThemeReturn

        vi.mocked(saveResolvedColorMode).mockClear()

        if (changeHandler) {
          changeHandler()
        }

        expect(saveResolvedColorMode).toHaveBeenCalledWith('light')
        expect(result.themeState.value.isDark).toBe(false)
      })
    })

    describe('when mutation observer callback fires', () => {
      it('then it updates themeState based on document class', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        vi.mocked(isServer).mockReturnValue(false)

        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        document.documentElement.classList.remove('dark')

        if (mutationCallback) {
          mutationCallback()
        }

        expect(result.themeState.value.isDark).toBe(false)
      })
    })

    describe('when mutation observer callback fires with dark class', () => {
      it('then it sets isDark to true and updates colorMode', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        vi.mocked(isServer).mockReturnValue(false)

        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        document.documentElement.classList.add('dark')

        if (mutationCallback) {
          mutationCallback()
        }

        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when mutation observer callback fires with dark class and colorMode is light', () => {
      it('then it updates colorMode to dark', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getColorMode).mockReturnValue('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'light' }) as SetupThemeReturn

        document.documentElement.classList.add('dark')

        if (mutationCallback) {
          mutationCallback()
        }

        expect(result.themeState.value.isDark).toBe(true)
        expect(result.themeState.value.colorMode).toBe('dark')
      })
    })

    describe('when a host adds the dark class while the light class is present', () => {
      it('then it removes the light class', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        vi.mocked(isServer).mockReturnValue(false)

        setupTheme({ preset: mockPreset })

        document.documentElement.classList.add('light', 'dark')
        mutationCallback?.()

        expect(document.documentElement.classList.contains('light')).toBe(false)
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    describe('when a host removes the dark class without adding the light class', () => {
      it('then it adds the light class', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        vi.mocked(isServer).mockReturnValue(false)

        setupTheme({ preset: mockPreset })

        document.documentElement.classList.remove('light', 'dark')
        mutationCallback?.()

        expect(document.documentElement.classList.contains('light')).toBe(true)
      })
    })

    describe('when the dark mode strategy is media', () => {
      it('then the classes of the html element are not observed', () => {
        setupTheme({ preset: mockPreset, darkModeStrategy: 'media' })

        expect(useMutationObserver).not.toHaveBeenCalled()
      })
    })

    describe('when the mode is not both', () => {
      it('then the classes of the html element are not observed', () => {
        setupTheme({ preset: mockPreset, mode: 'light' })

        expect(useMutationObserver).not.toHaveBeenCalled()
      })
    })

    describe('when the dark class matches a dark color mode', () => {
      it('then the color mode is kept', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })

        const result = setupTheme({ preset: mockPreset, colorMode: 'dark' })

        document.documentElement.classList.add('dark')
        mutationCallback?.()

        expect(result.themeState.value.colorMode).toBe('dark')
        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when mutation observer callback fires on server', () => {
      it('then it returns early without updating', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })

        vi.mocked(isServer)
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false)

        setupTheme({ preset: mockPreset })

        vi.mocked(isServer).mockReturnValue(true)

        if (mutationCallback) {
          expect(() => mutationCallback!()).not.toThrow()
        }
      })
    })

    describe('when no preset is provided and no preset resolves', () => {
      it('then finalizeTheme still sets up without preset', () => {
        vi.mocked(getPreset).mockResolvedValue(undefined as any)

        const result = setupTheme({}) as SetupThemeReturn

        expect(result.themeState.value.preset).toBeUndefined()
      })
    })

    describe('when the app starts on client with both modes', () => {
      it('then it saves the system preference for the server', () => {
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        setupTheme({ preset: mockPreset, colorMode: 'light', mode: 'both' })

        expect(saveResolvedColorMode).toHaveBeenCalledWith('dark')
      })
    })

    describe('when the app starts on client with a single mode', () => {
      it('then it does not save the system preference', () => {
        setupTheme({ preset: mockPreset, mode: 'light' })

        expect(saveResolvedColorMode).not.toHaveBeenCalled()
      })
    })

    describe('when colorMode changes to non-auto on client', () => {
      it('then it does not save the resolved color mode', async () => {
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getColorMode).mockReturnValue('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'light' }) as SetupThemeReturn

        vi.mocked(saveResolvedColorMode).mockClear()
        vi.mocked(updateDocumentClass).mockClear()

        result.themeState.value.colorMode = 'dark'
        await nextTick()

        expect(updateDocumentClass).toHaveBeenCalled()
        expect(saveResolvedColorMode).not.toHaveBeenCalled()
      })
    })

    describe('when running on client with auto colorMode and resolved cookie', () => {
      it('then it saves the resolved color mode in createThemeState', () => {
        vi.mocked(isServer).mockReturnValue(false)
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' })

        expect(saveResolvedColorMode).toHaveBeenCalledWith('dark')
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

    describe('when a preset object is finalized', () => {
      it('then it persists the base and active scoped to the preset name', () => {
        setupTheme({ preset: mockPreset })

        expect(savePreset).toHaveBeenCalledWith('test', 'test')
      })
    })

    describe('when a scoped cookie restores a switch with no preset provided', () => {
      it('then it resolves the configured base then swaps to the saved active', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'maz-ui', active: 'ocean' })
        vi.mocked(getPreset)
          .mockResolvedValueOnce({ ...mockPreset, name: 'maz-ui' })
          .mockResolvedValueOnce({ ...mockPreset, name: 'ocean' })

        setupTheme({ preset: 'maz-ui' as unknown as ThemePreset })

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(savePreset).toHaveBeenCalledWith('maz-ui', 'ocean')
      })
    })

    describe('when a foreign scoped cookie targets another configured base', () => {
      it('then it ignores the cookie and keeps the configured preset', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'other-app', active: 'ocean' })
        vi.mocked(getPreset).mockResolvedValueOnce({ ...mockPreset, name: 'maz-ui' })

        setupTheme({ preset: 'maz-ui' as unknown as ThemePreset })

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(getPreset).not.toHaveBeenCalledWith('ocean')
        expect(savePreset).toHaveBeenCalledWith('maz-ui', 'maz-ui')
      })
    })

    describe('when options.preset is a custom object and a scoped cookie restores a switch', () => {
      it('then the object renders synchronously then the saved active swaps in', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'custom-app-theme', active: 'ocean' })
        const oceanPreset = { ...mockPreset, name: 'ocean' }
        vi.mocked(getPreset).mockResolvedValueOnce(oceanPreset)
        const customPreset = { ...mockPreset, name: 'custom-app-theme' }

        const result = setupTheme({ preset: customPreset }) as SetupThemeReturn

        expect(result.themeState.value.preset?.name).toBe('custom-app-theme')

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(savePreset).toHaveBeenCalledWith('custom-app-theme', 'ocean')
      })
    })

    describe('when options.preset is a custom object and a foreign cookie is present', () => {
      it('then the object stays and the cookie is ignored without a getPreset round-trip', () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'maz-ui', active: 'ocean' })
        const customPreset = { ...mockPreset, name: 'custom-app-theme' }

        const result = setupTheme({ preset: customPreset }) as SetupThemeReturn

        expect(result.themeState.value.preset?.name).toBe('custom-app-theme')
        expect(getPreset).not.toHaveBeenCalled()
        expect(savePreset).toHaveBeenCalledWith('custom-app-theme', 'custom-app-theme')
      })
    })

    describe('when the restored switch has overrides set', () => {
      it('then mergePresets is applied to the swapped preset', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'custom-app-theme', active: 'ocean' })
        const oceanPreset = { ...mockPreset, name: 'ocean' }
        vi.mocked(getPreset).mockResolvedValueOnce(oceanPreset)
        vi.mocked(mergePresets).mockReturnValueOnce({ ...oceanPreset, name: 'ocean-merged' })
        const customPreset = { ...mockPreset, name: 'custom-app-theme' }

        setupTheme({
          preset: customPreset,
          overrides: { foundation: {} as never },
        })

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(mergePresets).toHaveBeenCalledWith(oceanPreset, { foundation: {} })
      })
    })

    describe('when a restored switch active fails to resolve on an object preset', () => {
      it('then the object stays and the cookie is healed to the base', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'custom-app-theme', active: 'disappeared' })
        vi.mocked(getPreset).mockRejectedValueOnce(new Error('not found'))
        const customPreset = { ...mockPreset, name: 'custom-app-theme' }

        const result = setupTheme({ preset: customPreset }) as SetupThemeReturn

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(savePreset).toHaveBeenCalledWith('custom-app-theme', 'custom-app-theme')
        expect(result.themeState.value.preset?.name).toBe('custom-app-theme')
      })
    })

    describe('when options.preset is a custom object and no saved cookie exists', () => {
      it('then the object is finalized synchronously', () => {
        vi.mocked(getSavedPreset).mockReturnValue(null)
        const customPreset = { ...mockPreset, name: 'custom-app-theme' }

        const result = setupTheme({ preset: customPreset }) as SetupThemeReturn

        expect(result.themeState.value.preset?.name).toBe('custom-app-theme')
      })
    })

    describe('when a restored switch active fails to resolve with no preset provided', () => {
      it('then it falls back to the configured base', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'maz-ui', active: 'disappeared' })
        vi.mocked(getPreset)
          .mockResolvedValueOnce({ ...mockPreset, name: 'maz-ui' })
          .mockRejectedValueOnce(new Error('not found'))

        setupTheme({ preset: 'maz-ui' as unknown as ThemePreset })

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(savePreset).toHaveBeenCalledWith('maz-ui', 'maz-ui')
      })
    })

    describe('when the configured preset resolution rejects', () => {
      it('then it logs the error and skips finalization', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce(null)
        vi.mocked(getPreset).mockRejectedValueOnce(new Error('boom'))
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        setupTheme({})

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(consoleSpy).toHaveBeenCalledWith(
          '[@maz-ui/themes] Failed to resolve preset',
          expect.any(Error),
        )

        consoleSpy.mockRestore()
      })

      it('then the configured preset name stays the base of the state', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce(null)
        vi.mocked(getPreset).mockRejectedValueOnce(new Error('boom'))
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const result = setupTheme({ preset: 'ocean' as unknown as ThemePreset }) as SetupThemeReturn

        await new Promise(resolve => setTimeout(resolve, 0))
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(result.themeState.value.presetBase).toBe('ocean')
        expect(result.themeState.value.preset).toBeUndefined()
        consoleSpy.mockRestore()
      })
    })

    describe('when persistPreset is omitted (default true)', () => {
      it('then themeState.persistPreset is true', () => {
        const result = setupTheme({ preset: mockPreset }) as SetupThemeReturn

        expect(result.themeState.value.persistPreset).toBe(true)
      })

      it('then it reads the saved cookie at boot even when an options.preset string is provided', async () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce(null)
        vi.mocked(getPreset).mockResolvedValueOnce({ ...mockPreset, name: 'maz-ui' })

        setupTheme({ preset: 'maz-ui' as unknown as ThemePreset })

        await nextTick()
        await nextTick()

        expect(getSavedPreset).toHaveBeenCalled()
      })
    })

    describe('when colorMode is switched to a non-auto value at runtime', () => {
      it('then the watch handler skips saveResolvedColorMode (only fires for auto)', async () => {
        vi.mocked(isServer).mockReturnValue(false)
        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', mode: 'both' }) as SetupThemeReturn

        vi.mocked(saveResolvedColorMode).mockClear()
        result.themeState.value.colorMode = 'light'
        await nextTick()

        expect(saveResolvedColorMode).not.toHaveBeenCalled()
      })
    })

    describe('when persistPreset is false', () => {
      it('then it does not write the cookie on finalize', () => {
        setupTheme({ preset: mockPreset, persistPreset: false })

        expect(savePreset).not.toHaveBeenCalled()
      })

      it('then it does not read the saved cookie at boot', async () => {
        vi.mocked(getPreset).mockResolvedValueOnce({ ...mockPreset, name: 'maz-ui' })

        setupTheme({ persistPreset: false })

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(getSavedPreset).not.toHaveBeenCalled()
      })

      it('then themeState.persistPreset reflects the option', () => {
        const result = setupTheme({ preset: mockPreset, persistPreset: false }) as SetupThemeReturn

        expect(result.themeState.value.persistPreset).toBe(false)
      })
    })
  })

  describe('given the theme cookies watcher', () => {
    let emitCookieChange: (event: { changed?: { name: string }[], deleted?: { name: string }[] }) => void
    const removeEventListener = vi.fn()
    const oceanPreset: ThemePreset = { ...mockPreset, name: 'ocean' }

    beforeEach(() => {
      vi.mocked(getSavedPreset).mockReturnValue(null)
      vi.stubGlobal('cookieStore', {
        addEventListener: vi.fn((_type: string, listener: typeof emitCookieChange) => {
          emitCookieChange = event => listener({ changed: [], deleted: [], ...event })
        }),
        removeEventListener,
      })
    })

    afterEach(() => {
      vi.mocked(getSavedPreset).mockReturnValue(null)
    })

    describe('when the Cookie Store API is missing', () => {
      it('then the setup still succeeds', () => {
        vi.stubGlobal('cookieStore', undefined)

        const result = setupTheme({ preset: mockPreset })

        expect(result.themeState.value.preset?.name).toBe('test')
      })
    })

    describe('when the maz-color-mode cookie changes to dark', () => {
      it('then the color mode and isDark follow it', () => {
        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })

        vi.mocked(getSavedColorMode).mockReturnValue('dark')
        emitCookieChange({
          changed: [
            { name: 'maz-color-mode' },
          ],
        })

        expect(result.themeState.value.colorMode).toBe('dark')
        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when the maz-color-mode cookie changes to auto with a dark system', () => {
      it('then isDark follows the system', () => {
        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })

        vi.mocked(getSavedColorMode).mockReturnValue('auto')
        vi.mocked(getSystemColorMode).mockReturnValue('dark')
        emitCookieChange({
          changed: [
            { name: 'maz-color-mode' },
          ],
        })

        expect(result.themeState.value.colorMode).toBe('auto')
        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when the maz-color-mode cookie is deleted', () => {
      it('then the color mode of the config is restored', () => {
        vi.mocked(getSavedColorMode).mockReturnValue('dark')
        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })

        vi.mocked(getSavedColorMode).mockReturnValue(undefined)
        emitCookieChange({
          deleted: [
            { name: 'maz-color-mode' },
          ],
        })

        expect(result.themeState.value.colorMode).toBe('light')
        expect(result.themeState.value.isDark).toBe(false)
      })
    })

    describe('when the maz-color-mode cookie keeps the current value', () => {
      it('then the state is left untouched', () => {
        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })
        result.themeState.value.isDark = true

        vi.mocked(getSavedColorMode).mockReturnValueOnce('light')
        emitCookieChange({
          changed: [
            { name: 'maz-color-mode' },
          ],
        })

        expect(result.themeState.value.isDark).toBe(true)
      })
    })

    describe('when the maz-preset cookie switches the preset of this app', () => {
      it('then the new preset is applied', async () => {
        vi.mocked(getPreset).mockResolvedValue(oceanPreset)
        const result = setupTheme({ preset: mockPreset })
        vi.mocked(injectThemeCSS).mockClear()

        vi.mocked(getSavedPreset).mockReturnValue({ base: 'test', active: 'ocean' })
        emitCookieChange({
          changed: [
            { name: 'maz-preset' },
          ],
        })
        await vi.waitFor(() => expect(result.themeState.value.preset?.name).toBe('ocean'))

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(injectThemeCSS).toHaveBeenCalledWith(oceanPreset, expect.any(Object))
      })
    })

    describe('when the maz-preset cookie belongs to another app', () => {
      it('then the preset is kept', () => {
        const result = setupTheme({ preset: mockPreset })

        vi.mocked(getSavedPreset).mockReturnValue({ base: 'other', active: 'ocean' })
        emitCookieChange({
          changed: [
            { name: 'maz-preset' },
          ],
        })

        expect(getPreset).not.toHaveBeenCalled()
        expect(result.themeState.value.preset?.name).toBe('test')
      })
    })

    describe('when the maz-preset cookie is deleted after a switch', () => {
      it('then the configured preset is restored without loading it', async () => {
        vi.mocked(getPreset).mockResolvedValue(oceanPreset)
        const result = setupTheme({ preset: mockPreset })
        vi.mocked(getSavedPreset).mockReturnValue({ base: 'test', active: 'ocean' })
        emitCookieChange({
          changed: [
            { name: 'maz-preset' },
          ],
        })
        await vi.waitFor(() => expect(result.themeState.value.preset?.name).toBe('ocean'))
        vi.mocked(getPreset).mockClear()

        vi.mocked(getSavedPreset).mockReturnValue(null)
        emitCookieChange({
          deleted: [
            { name: 'maz-preset' },
          ],
        })

        expect(result.themeState.value.preset?.name).toBe('test')
        expect(getPreset).not.toHaveBeenCalled()
        expect(savePreset).toHaveBeenLastCalledWith('test', 'test')
      })
    })

    describe('when the maz-preset cookie names an unknown preset', () => {
      it('then the cookie is rewritten with the current preset', async () => {
        vi.mocked(getPreset).mockRejectedValue(new Error('unknown'))
        const result = setupTheme({ preset: mockPreset })

        vi.mocked(getSavedPreset).mockReturnValue({ base: 'test', active: 'unknown' })
        emitCookieChange({
          changed: [
            { name: 'maz-preset' },
          ],
        })

        await vi.waitFor(() => expect(savePreset).toHaveBeenLastCalledWith('test', 'test'))
        expect(result.themeState.value.preset?.name).toBe('test')
      })
    })

    describe('when the maz-preset cookie changes with persistPreset disabled', () => {
      it('then the preset is kept', () => {
        const result = setupTheme({ preset: mockPreset, persistPreset: false })

        vi.mocked(getSavedPreset).mockReturnValue({ base: 'test', active: 'ocean' })
        emitCookieChange({
          changed: [
            { name: 'maz-preset' },
          ],
        })

        expect(getPreset).not.toHaveBeenCalled()
        expect(result.themeState.value.preset?.name).toBe('test')
      })
    })

    describe('when an unrelated cookie changes', () => {
      it('then the theme is left untouched', () => {
        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })

        vi.mocked(getSavedColorMode).mockReturnValue('dark')
        emitCookieChange({
          changed: [
            { name: 'session' },
          ],
        })

        expect(result.themeState.value.colorMode).toBe('light')
      })
    })

    describe('when cleanup is called', () => {
      it('then the cookie listener is removed', () => {
        const result = setupTheme({ preset: mockPreset })

        result.cleanup()

        expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })
    })
  })

  describe('given a theme class already set on the html element by a host', () => {
    describe('when the host set the dark class and the saved color mode is light', () => {
      it('then the state starts from the class of the host', () => {
        document.documentElement.classList.add('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'light' })

        expect(result.themeState.value.isDark).toBe(true)
        expect(result.themeState.value.colorMode).toBe('dark')
        expect(updateDocumentClass).not.toHaveBeenCalled()
      })
    })

    describe('when the host set the light class with the auto color mode and a dark system', () => {
      it('then the choice of the host becomes the color mode', () => {
        document.documentElement.classList.add('light')
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto' })

        expect(result.themeState.value.isDark).toBe(false)
        expect(result.themeState.value.colorMode).toBe('light')
      })
    })

    describe('when the host set the class of the system with the auto color mode', () => {
      it('then the color mode stays auto', () => {
        document.documentElement.classList.add('dark')
        vi.mocked(getSystemColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto' })

        expect(result.themeState.value.isDark).toBe(true)
        expect(result.themeState.value.colorMode).toBe('auto')
      })
    })

    describe('when the host forces dark with the auto color mode and the system then turns dark and light again', () => {
      it('then the choice of the host is kept', () => {
        let mutationCallback: (() => void) | undefined
        vi.mocked(useMutationObserver).mockImplementation((_el: any, cb: any, _opts: any) => {
          mutationCallback = cb
          return {
            stop: vi.fn(),
          } as never
        })
        let onSystemChange: (() => void) | undefined
        const mediaQuery = {
          matches: false,
          addEventListener: vi.fn((_type: string, listener: () => void) => {
            onSystemChange = listener
          }),
          removeEventListener: vi.fn(),
        }
        vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
        const result = setupTheme({ preset: mockPreset, colorMode: 'auto' })

        document.documentElement.classList.add('dark')
        mutationCallback?.()
        vi.mocked(updateDocumentClass).mockClear()
        onSystemChange?.()

        expect(result.themeState.value.colorMode).toBe('dark')
        expect(updateDocumentClass).not.toHaveBeenCalledWith('auto', expect.anything())
      })
    })
  })

  describe('given a single supported mode', () => {
    describe('when the mode is light and the saved color mode is dark', () => {
      it('then isDark is false', () => {
        vi.mocked(getSavedColorMode).mockReturnValue('dark')

        const result = setupTheme({ preset: mockPreset, mode: 'light' })

        expect(result.themeState.value.isDark).toBe(false)
      })
    })

    describe('when the mode is dark', () => {
      it('then isDark is true', () => {
        const result = setupTheme({ preset: mockPreset, mode: 'dark' })

        expect(result.themeState.value.isDark).toBe(true)
      })
    })
  })

  describe('given the buildtime strategy', () => {
    describe('when the color mode changes', () => {
      it('then the class of the html element follows it', async () => {
        const result = setupTheme({ preset: mockPreset, strategy: 'buildtime', colorMode: 'light' })
        vi.mocked(updateDocumentClass).mockClear()

        result.themeState.value.colorMode = 'dark'
        await nextTick()

        expect(updateDocumentClass).toHaveBeenCalledWith('dark', expect.anything())
        expect(injectThemeCSS).not.toHaveBeenCalled()
      })
    })
  })

  describe('given a host that already resolved the active preset', () => {
    describe('when it passes the configured preset as the base', () => {
      it('then the cookie keeps the configured preset as the base', () => {
        vi.mocked(getSavedPreset).mockReturnValueOnce({ base: 'folio', active: 'test' })

        setupTheme({ preset: mockPreset, _presetBase: 'folio' } as never)

        expect(savePreset).toHaveBeenCalledWith('folio', 'test')
        expect(getPreset).not.toHaveBeenCalled()
      })
    })
  })

  describe('given a color mode already resolved by the host', () => {
    describe('when the theme is set up', () => {
      it('then it wins over the cookie and the config', () => {
        vi.mocked(getSavedColorMode).mockReturnValueOnce('light')

        const result = setupTheme({ preset: mockPreset, colorMode: 'auto', _colorMode: 'dark' } as never) as SetupThemeReturn

        expect(result.themeState.value.colorMode).toBe('dark')
      })
    })
  })
})
