import type { ThemePresetOverrides, ThemeState } from '../../types'
import { getCurrentInstance, inject } from 'vue'
import { mazUi } from '../../presets'
import { mergePresets } from '../../utils'
import { generateCriticalCSS, generateFullCSS, injectCSS } from '../../utils/css-generator'
import { getPreset } from '../../utils/get-preset'
import { initThemeState, useTheme } from '../useTheme'

const mockThemeState: ThemeState = {
  currentPreset: mazUi,
  colorMode: 'light',
  isDark: false,
  strategy: 'runtime',
  darkModeStrategy: 'class',
}

function mockDocumentCookie(cookies: string = '') {
  const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie')

  if (cookieDescriptor && cookieDescriptor.configurable) {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: cookies,
    })
  }
}

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
  }
})

vi.mock('../../utils/css-generator', () => ({
  generateCriticalCSS: vi.fn(() => 'critical-css'),
  generateFullCSS: vi.fn(() => 'full-css'),
  injectCSS: vi.fn(),
}))

vi.mock('../../utils/get-color-mode', () => ({
  getColorMode: vi.fn(),
  getSystemPrefersDark: vi.fn(),
}))

vi.mock('../../utils/get-preset', () => ({
  getPreset: vi.fn(),
}))

vi.mock('../../utils/preset-merger', () => ({
  mergePresets: vi.fn(),
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
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        useTheme()

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[@maz-ui/themes] You must install the MazUi or MazUiTheme plugin before using useTheme composable',
        )
      })
    })

    describe('when state is injected', () => {
      it('then it returns theme interface', () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const result = useTheme()

        expect(result).toHaveProperty('currentPreset')
        expect(result).toHaveProperty('colorMode')
        expect(result).toHaveProperty('isDark')
        expect(result).toHaveProperty('strategy')
        expect(result).toHaveProperty('updateTheme')
        expect(result).toHaveProperty('setColorMode')
        expect(result).toHaveProperty('toggleDarkMode')
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
                  $adsThemeState: mockThemeState,
                },
              },
            },
          },
        } as never)

        const result = useTheme()

        expect(result).toHaveProperty('currentPreset')
      })
    })
  })

  describe('given initThemeState function', () => {
    describe('when provided theme state', () => {
      it('then it sets internal state', () => {
        expect(() => initThemeState(mockThemeState)).not.toThrow()
      })
    })

    describe('when strategy is media', () => {
      it('then it does not modify document class', () => {
        const mediaThemeState = { ...mockThemeState, darkModeStrategy: 'media' as const }

        initThemeState(mediaThemeState)

        expect(document.documentElement.classList.add).not.toHaveBeenCalled()
        expect(document.documentElement.classList.remove).not.toHaveBeenCalled()
      })
    })

    describe('when colorMode is auto', () => {
      it('then it adds media query listener', () => {
        const mockMediaQuery = {
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }
        vi.mocked(globalThis.matchMedia).mockReturnValue(mockMediaQuery as MediaQueryList)

        const autoThemeState = { ...mockThemeState, colorMode: 'auto' as const }

        initThemeState(autoThemeState)

        expect(globalThis.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
      })
    })

    describe('when window is undefined', () => {
      it('then it handles gracefully', () => {
        vi.stubGlobal('window', undefined)

        const autoThemeState = { ...mockThemeState, colorMode: 'auto' as const }

        expect(() => initThemeState(autoThemeState)).not.toThrow()
      })
    })

    describe('when isDark is true', () => {
      it('then it updates document class', () => {
        const darkThemeState = { ...mockThemeState, isDark: true }

        initThemeState(darkThemeState)

        expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
      })
    })

    describe('when isDark is false', () => {
      it('then it removes document class', () => {
        const lightThemeState = { ...mockThemeState, isDark: false }

        initThemeState(lightThemeState)

        expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark')
      })
    })
  })

  describe('given composable functions', () => {
    describe('when setColorMode is called with dark', () => {
      it('then it updates document cookie', () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)
        mockDocumentCookie('')

        const { setColorMode } = useTheme()

        setColorMode('dark')

        expect(document.cookie).toContain('maz-color-mode=dark')
      })
    })

    describe('when setColorMode is called with auto mode', () => {
      it('then it detects system preference', () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)
        vi.mocked(globalThis.matchMedia).mockReturnValue({ matches: true } as MediaQueryList)

        const { setColorMode } = useTheme()

        setColorMode('auto')

        expect(globalThis.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
      })
    })

    describe('when toggleDarkMode is called', () => {
      it('then it switches between modes', () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const { toggleDarkMode } = useTheme()

        expect(() => toggleDarkMode()).not.toThrow()
      })
    })

    describe('when updateTheme is called with string name', () => {
      it('then it loads preset by string name', async () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)
        vi.mocked(getPreset).mockResolvedValue(mazUi)

        const { updateTheme } = useTheme()

        await updateTheme('ocean')

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(generateCriticalCSS).toHaveBeenCalled()
        expect(generateFullCSS).toHaveBeenCalled()
        expect(injectCSS).toHaveBeenCalledTimes(2)
      })
    })

    describe('when updateTheme is called with partial preset', () => {
      it('then it merges partial preset with current preset', async () => {
        const mergedPreset = { ...mazUi, name: 'merged' }
        vi.mocked(inject).mockReturnValue(mockThemeState)
        vi.mocked(mergePresets).mockReturnValue(mergedPreset)

        const { updateTheme } = useTheme()
        const partialPreset = { foundation: { 'border-width': '2px' } } as ThemePresetOverrides

        await updateTheme(partialPreset)

        expect(mergePresets).toHaveBeenCalled()
      })
    })

    describe('when updateTheme is called with preset having different name', () => {
      it('then it replaces preset', async () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const newPreset = { ...mazUi, name: 'different-preset' }
        const { updateTheme } = useTheme()

        await updateTheme(newPreset)

        expect(() => updateTheme(newPreset)).not.toThrow()
      })
    })
  })

  describe('given computed properties', () => {
    describe('when theme interface is requested', () => {
      it('then it returns computed properties', () => {
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const result = useTheme()

        expect(result.currentPreset).toBeDefined()
        expect(result.colorMode).toBeDefined()
        expect(result.isDark).toBeDefined()
        expect(result.strategy).toBeDefined()
      })
    })
  })

  describe('given error handling scenarios', () => {
    describe('when document is undefined', () => {
      it('then it handles gracefully', () => {
        vi.stubGlobal('document', undefined)

        expect(() => initThemeState(mockThemeState)).not.toThrow()
      })
    })

    describe('when window is undefined in setColorMode', () => {
      it('then it handles gracefully', () => {
        vi.stubGlobal('window', undefined)
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const { setColorMode } = useTheme()

        expect(() => setColorMode('auto')).not.toThrow()
      })
    })

    describe('when document is unavailable for cookies', () => {
      it('then it handles gracefully', () => {
        vi.stubGlobal('document', undefined)
        vi.mocked(inject).mockReturnValue(mockThemeState)

        const { setColorMode } = useTheme()

        expect(() => setColorMode('dark')).not.toThrow()
      })
    })

    describe('when media query change events occur', () => {
      it('then it handles media query change events', () => {
        const changeHandler = vi.fn()
        const mockMediaQuery = {
          matches: true,
          addEventListener: vi.fn((event, handler) => {
            if (event === 'change')
              changeHandler.mockImplementation(handler)
          }),
          removeEventListener: vi.fn(),
          media: '(prefers-color-scheme: dark)',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }

        vi.mocked(globalThis.matchMedia).mockReturnValue(mockMediaQuery as MediaQueryList)

        const autoThemeState = { ...mockThemeState, colorMode: 'auto' as const }
        initThemeState(autoThemeState)

        expect(() => changeHandler()).not.toThrow()
      })
    })
  })
})
