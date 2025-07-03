import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getCookie, setCookie } from '../cookie-storage'

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
})
