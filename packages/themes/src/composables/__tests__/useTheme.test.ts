import type { Ref } from 'vue'
import type { ThemePreset, ThemePresetOverrides, ThemeState } from '../../types'
import { createApp, defineComponent, ref } from 'vue'
import { mazUi } from '../../presets'
import { useTheme } from '../useTheme'

const { generateCSS, getActiveThemeState, getPreset, injectCSS, isServer, mergePresets, readPresetPreference, runViewTransition, saveColorModeChoice, savePresetPreference, setActiveThemeState } = vi.hoisted(() => ({
  generateCSS: vi.fn(() => 'full-css'),
  getActiveThemeState: vi.fn((): Ref<ThemeState | undefined> | undefined => undefined),
  getPreset: vi.fn(),
  injectCSS: vi.fn(),
  isServer: vi.fn(() => false),
  mergePresets: vi.fn((base: ThemePreset, overrides: ThemePresetOverrides) => ({
    ...base,
    ...overrides,
    name: base.name,
  })),
  readPresetPreference: vi.fn((): { base: string, active: string } | null => null),
  runViewTransition: vi.fn((apply: () => void) => {
    apply()
    return Promise.resolve()
  }),
  saveColorModeChoice: vi.fn(),
  savePresetPreference: vi.fn(),
  setActiveThemeState: vi.fn(),
}))

vi.mock('../../utils/css-generator', () => ({
  CSS_ID: 'maz-theme-css',
  generateCSS,
  injectCSS,
}))

vi.mock('../../utils/get-preset', () => ({ getPreset }))

vi.mock('../../utils/preset-merger', () => ({ mergePresets }))

vi.mock('../../utils/no-transition', () => ({
  noTransition: (fn: (...args: any[]) => any, ...args: any[]) => fn(...args),
}))

vi.mock('../../utils/theme-preferences', () => ({
  readPresetPreference,
  saveColorModeChoice,
  savePresetPreference,
}))

vi.mock('../../utils/theme-state-registry', () => ({
  getActiveThemeState,
  setActiveThemeState,
}))

vi.mock('../../utils/view-transition', () => ({ runViewTransition }))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({ isServer }))

function createState(overrides: Partial<ThemeState> = {}): ThemeState {
  return {
    preset: mazUi,
    colorMode: 'light',
    darkClass: 'dark',
    lightClass: 'light',
    strategy: 'runtime',
    darkModeStrategy: 'class',
    mode: 'both',
    isDark: false,
    persistPreset: true,
    ...overrides,
  }
}

function withThemeState<T>(state: Ref<ThemeState | undefined>, fn: () => T): T {
  const app = createApp({})
  app.provide('mazThemeState', state)
  return app.runWithContext(fn)
}

describe('useTheme', () => {
  afterEach(() => {
    vi.clearAllMocks()
    isServer.mockReturnValue(false)
    getActiveThemeState.mockReturnValue(undefined)
    readPresetPreference.mockReturnValue(null)
  })

  describe('given no theme state', () => {
    describe('when useTheme is called', () => {
      it('then it throws an installation error', () => {
        expect(() => useTheme()).toThrow('useTheme requires the MazUi/MazUiTheme plugin or a MazUiProvider wrapper')
      })
    })
  })

  describe('given a provided theme state', () => {
    describe('when useTheme is called', () => {
      it('then it exposes the state', () => {
        const state = ref(createState({ colorMode: 'dark', isDark: true }))

        const theme = withThemeState(state, () => useTheme())

        expect(theme.colorMode.value).toBe('dark')
        expect(theme.isDark.value).toBe(true)
        expect(theme.preset.value).toStrictEqual(mazUi)
        expect(theme.presetName.value).toBe('maz-ui')
        expect(theme.currentPreset.value).toStrictEqual(mazUi)
        expect(theme.strategy.value).toBe('runtime')
        expect(theme.mode.value).toBe('both')
        expect(theme.darkModeStrategy.value).toBe('class')
      })

      it('then the state becomes the fallback of the calls made outside a component', () => {
        const state = ref(createState())

        withThemeState(state, () => useTheme())

        expect(setActiveThemeState).toHaveBeenCalledWith(state)
      })
    })

    describe('when the state changes after the call', () => {
      it('then the computed values follow it', () => {
        const state = ref(createState())
        const theme = withThemeState(state, () => useTheme())

        state.value.isDark = true
        state.value.colorMode = 'dark'

        expect(theme.isDark.value).toBe(true)
        expect(theme.colorMode.value).toBe('dark')
      })
    })
  })

  describe('given a theme state on the global properties only', () => {
    describe('when useTheme is called', () => {
      it('then it uses it', () => {
        const state = ref(createState({ colorMode: 'auto' }))
        let theme: ReturnType<typeof useTheme> | undefined
        const app = createApp(defineComponent({
          setup() {
            theme = useTheme()
            return () => null
          },
        }))
        app.config.globalProperties.$mazThemeState = state as Ref<ThemeState>

        app.mount(document.createElement('div'))

        expect(theme?.colorMode.value).toBe('auto')
        app.unmount()
      })
    })
  })

  describe('given two apps with their own theme state', () => {
    describe('when useTheme is called in each of them', () => {
      it('then each call reads the state of its own app', () => {
        const first = ref(createState({ colorMode: 'light' }))
        const second = ref(createState({ colorMode: 'dark' }))

        const firstTheme = withThemeState(first, () => useTheme())
        const secondTheme = withThemeState(second, () => useTheme())

        expect(firstTheme.colorMode.value).toBe('light')
        expect(secondTheme.colorMode.value).toBe('dark')
      })
    })
  })

  describe('given a provided theme state not resolved yet', () => {
    describe('when useTheme is called', () => {
      it('then it uses the installed state', () => {
        getActiveThemeState.mockReturnValue(ref(createState({ colorMode: 'dark' })))

        const theme = withThemeState(ref(undefined), () => useTheme())

        expect(theme.colorMode.value).toBe('dark')
        expect(setActiveThemeState).not.toHaveBeenCalled()
      })
    })
  })

  describe('given a call outside a component in the browser', () => {
    describe('when a theme state was installed before', () => {
      it('then it uses the installed state', () => {
        getActiveThemeState.mockReturnValue(ref(createState({ colorMode: 'dark' })))

        expect(useTheme().colorMode.value).toBe('dark')
      })
    })
  })

  describe('given a call outside a component on the server', () => {
    describe('when a theme state was installed before', () => {
      it('then it never reuses it', () => {
        isServer.mockReturnValue(true)
        getActiveThemeState.mockReturnValue(ref(createState()))

        expect(() => useTheme()).toThrow()
      })
    })

    describe('when the state is provided', () => {
      it('then it is not kept for the next requests', () => {
        isServer.mockReturnValue(true)

        withThemeState(ref(createState()), () => useTheme())

        expect(setActiveThemeState).not.toHaveBeenCalled()
      })
    })
  })

  describe('given updateTheme', () => {
    describe('when called with overrides', () => {
      it('then it merges them in the current preset and injects the CSS', async () => {
        const state = ref(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme({
          foundation: { 'border-width': '2px' },
        } as ThemePresetOverrides)

        expect(mergePresets).toHaveBeenCalledWith(mazUi, {
          foundation: { 'border-width': '2px' },
        })
        expect(injectCSS).toHaveBeenCalledWith('maz-theme-css', 'full-css')
      })
    })

    describe('when called with the name of another preset', () => {
      it('then it loads and applies it', async () => {
        const ocean = { ...mazUi, name: 'ocean' }
        getPreset.mockResolvedValue(ocean)
        const state = ref(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme('ocean')

        expect(getPreset).toHaveBeenCalledWith('ocean')
        expect(state.value.preset).toEqual(ocean)
        expect(mergePresets).not.toHaveBeenCalled()
      })
    })

    describe('when the strategy is buildtime', () => {
      it('then it does not inject CSS', async () => {
        const state = ref(createState({ strategy: 'buildtime' }))
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme({
          foundation: { 'border-width': '2px' },
        } as ThemePresetOverrides)

        expect(injectCSS).not.toHaveBeenCalled()
      })
    })

    describe('when the preset is not found', () => {
      it('then it logs an error and keeps the preset', async () => {
        getPreset.mockResolvedValue(null)
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const state = ref(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme('unknown' as never)

        expect(consoleSpy).toHaveBeenCalledWith('[@maz-ui/themes] No preset found — with buildtime strategy you must pass a full preset')
        expect(state.value.preset).toStrictEqual(mazUi)
        consoleSpy.mockRestore()
      })
    })

    describe('when persistPreset is false', () => {
      it('then it does not write the preset cookie', async () => {
        const state = ref(createState({ persistPreset: false }))
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme({
          foundation: { 'border-width': '2px' },
        } as ThemePresetOverrides)

        expect(savePresetPreference).not.toHaveBeenCalled()
      })
    })

    describe('when the state knows the configured preset', () => {
      it('then the cookie keeps it as the base', async () => {
        getPreset.mockResolvedValue({ ...mazUi, name: 'ocean' })
        const state = ref(createState({ presetBase: 'folio' }))
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme('ocean')

        expect(savePresetPreference).toHaveBeenCalledWith('folio', 'ocean')
      })
    })

    describe('when only the cookie knows the configured preset', () => {
      it('then the cookie keeps its base', async () => {
        getPreset.mockResolvedValue({ ...mazUi, name: 'ocean' })
        readPresetPreference.mockReturnValue({ base: 'nova', active: 'nova' })
        const state = ref(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme('ocean')

        expect(savePresetPreference).toHaveBeenCalledWith('nova', 'ocean')
      })
    })

    describe('when nothing knows the configured preset', () => {
      it('then the new preset becomes the base', async () => {
        getPreset.mockResolvedValue({ ...mazUi, name: 'ocean' })
        const state = ref(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())

        await updateTheme('ocean')

        expect(savePresetPreference).toHaveBeenCalledWith('ocean', 'ocean')
      })
    })

    describe('when the state is gone', () => {
      it('then it does nothing', async () => {
        const state = ref<ThemeState | undefined>(createState())
        const { updateTheme } = withThemeState(state, () => useTheme())
        state.value = undefined

        await updateTheme('ocean')

        expect(getPreset).not.toHaveBeenCalled()
      })
    })
  })

  describe('given setColorMode', () => {
    describe('when called', () => {
      it('then it updates the state and saves the choice of the user', async () => {
        const state = ref(createState())
        const { setColorMode } = withThemeState(state, () => useTheme())

        await setColorMode('auto')

        expect(state.value.colorMode).toBe('auto')
        expect(saveColorModeChoice).toHaveBeenCalledWith('auto')
      })
    })

    describe('when called with the animate option', () => {
      it('then it applies the change in a view transition', async () => {
        const state = ref(createState())
        const { setColorMode } = withThemeState(state, () => useTheme())

        await setColorMode('dark', { animate: true })

        expect(runViewTransition).toHaveBeenCalledOnce()
        expect(state.value.colorMode).toBe('dark')
      })
    })

    describe('when the colorMode computed is set', () => {
      it('then it calls setColorMode', () => {
        const state = ref(createState())
        const { colorMode } = withThemeState(state, () => useTheme())

        colorMode.value = 'dark'

        expect(state.value.colorMode).toBe('dark')
        expect(saveColorModeChoice).toHaveBeenCalledWith('dark')
      })
    })

    describe('when the state is gone', () => {
      it('then it does nothing', async () => {
        const state = ref<ThemeState | undefined>(createState())
        const { setColorMode } = withThemeState(state, () => useTheme())
        state.value = undefined

        await setColorMode('dark')

        expect(saveColorModeChoice).not.toHaveBeenCalled()
      })
    })
  })

  describe('given toggleDarkMode', () => {
    describe('when the light mode is active', () => {
      it('then it switches to dark', async () => {
        const state = ref(createState())
        const { toggleDarkMode } = withThemeState(state, () => useTheme())

        await toggleDarkMode()

        expect(state.value.colorMode).toBe('dark')
      })
    })

    describe('when the dark mode is active', () => {
      it('then it switches to light in a view transition', async () => {
        const state = ref(createState({ colorMode: 'dark', isDark: true }))
        const { toggleDarkMode } = withThemeState(state, () => useTheme())

        await toggleDarkMode({ animate: true })

        expect(state.value.colorMode).toBe('light')
        expect(runViewTransition).toHaveBeenCalledOnce()
      })
    })
  })
})
