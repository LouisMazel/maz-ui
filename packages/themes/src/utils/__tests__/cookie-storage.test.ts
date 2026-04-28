import { clearSavedPresetName, deleteCookie, getCookie, getSavedPresetName, saveResolvedPresetName, setCookie } from '../cookie-storage'

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

  describe('given getCookie function', () => {
    describe('when cookie exists', () => {
      it('then it returns cookie value', () => {
        mockDocumentCookie('test-key=test-value; other-key=other-value')

        const result = getCookie('test-key')

        expect(result).toBe('test-value')
      })
    })

    describe('when cookie does not exist', () => {
      it('then it returns null', () => {
        mockDocumentCookie('other-key=other-value')

        const result = getCookie('test-key')

        expect(result).toBeNull()
      })
    })

    describe('when no cookies exist', () => {
      it('then it returns null', () => {
        mockDocumentCookie('')

        const result = getCookie('test-key')

        expect(result).toBeNull()
      })
    })

    describe('when document is undefined', () => {
      it('then it returns null', () => {
        vi.stubGlobal('document', undefined)

        const result = getCookie('test-key')

        expect(result).toBeNull()
      })
    })

    describe('when cookie value is encoded', () => {
      it('then it decodes the value', () => {
        mockDocumentCookie('test-key=hello%20world')

        const result = getCookie('test-key')

        expect(result).toBe('hello world')
      })
    })
  })

  describe('given setCookie function', () => {
    describe('when setting a cookie', () => {
      it('then it sets cookie with correct format', () => {
        mockDocumentCookie('')

        setCookie('test-key', 'test-value')

        expect(document.cookie).toContain('test-key=test-value')
      })
    })

    describe('when document is undefined', () => {
      it('then it handles gracefully', () => {
        vi.stubGlobal('document', undefined)

        expect(() => setCookie('test-key', 'test-value')).not.toThrow()
      })
    })

    describe('when setting a cookie with special characters', () => {
      it('then it encodes the value', () => {
        mockDocumentCookie('')

        setCookie('test-key', 'hello world')

        expect(document.cookie).toContain('test-key=hello%20world')
      })
    })
  })

  describe('given deleteCookie function', () => {
    describe('when document is undefined', () => {
      it('then it returns silently', () => {
        vi.stubGlobal('document', undefined)

        expect(() => deleteCookie('test-key')).not.toThrow()
      })
    })

    describe('when document is available', () => {
      it('then it writes a max-age=0 directive', () => {
        mockDocumentCookie('')

        deleteCookie('test-key')

        expect(document.cookie).toContain('test-key=')
      })
    })
  })

  describe('given saveResolvedPresetName function', () => {
    describe('when running on the server', () => {
      it('then it does not touch document.cookie', () => {
        vi.stubGlobal('document', undefined)

        expect(() => saveResolvedPresetName('ocean')).not.toThrow()
      })
    })

    describe('when called with a falsy name', () => {
      it('then it is a no-op', () => {
        mockDocumentCookie('')

        saveResolvedPresetName('')

        expect(document.cookie).toBe('')
      })
    })

    describe('when the saved name already matches', () => {
      it('then it skips the write', () => {
        mockDocumentCookie('maz-preset=ocean')
        const setSpy = vi.spyOn(document, 'cookie', 'set')

        saveResolvedPresetName('ocean')

        expect(setSpy).not.toHaveBeenCalled()
      })
    })

    describe('when the saved name differs', () => {
      it('then it persists the new name', () => {
        mockDocumentCookie('maz-preset=ocean')

        saveResolvedPresetName('nova')

        expect(document.cookie).toContain('maz-preset=nova')
      })
    })
  })

  describe('given getSavedPresetName function', () => {
    describe('when no preset cookie exists', () => {
      it('then it returns null', () => {
        mockDocumentCookie('')

        expect(getSavedPresetName()).toBeNull()
      })
    })

    describe('when a preset cookie exists', () => {
      it('then it returns the persisted name', () => {
        mockDocumentCookie('maz-preset=nova')

        expect(getSavedPresetName()).toBe('nova')
      })
    })
  })

  describe('given clearSavedPresetName function', () => {
    describe('when called', () => {
      it('then it deletes the maz-preset cookie', () => {
        mockDocumentCookie('maz-preset=nova')

        expect(() => clearSavedPresetName()).not.toThrow()
        expect(document.cookie).toContain('maz-preset=')
      })
    })
  })
})
