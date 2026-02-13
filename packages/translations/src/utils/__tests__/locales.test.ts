import { globalState, locale } from '../../states'
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
        globalState.messages = { en: { greeting: 'Hello' } as any }

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
          en: { custom: { key: 'custom value' } } as any,
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
          en: (() => Promise.resolve({ default: { wrappedKey: 'wrappedValue' } })) as any,
        }

        await loadLocale('en')

        expect((globalState.messages.en as any).wrappedKey).toBe('wrappedValue')
      })
    })

    describe('when user message async loader throws an error', () => {
      it('then it logs the error and falls back to empty user messages', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        globalState.userMessages = {
          en: (() => Promise.reject(new Error('load failed'))) as any,
        }

        await loadLocale('en')

        expect(errorSpy).toHaveBeenCalledWith(
          'Failed to load user translations for locale "en":',
          expect.any(Error),
        )
        expect(globalState.loadedLocales.has('en')).toBe(true)
        errorSpy.mockRestore()
      })
    })

    describe('when the loading promise completes', () => {
      it('then it removes the loading promise from the map', async () => {
        await loadLocale('en')

        expect(globalState.loadingPromises.has('en')).toBe(false)
      })
    })
  })

  describe('given getMessages function', () => {
    describe('when messages exist in global state', () => {
      it('then it returns the messages object', () => {
        globalState.messages = { en: { hello: 'world' } as any }

        const result = getMessages()

        expect(result).toEqual({ en: { hello: 'world' } })
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
        globalState.messages = { en: { existing: 'value' } as any }

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

    describe('when some locales have messages', () => {
      it('then it returns the keys of the messages object', () => {
        globalState.messages = { en: {} as any, fr: {} as any }

        const result = getLoadedLocales()

        expect(result).toContain('en')
        expect(result).toContain('fr')
        expect(result).toHaveLength(2)
      })
    })
  })
})
