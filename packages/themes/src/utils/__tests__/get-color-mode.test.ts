import type { ColorMode } from '../../types'
import { getColorMode, getSavedResolvedColorMode, getSystemColorMode, saveResolvedColorMode } from '../get-color-mode'

// Mock document.cookie
function mockDocumentCookie(cookies: string = '') {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: cookies,
  })
}

describe('get-color-mode', () => {
  describe('given getColorMode function', () => {
    beforeEach(() => {
      vi.stubGlobal('document', {
        cookie: '',
      })
      vi.stubGlobal('matchMedia', vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })))
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when provided colorMode is light', () => {
      it('then it returns provided colorMode', () => {
        const result = getColorMode('light')

        expect(result).toBe('light')
      })
    })

    describe('when provided colorMode is dark', () => {
      it('then it returns provided colorMode', () => {
        const result = getColorMode('dark')

        expect(result).toBe('dark')
      })
    })

    describe('when no colorMode provided and valid mode exists in cookies', () => {
      it('then it returns saved cookie mode', () => {
        mockDocumentCookie('maz-color-mode=dark; path=/')
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('dark')
      })
    })

    describe('when cookies has auto mode', () => {
      it('then it returns saved cookie auto mode when valid', () => {
        mockDocumentCookie('maz-color-mode=auto; path=/')
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('auto')
      })
    })

    describe('when cookies has invalid value', () => {
      it('then it falls back to system preference', () => {
        mockDocumentCookie('ads-color-mode=invalid; path=/')
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('auto')
      })
    })

    describe('when cookies returns empty', () => {
      it('then it falls back to system preference', () => {
        mockDocumentCookie('')
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('auto')
      })
    })

    describe('when document is undefined', () => {
      it('then it falls back to system preference', () => {
        vi.stubGlobal('document', undefined)
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('auto')
      })
    })

    describe('when invalid colorMode provided', () => {
      it('then it returns light', () => {
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode('invalid' as ColorMode)

        expect(result).toBe('auto')
      })
    })
  })

  describe('given getSystemColorMode function', () => {
    beforeEach(() => {
      vi.stubGlobal('matchMedia', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when system prefers dark color scheme', () => {
      it('then it returns dark', () => {
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getSystemColorMode()

        expect(globalThis.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(result).toBe('dark')
      })
    })

    describe('when system prefers light color scheme', () => {
      it('then it returns light', () => {
        vi.mocked(globalThis.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getSystemColorMode()

        expect(globalThis.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(result).toBe('light')
      })
    })

    describe('when window is undefined', () => {
      it('then it returns light', () => {
        vi.stubGlobal('window', undefined)

        const result = getSystemColorMode()

        expect(result).toBe('light')
      })
    })
  })

  describe('given saveResolvedColorMode function', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when called with dark', () => {
      it('then it sets the maz-resolved-color-mode cookie to dark', () => {
        let cookieValue = ''
        Object.defineProperty(document, 'cookie', {
          get: () => cookieValue,
          set: (val: string) => { cookieValue = val },
          configurable: true,
        })

        saveResolvedColorMode('dark')

        expect(cookieValue).toContain('maz-resolved-color-mode=dark')
      })
    })

    describe('when called with light', () => {
      it('then it sets the maz-resolved-color-mode cookie to light', () => {
        let cookieValue = ''
        Object.defineProperty(document, 'cookie', {
          get: () => cookieValue,
          set: (val: string) => { cookieValue = val },
          configurable: true,
        })

        saveResolvedColorMode('light')

        expect(cookieValue).toContain('maz-resolved-color-mode=light')
      })
    })
  })

  describe('given getSavedResolvedColorMode function', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when resolved cookie is dark', () => {
      it('then it returns dark', () => {
        mockDocumentCookie('maz-resolved-color-mode=dark')

        const result = getSavedResolvedColorMode()

        expect(result).toBe('dark')
      })
    })

    describe('when resolved cookie is light', () => {
      it('then it returns light', () => {
        mockDocumentCookie('maz-resolved-color-mode=light')

        const result = getSavedResolvedColorMode()

        expect(result).toBe('light')
      })
    })

    describe('when resolved cookie has invalid value', () => {
      it('then it returns undefined', () => {
        mockDocumentCookie('maz-resolved-color-mode=invalid')

        const result = getSavedResolvedColorMode()

        expect(result).toBeUndefined()
      })
    })

    describe('when resolved cookie does not exist', () => {
      it('then it returns undefined', () => {
        mockDocumentCookie('')

        const result = getSavedResolvedColorMode()

        expect(result).toBeUndefined()
      })
    })
  })
})
