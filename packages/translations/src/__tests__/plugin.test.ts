import type { App } from 'vue'
import type { MazUiTranslationsInstance } from '../types'

vi.mock('../utils/instance', () => ({
  createMazUiTranslations: vi.fn(),
}))

vi.mock('../utils/inject', () => ({
  injectTranslations: vi.fn(),
}))

const { createMazUiTranslations } = await import('../utils/instance')
const { injectTranslations } = await import('../utils/inject')
const { MazUiTranslations } = await import('../plugin')

const mockInstance: MazUiTranslationsInstance = {
  locale: { value: 'en' },
  t: vi.fn(),
  setLocale: vi.fn(),
  isLocaleLoaded: vi.fn(),
  isLocaleLoading: vi.fn(),
  setLocaleMessage: vi.fn(),
  getMessages: vi.fn(),
  getLoadedLocales: vi.fn(),
  getAvailableLocales: vi.fn(),
} as unknown as MazUiTranslationsInstance

function createMockApp(): App {
  return {
    provide: vi.fn(),
    config: {
      globalProperties: {} as Record<string, unknown>,
    },
  } as unknown as App
}

describe('plugin', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given MazUiTranslations plugin', () => {
    describe('when install is called with default options', () => {
      it('then it calls createMazUiTranslations with an empty options object', () => {
        const app = createMockApp()
        vi.mocked(createMazUiTranslations).mockReturnValue(mockInstance)

        MazUiTranslations.install!(app, {})

        expect(createMazUiTranslations).toHaveBeenCalledWith({})
      })

      it('then it calls injectTranslations with the app and the created instance', () => {
        const app = createMockApp()
        vi.mocked(createMazUiTranslations).mockReturnValue(mockInstance)

        MazUiTranslations.install!(app, {})

        expect(injectTranslations).toHaveBeenCalledWith({ app, i18n: mockInstance })
      })

      it('then it returns the created instance', () => {
        const app = createMockApp()
        vi.mocked(createMazUiTranslations).mockReturnValue(mockInstance)

        const result = MazUiTranslations.install!(app, {})

        expect(result).toBe(mockInstance)
      })
    })

    describe('when install is called with custom options', () => {
      it('then it passes the custom options to createMazUiTranslations', () => {
        const app = createMockApp()
        const options = { locale: 'fr', fallbackLocale: 'en', preloadFallback: false }
        vi.mocked(createMazUiTranslations).mockReturnValue(mockInstance)

        MazUiTranslations.install!(app, options)

        expect(createMazUiTranslations).toHaveBeenCalledWith(options)
      })
    })

    describe('when install is called without explicit options', () => {
      it('then it defaults to an empty options object', () => {
        const app = createMockApp()
        vi.mocked(createMazUiTranslations).mockReturnValue(mockInstance)

        MazUiTranslations.install!(app)

        expect(createMazUiTranslations).toHaveBeenCalledWith({})
      })
    })
  })
})
