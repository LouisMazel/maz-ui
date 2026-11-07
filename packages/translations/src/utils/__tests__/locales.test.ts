import { createTranslationsStore, globalState, legacyStore, locale } from '../../states'
import {
  getAvailableLocales,
  getLoadedLocales,
  getMessages,
  isLocaleLoaded,
  isLocaleLoading,
  loadDefaultMessages,
  loadLocale,
  setLocale,
  setLocaleMessage,
} from '../locales'

describe('locales', () => {
  beforeEach(() => {
    locale.value = 'en'
    globalState.loadedLocales = new Set()
    globalState.messages = {}
    globalState.userMessages = {}
    globalState.loadingPromises = new Map()
    legacyStore.overrides = {}
    legacyStore.failedLocales.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('given loadDefaultMessages function', () => {
    describe('when loading a known locale', () => {
      it('then it returns messages from the locale file', async () => {
        const messages = await loadDefaultMessages('en')

        expect(messages).toBeDefined()
        expect(messages).toHaveProperty('inputPhoneNumber')
      })
    })

    describe('when loading the same locale twice', () => {
      it('then it returns cached messages on the second call', async () => {
        const first = await loadDefaultMessages('fr')
        const second = await loadDefaultMessages('fr')

        expect(first).toBe(second)
      })
    })

    describe('when loading an unknown locale', () => {
      it('then it returns an empty object', async () => {
        const messages = await loadDefaultMessages('xx-YY')

        expect(messages).toEqual({})
      })
    })

    describe('when loading multiple different locales', () => {
      it('then it returns distinct message objects for each', async () => {
        const en = await loadDefaultMessages('en')
        const de = await loadDefaultMessages('de')

        expect(en).not.toBe(de)
      })
    })

    describe('when loading all available default locales', () => {
      it.each([
        { code: 'es' },
        { code: 'it' },
        { code: 'ja' },
        { code: 'pt' },
        { code: 'zh-CN' },
      ])('then it returns messages for $code', async ({ code }) => {
        const messages = await loadDefaultMessages(code)
        expect(messages).toBeDefined()
        expect(Object.keys(messages).length).toBeGreaterThan(0)
      })
    })
  })

  describe('given getAvailableLocales function', () => {
    describe('when no user locales are configured', () => {
      it('then it returns the built-in locales', () => {
        const locales = getAvailableLocales()

        expect(locales).toContain('en')
        expect(locales).toContain('fr')
        expect(locales).toContain('de')
        expect(locales).toContain('es')
        expect(locales).toContain('it')
        expect(locales).toContain('ja')
        expect(locales).toContain('pt')
        expect(locales).toContain('zh-CN')
      })
    })

    describe('when user locales are configured', () => {
      it('then it includes user locales in the result', () => {
        globalState.userMessages = { ko: {} as any }

        const locales = getAvailableLocales()

        expect(locales).toContain('ko')
        expect(locales).toContain('en')
      })
    })

    describe('when a user locale overlaps with a built-in locale', () => {
      it('then it does not duplicate the locale', () => {
        globalState.userMessages = { en: {} as any }

        const locales = getAvailableLocales()
        const enCount = locales.filter(l => l === 'en').length

        expect(enCount).toBe(1)
      })
    })
  })

  describe('given loadLocale function', () => {
    describe('when the locale is already loaded', () => {
      it('then it resolves immediately without reloading', async () => {
        globalState.loadedLocales.add('en')
        globalState.messages = {
          en: { greeting: 'Hello' } as any,
        }

        await loadLocale('en')

        expect(globalState.messages.en).toEqual({ greeting: 'Hello' })
      })
    })

    describe('when the locale is currently loading', () => {
      it('then it returns the existing loading promise', () => {
        const existingPromise = new Promise<void>(() => {})
        globalState.loadingPromises.set('fr', existingPromise)

        const result = loadLocale('fr')

        expect(result).toBe(existingPromise)
      })
    })

    describe('when loading a locale with default messages only', () => {
      it('then it stores the default messages and marks the locale as loaded', async () => {
        await loadLocale('en')

        expect(globalState.loadedLocales.has('en')).toBe(true)
        expect(globalState.messages.en).toBeDefined()
        expect(globalState.messages.en).toHaveProperty('inputPhoneNumber')
      })
    })

    describe('when loading a locale with user messages as an object', () => {
      it('then it merges user messages into default messages', async () => {
        globalState.userMessages = {
          en: {
            custom: { key: 'custom value' },
          } as any,
        }

        await loadLocale('en')

        expect(globalState.loadedLocales.has('en')).toBe(true)
        expect(globalState.messages.en).toHaveProperty('inputPhoneNumber')
        expect((globalState.messages.en as any).custom).toEqual({ key: 'custom value' })
      })
    })

    describe('when loading a locale with user messages as an async function', () => {
      it('then it resolves and merges the async user messages', async () => {
        globalState.userMessages = {
          en: (() => Promise.resolve({ asyncKey: 'asyncValue' })) as any,
        }

        await loadLocale('en')

        expect(globalState.loadedLocales.has('en')).toBe(true)
        expect((globalState.messages.en as any).asyncKey).toBe('asyncValue')
      })
    })

    describe('when loading a locale with user messages as an async function returning default export', () => {
      it('then it unwraps the default export and merges', async () => {
        globalState.userMessages = {
          en: (() => Promise.resolve({
            default: { wrappedKey: 'wrappedValue' },
          })) as any,
        }

        await loadLocale('en')

        expect((globalState.messages.en as any).wrappedKey).toBe('wrappedValue')
      })
    })

    describe('when user message async loader throws an error', () => {
      it('then it applies the default messages and keeps the locale not loaded to retry it', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        globalState.userMessages = {
          en: (() => Promise.reject(new Error('load failed'))) as any,
        }

        await loadLocale('en')

        expect(errorSpy).toHaveBeenCalledWith(
          '[@maz-ui/translations] Failed to load user translations for locale "en":',
          expect.any(Error),
        )
        expect(globalState.messages.en).toHaveProperty('inputPhoneNumber')
        expect(globalState.loadedLocales.has('en')).toBe(false)
        expect(legacyStore.failedLocales.has('en')).toBe(true)
        errorSpy.mockRestore()
      })
    })

    describe('when the user loader succeeds after a failure', () => {
      it('then the next call loads the locale', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const loader = vi.fn()
          .mockRejectedValueOnce(new Error('offline'))
          .mockResolvedValueOnce({ greeting: 'Hello again' })
        globalState.userMessages = { en: loader as any }

        await loadLocale('en')
        await loadLocale('en')

        expect(loader).toHaveBeenCalledTimes(2)
        expect((globalState.messages.en as any).greeting).toBe('Hello again')
        expect(globalState.loadedLocales.has('en')).toBe(true)
        expect(legacyStore.failedLocales.has('en')).toBe(false)
        errorSpy.mockRestore()
      })
    })

    describe('when the loading promise completes', () => {
      it('then it removes the loading promise from the map', async () => {
        await loadLocale('en')

        expect(globalState.loadingPromises.has('en')).toBe(false)
      })
    })

    describe('when loading a locale that has no default messages and no user messages', () => {
      it('then it loads with empty messages', async () => {
        await loadLocale('xx-unknown')

        expect(globalState.loadedLocales.has('xx-unknown')).toBe(true)
        expect(globalState.messages['xx-unknown']).toEqual({})
      })
    })
  })

  describe('given getMessages function', () => {
    describe('when messages exist in global state', () => {
      it('then it returns the messages object', () => {
        globalState.messages = {
          en: { hello: 'world' } as any,
        }

        const result = getMessages()

        expect(result).toEqual({
          en: { hello: 'world' },
        })
      })
    })

    describe('when no messages exist', () => {
      it('then it returns an empty object', () => {
        const result = getMessages()

        expect(result).toEqual({})
      })
    })
  })

  describe('given isLocaleLoaded function', () => {
    describe('when the locale has been loaded', () => {
      it('then it returns true', () => {
        globalState.loadedLocales.add('en')

        expect(isLocaleLoaded('en')).toBe(true)
      })
    })

    describe('when the locale has not been loaded', () => {
      it('then it returns false', () => {
        expect(isLocaleLoaded('en')).toBe(false)
      })
    })
  })

  describe('given isLocaleLoading function', () => {
    describe('when the locale is currently loading', () => {
      it('then it returns true', () => {
        globalState.loadingPromises.set('fr', Promise.resolve())

        expect(isLocaleLoading('fr')).toBe(true)
      })
    })

    describe('when the locale is not loading', () => {
      it('then it returns false', () => {
        expect(isLocaleLoading('fr')).toBe(false)
      })
    })
  })

  describe('given setLocaleMessage function', () => {
    describe('when setting messages for a new locale', () => {
      it('then it creates the locale entry and marks it as loaded', () => {
        setLocaleMessage('nl', { greeting: 'Hallo' } as any)

        expect(globalState.messages.nl).toBeDefined()
        expect((globalState.messages.nl as any).greeting).toBe('Hallo')
        expect(globalState.loadedLocales.has('nl')).toBe(true)
      })
    })

    describe('when setting messages for an existing locale', () => {
      it('then it merges the new messages with existing ones', () => {
        globalState.messages = {
          en: { existing: 'value' } as any,
        }

        setLocaleMessage('en', { added: 'new' } as any)

        expect((globalState.messages.en as any).existing).toBe('value')
        expect((globalState.messages.en as any).added).toBe('new')
      })
    })
  })

  describe('given setLocale function', () => {
    describe('when the new locale is already loaded', () => {
      it('then it sets the locale without loading', async () => {
        globalState.loadedLocales.add('fr')
        globalState.messages = { fr: {} }

        await setLocale('fr')

        expect(locale.value).toBe('fr')
      })
    })

    describe('when the new locale is not loaded', () => {
      it('then it loads the locale and then sets it', async () => {
        await setLocale('de')

        expect(globalState.loadedLocales.has('de')).toBe(true)
        expect(locale.value).toBe('de')
      })
    })
  })

  describe('given getLoadedLocales function', () => {
    describe('when no locales have been loaded', () => {
      it('then it returns an empty array', () => {
        expect(getLoadedLocales()).toEqual([])
      })
    })

    describe('when a locale only has messages but is not loaded', () => {
      it('then it only returns the loaded locales', () => {
        globalState.messages = { en: {} as any, fr: {} as any }
        globalState.loadedLocales = new Set(['en'])

        expect(getLoadedLocales()).toEqual(['en'])
      })
    })
  })

  describe('given English', () => {
    describe('when it is loaded', () => {
      it('then its messages are applied synchronously', () => {
        void loadLocale('en')

        expect(globalState.loadedLocales.has('en')).toBe(true)
        expect(globalState.messages.en).toHaveProperty('inputPhoneNumber')
      })
    })
  })

  describe('given a locale whose default messages fail to load', () => {
    describe('when it is loaded', () => {
      it('then it is not marked as loaded', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.doMock('../../locales/de', () => {
          throw new Error('chunk failed')
        })
        vi.resetModules()
        const states = await import('../../states')
        const { loadLocale: freshLoadLocale } = await import('../locales')
        const store = states.createTranslationsStore()

        await freshLoadLocale('de', store)

        expect(store.state.loadedLocales.has('de')).toBe(false)
        expect(store.failedLocales.has('de')).toBe(true)
        expect(errorSpy).toHaveBeenCalledWith('[@maz-ui/translations] Failed to load translations for locale "de":', expect.any(Error))
        vi.doUnmock('../../locales/de')
        errorSpy.mockRestore()
      })
    })
  })

  describe('given default messages that fail to load', () => {
    describe('when loadDefaultMessages is called', () => {
      it('then it logs the error and returns empty messages', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.doMock('../../locales/es', () => {
          throw new Error('chunk failed')
        })
        vi.resetModules()
        const { loadDefaultMessages: freshLoadDefaultMessages } = await import('../locales')

        expect(await freshLoadDefaultMessages('es')).toEqual({})
        expect(errorSpy).toHaveBeenCalledWith('[@maz-ui/translations] Failed to load default messages for locale "es":', expect.any(Error))
        vi.doUnmock('../../locales/es')
        errorSpy.mockRestore()
      })
    })
  })

  describe('given setLocaleMessage before the locale is loaded', () => {
    describe('when the locale is loaded', () => {
      it('then the default messages are loaded and the added messages win', async () => {
        setLocaleMessage('fr', {
          pagination: { navAriaLabel: 'Perso' },
        } as any)

        await setLocale('fr')

        expect((globalState.messages.fr as any).pagination.navAriaLabel).toBe('Perso')
        expect((globalState.messages.fr as any).inputPhoneNumber).toBeDefined()
        expect(locale.value).toBe('fr')
      })
    })
  })

  describe('given setLocaleMessage for a locale without default messages', () => {
    describe('when it is called', () => {
      it('then the locale is loaded at once', () => {
        setLocaleMessage('ko', { greeting: 'Annyeong' } as any)

        expect(isLocaleLoaded('ko')).toBe(true)
      })
    })
  })

  describe('given two setLocale calls', () => {
    describe('when the first locale loads slower than the second', () => {
      it('then the last requested locale wins', async () => {
        const first = setLocale('ja')
        const second = setLocale('en')

        await Promise.all([first, second])

        expect(locale.value).toBe('en')
      })
    })
  })

  describe('given two stores', () => {
    describe('when the locale of one of them changes', () => {
      it('then the other one keeps its locale and its messages', async () => {
        const first = createTranslationsStore('en')
        const second = createTranslationsStore('en')
        setLocaleMessage('en', { greeting: 'First' } as any, first)

        await setLocale('fr', first)

        expect(first.locale.value).toBe('fr')
        expect(second.locale.value).toBe('en')
        expect(getMessages(second)).toEqual({})
        expect(locale.value).toBe('en')
      })
    })
  })
})
