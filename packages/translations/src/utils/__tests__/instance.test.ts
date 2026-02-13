import { globalState, locale } from '../../states'

vi.mock('../locales', () => ({
  loadLocale: vi.fn(() => Promise.resolve()),
  getAvailableLocales: vi.fn(() => ['en', 'fr']),
  getLoadedLocales: vi.fn(() => ['en']),
  getMessages: vi.fn(() => ({})),
  isLocaleLoaded: vi.fn(() => false),
  isLocaleLoading: vi.fn(() => false),
  setLocale: vi.fn(),
  setLocaleMessage: vi.fn(),
}))

vi.mock('../messages', () => ({
  t: vi.fn(() => 'translated'),
}))

const { loadLocale } = await import('../locales')
const { t } = await import('../messages')
const { createMazUiTranslations } = await import('../instance')

describe('instance', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    locale.value = 'en'
    globalState.loadedLocales = new Set()
    globalState.messages = {}
    globalState.userMessages = {}
    globalState.loadingPromises = new Map()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('given createMazUiTranslations function', () => {
    describe('when called with no options', () => {
      it('then it sets locale to en by default', () => {
        createMazUiTranslations()

        expect(locale.value).toBe('en')
      })

      it('then it populates userMessages with default en entry', () => {
        createMazUiTranslations()

        expect(globalState.userMessages).toHaveProperty('en')
      })

      it('then it populates messages with default en entry', () => {
        createMazUiTranslations()

        expect(globalState.messages).toHaveProperty('en')
      })
    })

    describe('when called with a custom locale', () => {
      it('then it sets locale to the provided value', () => {
        createMazUiTranslations({ locale: 'fr' })

        expect(locale.value).toBe('fr')
      })
    })

    describe('when called with user messages', () => {
      it('then it stores object messages in both userMessages and messages', () => {
        const customMessages = { greeting: 'Bonjour' } as any

        createMazUiTranslations({
          locale: 'fr',
          messages: { fr: customMessages },
        })

        expect(globalState.userMessages.fr).toStrictEqual(customMessages)
        expect((globalState.messages.fr as any).greeting).toBe('Bonjour')
      })

      it('then it stores function messages in userMessages only', () => {
        const loader = () => Promise.resolve({ greeting: 'Hola' })

        createMazUiTranslations({
          locale: 'es',
          messages: { es: loader as any },
        })

        expect(globalState.userMessages.es).toBe(loader)
      })
    })

    describe('when preloadFallback is true (default) and fallback differs from locale', () => {
      it('then it loads both the initial locale and the fallback after setTimeout', () => {
        createMazUiTranslations({ locale: 'fr', fallbackLocale: 'en' })

        vi.runAllTimers()

        expect(loadLocale).toHaveBeenCalledWith('fr')
        expect(loadLocale).toHaveBeenCalledWith('en')
      })
    })

    describe('when preloadFallback is false', () => {
      it('then it loads only the initial locale after setTimeout', () => {
        createMazUiTranslations({ locale: 'fr', fallbackLocale: 'en', preloadFallback: false })

        vi.runAllTimers()

        expect(loadLocale).toHaveBeenCalledWith('fr')
        expect(loadLocale).not.toHaveBeenCalledWith('en')
      })
    })

    describe('when fallback locale equals the initial locale', () => {
      it('then it loads only the initial locale after setTimeout', () => {
        createMazUiTranslations({ locale: 'en', fallbackLocale: 'en' })

        vi.runAllTimers()

        expect(loadLocale).toHaveBeenCalledTimes(1)
        expect(loadLocale).toHaveBeenCalledWith('en')
      })
    })

    describe('when the returned instance is examined', () => {
      it('then it exposes all required methods and properties', () => {
        const instance = createMazUiTranslations()

        expect(instance).toHaveProperty('locale')
        expect(instance).toHaveProperty('t')
        expect(instance).toHaveProperty('setLocale')
        expect(instance).toHaveProperty('isLocaleLoaded')
        expect(instance).toHaveProperty('isLocaleLoading')
        expect(instance).toHaveProperty('setLocaleMessage')
        expect(instance).toHaveProperty('getMessages')
        expect(instance).toHaveProperty('getLoadedLocales')
        expect(instance).toHaveProperty('getAvailableLocales')
      })
    })

    describe('when calling t on the returned instance', () => {
      it('then it delegates to the t function with the fallback locale', () => {
        const instance = createMazUiTranslations({ fallbackLocale: 'de' })

        instance.t('some.key' as any, { count: 5 })

        expect(t).toHaveBeenCalledWith('some.key', { count: 5 }, 'de')
      })
    })

    describe('when calling t on the returned instance without variables', () => {
      it('then it passes undefined for variables', () => {
        const instance = createMazUiTranslations({ fallbackLocale: 'en' })

        instance.t('greeting' as any)

        expect(t).toHaveBeenCalledWith('greeting', undefined, 'en')
      })
    })

    describe('when loadLocale rejects during setTimeout', () => {
      it('then it catches the error without throwing', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.mocked(loadLocale).mockRejectedValueOnce(new Error('load failed'))

        createMazUiTranslations({ locale: 'xx' })

        expect(() => vi.runAllTimers()).not.toThrow()
        errorSpy.mockRestore()
      })
    })
  })
})
