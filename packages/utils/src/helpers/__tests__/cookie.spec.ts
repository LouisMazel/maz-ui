import { deleteCookie, getCookie, setCookie } from '../cookie'

function mockDocumentCookie(initialValue: string = '') {
  let cookieValue = initialValue
  const setSpy = vi.fn()

  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get() {
      return cookieValue
    },
    set(value: string) {
      setSpy(value)
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

  return setSpy
}

describe('cookie', () => {
  beforeEach(() => {
    vi.stubGlobal('document', { cookie: '' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('given getCookie function', () => {
    describe('when cookie exists', () => {
      it('then it returns cookie value', () => {
        mockDocumentCookie('test-key=test-value; other-key=other-value')

        expect(getCookie('test-key')).toBe('test-value')
      })
    })

    describe('when cookie does not exist', () => {
      it('then it returns null', () => {
        mockDocumentCookie('other-key=other-value')

        expect(getCookie('test-key')).toBeNull()
      })
    })

    describe('when no cookies exist', () => {
      it('then it returns null', () => {
        mockDocumentCookie('')

        expect(getCookie('test-key')).toBeNull()
      })
    })

    describe('when document is undefined', () => {
      it('then it returns null', () => {
        vi.stubGlobal('document', undefined)

        expect(getCookie('test-key')).toBeNull()
      })
    })

    describe('when cookie value is URL-encoded', () => {
      it('then it decodes the value', () => {
        mockDocumentCookie('test-key=hello%20world')

        expect(getCookie('test-key')).toBe('hello world')
      })
    })

    describe('when a cookieHeader is provided on the server', () => {
      it('then it parses the value from the header', () => {
        vi.stubGlobal('window', undefined)

        expect(getCookie('test-key', 'other=value; test-key=hello; flag=1')).toBe('hello')
      })
    })

    describe('when running on the server without a cookieHeader', () => {
      it('then it returns null', () => {
        vi.stubGlobal('window', undefined)

        expect(getCookie('test-key')).toBeNull()
      })
    })
  })

  describe('given setCookie function', () => {
    describe('when called with no options', () => {
      it('then it applies default path, max-age and SameSite', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('test-key', 'test-value')

        const written = setSpy.mock.calls[0][0] as string
        expect(written).toContain('test-key=test-value')
        expect(written).toContain('path=/')
        expect(written).toContain(`max-age=${60 * 60 * 24 * 365}`)
        expect(written).toContain('SameSite=Lax')
      })
    })

    describe('when running on the server', () => {
      it('then it is a no-op and does not throw', () => {
        vi.stubGlobal('document', undefined)

        expect(() => setCookie('test-key', 'test-value')).not.toThrow()
      })
    })

    describe('when value contains special characters', () => {
      it('then it URL-encodes the value', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('test-key', 'hello world')

        expect(setSpy.mock.calls[0][0]).toContain('test-key=hello%20world')
      })
    })

    describe('when path option is provided', () => {
      it('then it uses the custom path', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { path: '/admin' })

        expect(setSpy.mock.calls[0][0]).toContain('path=/admin')
      })
    })

    describe('when path option is null', () => {
      it('then it omits the path attribute', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { path: null })

        expect(setSpy.mock.calls[0][0]).not.toContain('path=')
      })
    })

    describe('when domain option is provided', () => {
      it('then it appends the domain attribute', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { domain: 'example.com' })

        expect(setSpy.mock.calls[0][0]).toContain('domain=example.com')
      })
    })

    describe('when domain option is omitted', () => {
      it('then it does not append a domain attribute', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v')

        expect(setSpy.mock.calls[0][0]).not.toContain('domain=')
      })
    })

    describe('when maxAge is a custom number', () => {
      it('then it uses that value', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { maxAge: 60 })

        expect(setSpy.mock.calls[0][0]).toContain('max-age=60')
      })
    })

    describe('when maxAge is zero', () => {
      it('then it still emits max-age=0', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { maxAge: 0 })

        expect(setSpy.mock.calls[0][0]).toContain('max-age=0')
      })
    })

    describe('when maxAge is null', () => {
      it('then it omits the max-age attribute (session cookie)', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { maxAge: null })

        expect(setSpy.mock.calls[0][0]).not.toContain('max-age=')
      })
    })

    describe('when expires is provided', () => {
      it('then it appends the expires attribute as a UTC string', () => {
        const setSpy = mockDocumentCookie('')
        const expires = new Date('2030-01-02T03:04:05Z')

        setCookie('k', 'v', { expires })

        expect(setSpy.mock.calls[0][0]).toContain(`expires=${expires.toUTCString()}`)
      })
    })

    describe('when expires is omitted', () => {
      it('then it does not append an expires attribute', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v')

        expect(setSpy.mock.calls[0][0]).not.toContain('expires=')
      })
    })

    describe('when secure is true', () => {
      it('then it appends the secure flag', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { secure: true })

        expect(setSpy.mock.calls[0][0]).toContain('secure')
      })
    })

    describe('when secure is false', () => {
      it('then it omits the secure flag', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { secure: false })

        expect(setSpy.mock.calls[0][0]).not.toContain('secure')
      })
    })

    describe('when sameSite is Strict', () => {
      it('then it emits SameSite=Strict', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { sameSite: 'Strict' })

        expect(setSpy.mock.calls[0][0]).toContain('SameSite=Strict')
      })
    })

    describe('when sameSite is None', () => {
      it('then it emits SameSite=None', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { sameSite: 'None' })

        expect(setSpy.mock.calls[0][0]).toContain('SameSite=None')
      })
    })

    describe('when sameSite is null', () => {
      it('then it omits the SameSite attribute', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { sameSite: null })

        expect(setSpy.mock.calls[0][0]).not.toContain('SameSite=')
      })
    })

    describe('when partitioned is true', () => {
      it('then it appends the partitioned flag', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { partitioned: true })

        expect(setSpy.mock.calls[0][0]).toContain('partitioned')
      })
    })

    describe('when partitioned is false', () => {
      it('then it omits the partitioned flag', () => {
        const setSpy = mockDocumentCookie('')

        setCookie('k', 'v', { partitioned: false })

        expect(setSpy.mock.calls[0][0]).not.toContain('partitioned')
      })
    })

    describe('when every option is provided', () => {
      it('then it serialises all attributes in order', () => {
        const setSpy = mockDocumentCookie('')
        const expires = new Date('2031-06-07T08:09:10Z')

        setCookie('k', 'v', {
          path: '/x',
          domain: 'example.com',
          maxAge: 42,
          expires,
          secure: true,
          sameSite: 'None',
          partitioned: true,
        })

        expect(setSpy.mock.calls[0][0]).toBe([
          'k=v',
          'path=/x',
          'domain=example.com',
          'max-age=42',
          `expires=${expires.toUTCString()}`,
          'secure',
          'SameSite=None',
          'partitioned',
        ].join('; '))
      })
    })
  })

  describe('given deleteCookie function', () => {
    describe('when called with default options', () => {
      it('then it writes max-age=0 with the default path', () => {
        const setSpy = mockDocumentCookie('k=v')

        deleteCookie('k')

        const written = setSpy.mock.calls[0][0] as string
        expect(written).toContain('k=')
        expect(written).toContain('max-age=0')
        expect(written).toContain('path=/')
      })
    })

    describe('when called with a custom path and domain', () => {
      it('then it forwards them to setCookie', () => {
        const setSpy = mockDocumentCookie('k=v')

        deleteCookie('k', { path: '/admin', domain: 'example.com' })

        const written = setSpy.mock.calls[0][0] as string
        expect(written).toContain('path=/admin')
        expect(written).toContain('domain=example.com')
        expect(written).toContain('max-age=0')
      })
    })

    describe('when running on the server', () => {
      it('then it is a no-op and does not throw', () => {
        vi.stubGlobal('document', undefined)

        expect(() => deleteCookie('k')).not.toThrow()
      })
    })
  })
})
