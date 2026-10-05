import { clearSavedPresetName, getSavedPreset, savePreset } from '../cookie-storage'

function mockDocumentCookie(initialValue: string = '') {
  let cookieValue = initialValue

  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get() {
      return cookieValue
    },
    set(value: string) {
      if (value.includes('=')) {
        const [keyValue] = value.split(';')
        const [key, val] = keyValue.split('=')

        if (cookieValue) {
          const cookies = cookieValue.split(';').map(c => c.trim())
          const existingIndex = cookies.findIndex(c => c.startsWith(`${key.trim()}=`))

          if (existingIndex >= 0) {
            cookies[existingIndex] = `${key.trim()}=${val}`
          }
          else {
            cookies.push(`${key.trim()}=${val}`)
          }
          cookieValue = cookies.join('; ')
        }
        else {
          cookieValue = `${key.trim()}=${val}`
        }
      }
    },
  })
}

describe('cookie-storage', () => {
  beforeEach(() => {
    vi.stubGlobal('document', {
      cookie: '',
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('given savePreset function', () => {
    describe('when called with a falsy base or active', () => {
      it('then it is a no-op', () => {
        mockDocumentCookie('')

        savePreset('', 'ocean')
        savePreset('ocean', '')

        expect(document.cookie).toBe('')
      })
    })

    describe('when the serialized value already matches', () => {
      it('then it skips the write', () => {
        mockDocumentCookie('maz-preset=ocean:ocean')
        const setSpy = vi.spyOn(document, 'cookie', 'set')

        savePreset('ocean', 'ocean')

        expect(setSpy).not.toHaveBeenCalled()
      })
    })

    describe('when the serialized value differs', () => {
      it('then it persists the base and active scoped value', () => {
        mockDocumentCookie('maz-preset=ocean:ocean')

        savePreset('ocean', 'nova')

        expect(document.cookie).toContain('maz-preset=ocean%3Anova')
      })
    })
  })

  describe('given getSavedPreset function', () => {
    describe('when no preset cookie exists', () => {
      it('then it returns null', () => {
        mockDocumentCookie('')

        expect(getSavedPreset()).toBeNull()
      })
    })

    describe('when a scoped preset cookie exists', () => {
      it('then it returns the parsed base and active', () => {
        mockDocumentCookie('maz-preset=cabaret-vert:nova')

        expect(getSavedPreset()).toEqual({ base: 'cabaret-vert', active: 'nova' })
      })
    })

    describe('when a legacy plain-name cookie exists', () => {
      it('then it returns null so the stale value cannot hijack resolution', () => {
        mockDocumentCookie('maz-preset=nova')

        expect(getSavedPreset()).toBeNull()
      })
    })

    describe('when the cookie has an empty base or active segment', () => {
      it('then it returns null', () => {
        mockDocumentCookie('maz-preset=:nova')

        expect(getSavedPreset()).toBeNull()
      })
    })
  })

  describe('given clearSavedPresetName function', () => {
    describe('when called on the client', () => {
      it('then it writes the max-age=0 directive', () => {
        mockDocumentCookie('maz-preset=ocean:nova')

        clearSavedPresetName()

        expect(document.cookie).toContain('maz-preset=')
      })
    })

    describe('when running on the server', () => {
      it('then it returns silently', () => {
        vi.stubGlobal('document', undefined)

        expect(() => clearSavedPresetName()).not.toThrow()
      })
    })
  })
})
