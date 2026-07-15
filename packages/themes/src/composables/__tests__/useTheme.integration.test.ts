import type { ThemeState } from '../../types'
import { createApp, ref } from 'vue'
import { mazUi } from '../../presets'
import { useTheme } from '../useTheme'

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

vi.mock('../../utils/cookie-storage', () => ({
  saveResolvedPresetName: vi.fn(),
  getSavedPresetName: vi.fn(() => null),
  clearSavedPresetName: vi.fn(),
}))

vi.mock('@maz-ui/utils/helpers/cookie', () => ({
  setCookie: vi.fn(),
  getCookie: vi.fn(),
  deleteCookie: vi.fn(),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({
  isServer: vi.fn(() => false),
}))

function provideThemeState(state: ThemeState) {
  const themeStateRef = ref(state)
  const app = createApp({})
  app.provide('mazThemeState', themeStateRef)
  return { app, themeStateRef }
}

function runWithTheme(
  state: ThemeState,
  fn: (api: ReturnType<typeof useTheme>, reactiveState: ThemeState) => void | Promise<void>,
) {
  const { app, themeStateRef } = provideThemeState(state)
  return app.runWithContext(async () => {
    const api = useTheme()
    await fn(api, themeStateRef.value)
    return themeStateRef
  })
}

describe('useTheme integration with real vue reactivity', () => {
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
    vi.unstubAllGlobals()
  })

  describe('given toggleDarkMode with real reactive state', () => {
    describe('when toggled twice from a light state', () => {
      it('then it switches to dark then back to light', async () => {
        const state: ThemeState = {
          preset: mazUi,
          colorMode: 'light',
          darkClass: 'dark',
          lightClass: 'light',
          strategy: 'runtime',
          darkModeStrategy: 'class',
          mode: 'both',
          isDark: false,
          persistPreset: false,
        }

        await runWithTheme(state, async ({ toggleDarkMode }, reactiveState) => {
          await toggleDarkMode()
          expect(reactiveState.colorMode).toBe('dark')
          reactiveState.isDark = true
          await toggleDarkMode()
          expect(reactiveState.colorMode).toBe('light')
        })
      })
    })
  })
})
