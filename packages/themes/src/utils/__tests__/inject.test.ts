import type { App, Ref } from 'vue'
import type { ThemeState } from '../../types'
import { ref } from 'vue'
import { injectThemeState } from '../inject'

function createMockApp(): App {
  return {
    provide: vi.fn(),
    config: {
      globalProperties: {} as Record<string, unknown>,
    },
  } as unknown as App
}

function createMockThemeState(): Ref<ThemeState> {
  return ref({
    colorMode: 'auto',
    isDark: false,
    mode: 'both',
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    darkClass: 'dark',
  }) as Ref<ThemeState>
}

describe('inject', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given injectThemeState function', () => {
    describe('when no app is provided', () => {
      it('then it throws an error', () => {
        const themeState = createMockThemeState()

        expect(() => injectThemeState({ app: undefined, themeState })).toThrow(
          '[@maz-ui/themes](injectThemeState) No app provided',
        )
      })
    })

    describe('when a valid app is provided', () => {
      it('then it calls app.provide with the theme state', () => {
        const app = createMockApp()
        const themeState = createMockThemeState()

        injectThemeState({ app, themeState })

        expect(app.provide).toHaveBeenCalledWith('mazThemeState', themeState)
      })

      it('then it sets $mazThemeState on globalProperties', () => {
        const app = createMockApp()
        const themeState = createMockThemeState()

        injectThemeState({ app, themeState })

        expect(app.config.globalProperties.$mazThemeState).toBe(themeState)
      })
    })

    describe('when called with different theme states', () => {
      it('then it provides the exact ref passed in', () => {
        const app = createMockApp()
        const themeState = createMockThemeState()
        themeState.value.isDark = true
        themeState.value.colorMode = 'dark'

        injectThemeState({ app, themeState })

        expect(app.provide).toHaveBeenCalledWith('mazThemeState', themeState)
        expect(app.config.globalProperties.$mazThemeState).toBe(themeState)
      })
    })
  })
})
