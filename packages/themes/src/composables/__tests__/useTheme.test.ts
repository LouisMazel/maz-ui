import type { ThemePresetOverrides, ThemeState } from '../../types'
import { getCurrentInstance, inject } from 'vue'
import { mazUi } from '../../presets'
import { mergePresets } from '../../utils'
import { setCookie } from '../../utils/cookie-storage'
import { generateCSS, injectCSS } from '../../utils/css-generator'
import { saveResolvedColorMode } from '../../utils/get-color-mode'
import { getPreset } from '../../utils/get-preset'
import { useTheme } from '../useTheme'

const mockThemeState: ThemeState = {
  preset: mazUi,
  colorMode: 'light',
  darkClass: 'dark',
  strategy: 'runtime',
  darkModeStrategy: 'class',
  mode: 'both',
  isDark: false,
  persistPreset: true,
}

const mockRefThemeState = { value: mockThemeState }

vi.mock('vue', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue')>()

  return {
    ...original,
    ref: vi.fn(value => ({ value })),
    computed: vi.fn((getter) => {
      if (typeof getter === 'function') {
        return { value: getter() }
      }
      return {
        get value() {
          return getter.get()
        },
        set value(val) {
          getter.set(val)
        },
      }
    }),
    inject: vi.fn(),
    getCurrentInstance: vi.fn(),
    watch: vi.fn(() => vi.fn()),
  }
})

vi.mock('../../utils/css-generator', () => ({
  generateCSS: vi.fn(() => 'full-css'),
  injectCSS: vi.fn(),
  CSS_ID: 'maz-theme-css',
}))

vi.mock('../../utils/get-color-mode', () => ({
  getColorMode: vi.fn(),
  isSystemPrefersDark: vi.fn(),
  getSystemColorMode: vi.fn(() => 'light'),
  saveResolvedColorMode: vi.fn(),
}))

vi.mock('../../utils/get-preset', () => ({
  getPreset: vi.fn(),
}))

vi.mock('../../utils/preset-merger', () => ({
  mergePresets: vi.fn(),
}))

vi.mock('../../utils/cookie-storage', () => ({
  setCookie: vi.fn(),
  saveResolvedPresetName: vi.fn(),
  getSavedPresetName: vi.fn(() => null),
  clearSavedPresetName: vi.fn(),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => false),
}))

describe('useTheme', () => {
  beforeEach(() => {
    vi.stubGlobal('document', {
      documentElement: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      },
      head: { appendChild: vi.fn() },
      createElement: vi.fn(() => ({ remove: vi.fn(), textContent: '' })),
      cookie: '',
    })

    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  describe('given useTheme composable initialization', () => {
    describe('when theme state is not available', () => {
      it('then it throws error', () => {
        vi.mocked(inject).mockReturnValue(undefined)
        vi.mocked(getCurrentInstance).mockReturnValue(null)

        expect(() => useTheme()).toThrowError(
          '[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin, or wrap your components in a MazUiProvider, before using useTheme composable',
        )
      })
    })

    describe('when state is injected', () => {
      it('then it returns theme interface', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const result = useTheme()

        expect(result).toHaveProperty('presetName')
        expect(result).toHaveProperty('colorMode')
        expect(result).toHaveProperty('isDark')
        expect(result).toHaveProperty('strategy')
        expect(result).toHaveProperty('updateTheme')
        expect(result).toHaveProperty('setColorMode')
        expect(result).toHaveProperty('toggleDarkMode')
        expect(result).toHaveProperty('mode')
        expect(result).toHaveProperty('darkModeStrategy')
        expect(result).toHaveProperty('preset')
      })
    })

    describe('when inject fails', () => {
      it('then it falls back to global properties', () => {
        vi.mocked(inject).mockImplementation(() => {
          throw new Error('inject failed')
        })

        vi.mocked(getCurrentInstance).mockReturnValue({
          appContext: {
            app: {
              config: {
                globalProperties: {
                  $mazThemeState: mockRefThemeState,
                },
              },
            },
          },
        } as never)

        const result = useTheme()

        expect(result).toHaveProperty('presetName')
      })
    })

    describe('when running on server side', () => {
      it('then it resets theme state', async () => {
        const { isServer } = await import('@maz-ui/utils/helpers/isServer')
        vi.mocked(isServer).mockReturnValue(true)
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const result = useTheme()

        expect(result).toHaveProperty('presetName')
      })
    })

    describe('when injected state is updated', () => {
      it('then the watch callback runs without throwing for a valid newState', async () => {
        const { watch } = await import('vue')
        let watchCallback: ((newState: any) => void) | undefined
        vi.mocked(watch).mockImplementation(((_source: any, cb: any) => {
          watchCallback = cb
          return vi.fn()
        }) as unknown as typeof watch)

        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        useTheme()

        expect(() => watchCallback?.({ ...mockRefThemeState.value, preset: { ...mazUi, name: 'rotated' } })).not.toThrow()
      })

      it('then the watch callback ignores a falsy newState', async () => {
        const { watch } = await import('vue')
        let watchCallback: ((newState: any) => void) | undefined
        vi.mocked(watch).mockImplementation(((_source: any, cb: any) => {
          watchCallback = cb
          return vi.fn()
        }) as unknown as typeof watch)

        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        useTheme()

        expect(() => watchCallback?.(undefined)).not.toThrow()
      })
    })
  })

  describe('given updateTheme function', () => {
    describe('when called with partial preset', () => {
      it('then it merges partial preset with current preset', async () => {
        const mergedPreset = { ...mazUi, name: 'merged' }
        vi.mocked(inject).mockReturnValue(mockRefThemeState)
        vi.mocked(mergePresets).mockReturnValue(mergedPreset)

        const { updateTheme } = useTheme()
        const partialPreset = { foundation: { 'border-width': '2px' } } as ThemePresetOverrides

        await updateTheme(partialPreset)

        expect(mergePresets).toHaveBeenCalled()
      })
    })

    describe('when called with string name', () => {
      it('then it loads preset by string name', async () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)
        vi.mocked(getPreset).mockResolvedValue(mazUi)

        const { updateTheme } = useTheme()

        await updateTheme('ocean')

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(generateCSS).toHaveBeenCalledTimes(1)
        expect(injectCSS).toHaveBeenCalledTimes(1)
      })
    })

    describe('when called with preset having different name', () => {
      it('then it replaces preset completely', async () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const newPreset = { ...mazUi, name: 'different-preset' }
        const { updateTheme } = useTheme()

        await updateTheme(newPreset)

        expect(() => updateTheme(newPreset)).not.toThrow()
      })
    })

    describe('when theme state is not available', () => {
      it('then it returns early without error', async () => {
        vi.mocked(inject).mockReturnValue({ value: undefined })

        const { updateTheme } = useTheme()
        const partialPreset = { foundation: { 'border-width': '2px' } } as ThemePresetOverrides

        await expect(updateTheme(partialPreset)).resolves.toBeUndefined()
      })
    })

    describe('when strategy is buildtime', () => {
      it('then it does not call injectCSS after updateTheme', async () => {
        const buildtimeState: ThemeState = {
          ...mockThemeState,
          strategy: 'buildtime',
        }
        vi.mocked(inject).mockReturnValue({ value: buildtimeState })
        vi.mocked(mergePresets).mockReturnValue({ ...mazUi, name: 'merged' })

        const { updateTheme } = useTheme()
        await updateTheme({ foundation: { space: '0.25rem' } } as ThemePresetOverrides)

        expect(injectCSS).not.toHaveBeenCalled()
      })
    })

    describe('when preset is not found', () => {
      it('then it logs error and returns', async () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)
        vi.mocked(getPreset).mockResolvedValue(null as any)
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const { updateTheme } = useTheme()

        await updateTheme('maz-ui')

        expect(consoleSpy).toHaveBeenCalledWith('[@maz-ui/themes] No preset found - If you are using the buildtime strategy, you must provide a complete preset')
        consoleSpy.mockRestore()
      })
    })

    describe('when persistPreset is false on the state', () => {
      it('then updateTheme does not write the preset cookie', async () => {
        const { saveResolvedPresetName } = await import('../../utils/cookie-storage')
        vi.mocked(saveResolvedPresetName).mockClear()
        vi.mocked(inject).mockReturnValue({ value: { ...mockThemeState, persistPreset: false } })
        vi.mocked(mergePresets).mockReturnValue(mazUi)

        const { updateTheme } = useTheme()
        await updateTheme({ foundation: { 'border-width': '2px' } } as ThemePresetOverrides)

        expect(saveResolvedPresetName).not.toHaveBeenCalled()
      })
    })
  })

  describe('given setColorMode function', () => {
    describe('when called with dark mode', () => {
      it('then it sets cookie with dark value', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { setColorMode } = useTheme()

        setColorMode('dark')

        expect(setCookie).toHaveBeenCalledWith('maz-color-mode', 'dark')
      })
    })

    describe('when called with light mode', () => {
      it('then it sets cookie with light value', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { setColorMode } = useTheme()

        setColorMode('light')

        expect(setCookie).toHaveBeenCalledWith('maz-color-mode', 'light')
      })
    })

    describe('when called with auto mode', () => {
      it('then it sets cookie with auto value', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { setColorMode } = useTheme()

        setColorMode('auto')

        expect(setCookie).toHaveBeenCalledWith('maz-color-mode', 'auto')
      })

      it('then it saves resolved color mode', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { setColorMode } = useTheme()

        setColorMode('auto')

        expect(saveResolvedColorMode).toHaveBeenCalledWith('light')
      })
    })
  })

  describe('given toggleDarkMode function', () => {
    describe('when called', () => {
      it('then it calls setColorMode', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { toggleDarkMode } = useTheme()

        toggleDarkMode()

        expect(setCookie).toHaveBeenCalledWith('maz-color-mode', 'dark')
      })
    })
  })

  describe('given computed properties', () => {
    describe('when theme interface is accessed', () => {
      it('then it returns all computed values', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const result = useTheme()

        expect(result.presetName).toBeDefined()
        expect(result.colorMode).toBeDefined()
        expect(result.isDark).toBeDefined()
        expect(result.strategy).toBeDefined()
        expect(result.mode).toBeDefined()
        expect(result.darkModeStrategy).toBeDefined()
        expect(result.preset).toBeDefined()
      })
    })

    describe('when isDark is accessed', () => {
      it('then it returns dark mode status', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { isDark } = useTheme()

        expect(isDark.value).toBe(false)
      })
    })
  })

  describe('given error handling scenarios', () => {
    describe('when inject throws error', () => {
      it('then it falls back to global properties', () => {
        vi.mocked(inject).mockImplementation(() => {
          throw new Error('inject failed')
        })
        vi.mocked(getCurrentInstance).mockReturnValue({
          appContext: {
            app: {
              config: {
                globalProperties: {
                  $mazThemeState: mockRefThemeState,
                },
              },
            },
          },
        } as never)

        const result = useTheme()

        expect(result).toHaveProperty('presetName')
      })
    })

    describe('when global properties are not available', () => {
      it('then it throws installation error', () => {
        vi.mocked(inject).mockImplementation(() => {
          throw new Error('inject failed')
        })
        vi.mocked(getCurrentInstance).mockReturnValue(null)

        expect(() => useTheme()).toThrowError(
          '[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin, or wrap your components in a MazUiProvider, before using useTheme composable',
        )
      })
    })

    describe('when getCurrentInstance returns incomplete context', () => {
      it('then it throws installation error', () => {
        vi.mocked(inject).mockImplementation(() => {
          throw new Error('inject failed')
        })
        vi.mocked(getCurrentInstance).mockReturnValue({
          appContext: {
            app: {
              config: {
                globalProperties: undefined,
              },
            },
          },
        } as never)

        expect(() => useTheme()).toThrowError(
          '[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin, or wrap your components in a MazUiProvider, before using useTheme composable',
        )
      })
    })
  })

  describe('given setColorMode guard clause', () => {
    describe('when theme state becomes unavailable', () => {
      it('then it returns early without setting cookie', async () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)
        const { setColorMode } = useTheme()

        const { isServer } = await import('@maz-ui/utils/helpers/isServer')
        vi.mocked(isServer).mockReturnValue(true)
        vi.mocked(inject).mockReturnValue({ value: undefined })
        vi.mocked(getCurrentInstance).mockReturnValue(null)

        try {
          useTheme()
        }
        catch {}

        vi.mocked(isServer).mockReturnValue(false)
        vi.clearAllMocks()

        setColorMode('dark')

        expect(setCookie).not.toHaveBeenCalled()
      })
    })
  })

  describe('given updateTheme guard clause', () => {
    describe('when theme state becomes unavailable', () => {
      it('then it returns early without updating', async () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)
        const { updateTheme } = useTheme()

        const { isServer } = await import('@maz-ui/utils/helpers/isServer')
        vi.mocked(isServer).mockReturnValue(true)
        vi.mocked(inject).mockReturnValue({ value: undefined })
        vi.mocked(getCurrentInstance).mockReturnValue(null)

        try {
          useTheme()
        }
        catch {}

        vi.mocked(isServer).mockReturnValue(false)

        await expect(updateTheme({ foundation: { space: '0.25rem' } } as ThemePresetOverrides)).resolves.toBeUndefined()
        expect(mergePresets).not.toHaveBeenCalled()
      })
    })
  })

  describe('given colorMode computed setter', () => {
    describe('when colorMode value is set', () => {
      it('then it calls setColorMode via the setter', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { colorMode } = useTheme()

        colorMode.value = 'dark'

        expect(setCookie).toHaveBeenCalledWith('maz-color-mode', 'dark')
      })
    })

    describe('when colorMode value is read', () => {
      it('then the getter returns the active color mode from theme state', () => {
        vi.mocked(inject).mockReturnValue(mockRefThemeState)

        const { colorMode } = useTheme()

        expect(colorMode.value).toBe(mockRefThemeState.value.colorMode)
      })
    })
  })
})
