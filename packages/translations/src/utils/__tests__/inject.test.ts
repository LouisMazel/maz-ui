import type { App } from 'vue'
import type { MazUiTranslationsInstance } from '../../types'
import { getActiveTranslations, setActiveTranslations } from '../active-instance'
import { injectTranslations } from '../inject'

const { isServer } = vi.hoisted(() => ({
  isServer: vi.fn(() => false),
}))

vi.mock('@maz-ui/utils/helpers/isServer', () => ({ isServer }))

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
    isServer.mockReturnValue(false)
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

  describe('given the environment', () => {
    describe('when the instance is injected in the browser', () => {
      it('then it becomes the active instance', () => {
        const i18n = createMockI18n()

        injectTranslations({
          app: createMockApp(),
          i18n,
        })

        expect(getActiveTranslations()).toBe(i18n)
      })
    })

    describe('when the instance is injected on the server', () => {
      it('then it is not kept for the next requests', () => {
        isServer.mockReturnValue(true)
        const previous = createMockI18n()
        setActiveTranslations(previous)

        injectTranslations({
          app: createMockApp(),
          i18n: createMockI18n(),
        })

        expect(getActiveTranslations()).toBe(previous)
      })
    })
  })
})
