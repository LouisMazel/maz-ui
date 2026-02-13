import type { App } from 'vue'
import type { MazUiTranslationsInstance } from '../../types'
import { injectTranslations } from '../inject'

function createMockApp(): App {
  return {
    provide: vi.fn(),
    config: {
      globalProperties: {} as Record<string, unknown>,
    },
  } as unknown as App
}

function createMockI18n(): MazUiTranslationsInstance {
  return {
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
}

describe('inject', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given injectTranslations function', () => {
    describe('when no app is provided', () => {
      it('then it throws an error with the expected message', () => {
        const i18n = createMockI18n()

        expect(() => injectTranslations({ app: undefined, i18n })).toThrow(
          '[@maz-ui/translations](injectTranslations) No app instance provided',
        )
      })
    })

    describe('when a valid app is provided', () => {
      it('then it sets $mazTranslations on globalProperties', () => {
        const app = createMockApp()
        const i18n = createMockI18n()

        injectTranslations({ app, i18n })

        expect(app.config.globalProperties.$mazTranslations).toBe(i18n)
      })

      it('then it calls app.provide with mazTranslations key and the i18n instance', () => {
        const app = createMockApp()
        const i18n = createMockI18n()

        injectTranslations({ app, i18n })

        expect(app.provide).toHaveBeenCalledWith('mazTranslations', i18n)
      })
    })

    describe('when called with different i18n instances', () => {
      it('then it provides the exact instance passed in', () => {
        const app = createMockApp()
        const i18n = createMockI18n()

        injectTranslations({ app, i18n })

        expect(app.provide).toHaveBeenCalledWith('mazTranslations', i18n)
        expect(app.config.globalProperties.$mazTranslations).toBe(i18n)
      })
    })
  })
})
