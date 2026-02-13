import { globalState, locale } from '../../states'
import { getMessage, interpolate, mergeMessages, t } from '../messages'

vi.mock('../locales', () => ({
  loadLocale: vi.fn(() => Promise.resolve()),
}))

const { loadLocale } = await import('../locales')

describe('messages', () => {
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

  describe('given getMessage function', () => {
    describe('when accessing a top-level key', () => {
      it('then it returns the value at that key', () => {
        const obj = { greeting: 'Hello' }

        const result = getMessage(obj, 'greeting')

        expect(result).toBe('Hello')
      })
    })

    describe('when accessing a nested key with dot notation', () => {
      it('then it returns the deeply nested value', () => {
        const obj = { a: { b: { c: 'deep' } } }

        const result = getMessage(obj, 'a.b.c')

        expect(result).toBe('deep')
      })
    })

    describe('when the path does not exist', () => {
      it('then it returns undefined', () => {
        const obj = { a: 'value' }

        const result = getMessage(obj, 'b.c')

        expect(result).toBeUndefined()
      })
    })

    describe('when the object is undefined', () => {
      it('then it returns undefined', () => {
        const result = getMessage(undefined, 'a.b')

        expect(result).toBeUndefined()
      })
    })

    describe('when the object is null', () => {
      it('then it returns undefined', () => {
        const result = getMessage(null, 'a.b')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('given mergeMessages function', () => {
    describe('when merging two flat objects', () => {
      it('then it combines keys from both objects', () => {
        const target = { a: 'one' } as any
        const source = { b: 'two' } as any

        const result = mergeMessages(target, source)

        expect(result).toEqual({ a: 'one', b: 'two' })
      })
    })

    describe('when source has overlapping keys', () => {
      it('then source values override target values', () => {
        const target = { a: 'old' } as any
        const source = { a: 'new' } as any

        const result = mergeMessages(target, source)

        expect(result).toEqual({ a: 'new' })
      })
    })

    describe('when merging nested objects', () => {
      it('then it deep merges the nested structures', () => {
        const target = { a: { b: 'one', c: 'two' } } as any
        const source = { a: { c: 'three', d: 'four' } } as any

        const result = mergeMessages(target, source)

        expect(result).toEqual({ a: { b: 'one', c: 'three', d: 'four' } })
      })
    })

    describe('when source contains flattened dot-notation keys', () => {
      it('then it normalizes them to nested structure before merging', () => {
        const target = { a: { b: 'original' } } as any
        const source = { 'a.b': 'replaced', 'a.c': 'added' } as any

        const result = mergeMessages(target, source)

        expect(result).toEqual({ a: { b: 'replaced', c: 'added' } })
      })
    })

    describe('when target contains flattened dot-notation keys', () => {
      it('then it normalizes target to nested structure', () => {
        const target = { 'x.y': 'value' } as any
        const source = {} as any

        const result = mergeMessages(target, source)

        expect(result).toEqual({ x: { y: 'value' } })
      })
    })

    describe('when both target and source are empty', () => {
      it('then it returns an empty object', () => {
        const result = mergeMessages({} as any, {} as any)

        expect(result).toEqual({})
      })
    })
  })

  describe('given interpolate function', () => {
    describe('when no variables are provided', () => {
      it('then it returns the original message', () => {
        const result = interpolate('Hello world')

        expect(result).toBe('Hello world')
      })
    })

    describe('when variables is undefined', () => {
      it('then it returns the original message', () => {
        const result = interpolate('Hello {name}', undefined)

        expect(result).toBe('Hello {name}')
      })
    })

    describe('when variables match placeholders', () => {
      it('then it replaces placeholders with variable values', () => {
        const result = interpolate('Hello {name}, you have {count} items', {
          name: 'John',
          count: 5,
        })

        expect(result).toBe('Hello John, you have 5 items')
      })
    })

    describe('when a placeholder has no matching variable', () => {
      it('then it leaves the placeholder unchanged', () => {
        const result = interpolate('Hello {name}, {greeting}', { name: 'John' })

        expect(result).toBe('Hello John, {greeting}')
      })
    })

    describe('when variable value is a number', () => {
      it('then it converts the number to string', () => {
        const result = interpolate('Page {page}', { page: 42 })

        expect(result).toBe('Page 42')
      })
    })

    describe('when variable value is zero', () => {
      it('then it replaces the placeholder with zero', () => {
        const result = interpolate('{count} items', { count: 0 })

        expect(result).toBe('0 items')
      })
    })

    describe('when message has no placeholders', () => {
      it('then it returns the original message unchanged', () => {
        const result = interpolate('No placeholders here', { name: 'John' })

        expect(result).toBe('No placeholders here')
      })
    })
  })

  describe('given t function', () => {
    describe('when the key exists in the current locale messages', () => {
      it('then it returns the translated message', () => {
        globalState.messages = { en: { greeting: 'Hello' } } as any
        locale.value = 'en'

        const result = t('greeting' as any)

        expect(result).toBe('Hello')
      })
    })

    describe('when the key exists in a nested structure', () => {
      it('then it returns the nested translated message', () => {
        globalState.messages = { en: { app: { title: 'My App' } } } as any
        locale.value = 'en'

        const result = t('app.title' as any)

        expect(result).toBe('My App')
      })
    })

    describe('when the key has variables', () => {
      it('then it interpolates the variables into the message', () => {
        globalState.messages = { en: { welcome: 'Hello {name}' } } as any
        locale.value = 'en'

        const result = t('welcome' as any, { name: 'World' })

        expect(result).toBe('Hello World')
      })
    })

    describe('when the key is missing in current locale but exists in fallback locale', () => {
      it('then it returns the fallback locale message', () => {
        globalState.messages = {
          fr: {},
          en: { greeting: 'Hello' },
        } as any
        globalState.loadedLocales = new Set(['fr', 'en'])
        locale.value = 'fr'

        const result = t('greeting' as any, undefined, 'en')

        expect(result).toBe('Hello')
      })
    })

    describe('when the key is missing and fallback locale is not loaded', () => {
      it('then it triggers loadLocale for the fallback locale', () => {
        globalState.messages = { fr: {} }
        locale.value = 'fr'

        t('missing.key' as any, undefined, 'de')

        expect(loadLocale).toHaveBeenCalledWith('de')
      })
    })

    describe('when the key is missing in both current and fallback locales and en is not loaded', () => {
      it('then it triggers loadLocale for en and returns the key', () => {
        globalState.messages = { fr: {}, de: {} }
        globalState.loadedLocales = new Set(['fr', 'de'])
        locale.value = 'fr'

        const result = t('missing.key' as any, undefined, 'de')

        expect(loadLocale).toHaveBeenCalledWith('en')
        expect(result).toBe('missing.key')
      })
    })

    describe('when the key is missing in all locales and en is loaded', () => {
      it('then it logs a warning and returns the key', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        globalState.messages = { fr: {}, de: {}, en: {} }
        globalState.loadedLocales = new Set(['fr', 'de', 'en'])
        locale.value = 'fr'

        const result = t('nonexistent.key' as any, undefined, 'de')

        expect(warnSpy).toHaveBeenCalledWith(
          '[@maz-ui/translations] Translation not found for key: "nonexistent.key"',
        )
        expect(result).toBe('nonexistent.key')
        warnSpy.mockRestore()
      })
    })

    describe('when the key is missing with no fallback locale provided and locale is en', () => {
      it('then it logs a warning and returns the key', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        globalState.messages = { en: {} }
        globalState.loadedLocales = new Set(['en'])
        locale.value = 'en'

        const result = t('unknown.key' as any)

        expect(warnSpy).toHaveBeenCalledWith(
          '[@maz-ui/translations] Translation not found for key: "unknown.key"',
        )
        expect(result).toBe('unknown.key')
        warnSpy.mockRestore()
      })
    })

    describe('when the fallback locale matches the current locale', () => {
      it('then it does not attempt fallback and returns the key with a warning', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
        globalState.messages = { en: {} }
        globalState.loadedLocales = new Set(['en'])
        locale.value = 'en'

        const result = t('missing' as any, undefined, 'en')

        expect(warnSpy).toHaveBeenCalledWith(
          '[@maz-ui/translations] Translation not found for key: "missing"',
        )
        expect(result).toBe('missing')
        warnSpy.mockRestore()
      })
    })

    describe('when the message value is not a string', () => {
      it('then it converts the value to a string', () => {
        globalState.messages = { en: { count: 42 } } as any
        locale.value = 'en'

        const result = t('count' as any)

        expect(result).toBe('42')
      })
    })
  })
})
