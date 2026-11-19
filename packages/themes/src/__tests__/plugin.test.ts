import type { App, Ref } from 'vue'
import type { ThemeState } from '../types/index.ts'
import { MazUiTheme } from '../plugin.ts'

vi.mock('../utils/setup-theme.ts', () => ({
  setupTheme: vi.fn(),
}))

vi.mock('../utils/index.ts', () => ({
  injectThemeState: vi.fn(),
}))

const { setupTheme } = await import('../utils/setup-theme.ts')
const { injectThemeState } = await import('../utils/index.ts')

describe('plugin', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given MazUiTheme plugin', () => {
    describe('when install is called with an app and options', () => {
      it('then it calls setupTheme with the provided options', () => {
        const mockThemeState = {
          value: { isDark: false },
        } as Ref<ThemeState>
        vi.mocked(setupTheme).mockReturnValue({
          themeState: mockThemeState,
          cleanup: vi.fn(),
        })

        const mockApp = {
          provide: vi.fn(),
          config: { globalProperties: {} },
        } as unknown as App

        const options = {
          strategy: 'runtime' as const,
          colorMode: 'auto' as const,
        }

        MazUiTheme.install!(mockApp, options)

        expect(setupTheme).toHaveBeenCalledWith(options)
      })

      it('then it calls injectThemeState with the app and the returned themeState', () => {
        const mockThemeState = {
          value: { isDark: false },
        } as Ref<ThemeState>
        vi.mocked(setupTheme).mockReturnValue({
          themeState: mockThemeState,
          cleanup: vi.fn(),
        })

        const mockApp = {
          provide: vi.fn(),
          config: { globalProperties: {} },
        } as unknown as App

        const options = {
          strategy: 'runtime' as const,
        }

        MazUiTheme.install!(mockApp, options)

        expect(injectThemeState).toHaveBeenCalledWith({
          app: mockApp,
          themeState: mockThemeState,
        })
      })
    })

    describe('when install is called with minimal options', () => {
      it('then it passes those options through to setupTheme', () => {
        const mockThemeState = {
          value: { isDark: true },
        } as Ref<ThemeState>
        vi.mocked(setupTheme).mockReturnValue({
          themeState: mockThemeState,
          cleanup: vi.fn(),
        })

        const mockApp = {
          provide: vi.fn(),
          config: { globalProperties: {} },
        } as unknown as App

        const options = {}

        MazUiTheme.install!(mockApp, options)

        expect(setupTheme).toHaveBeenCalledWith(options)
        expect(injectThemeState).toHaveBeenCalledWith({
          app: mockApp,
          themeState: mockThemeState,
        })
      })
    })
  })
})
