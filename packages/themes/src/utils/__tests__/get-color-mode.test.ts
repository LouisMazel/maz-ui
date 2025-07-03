import type { ColorMode } from '../../types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getColorMode, getSystemPrefersDark } from '../get-color-mode'

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
      vi.stubGlobal('window', {
        matchMedia: vi.fn(),
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when provided colorMode is light', () => {
      it('then it returns provided colorMode', () => {
        const colorMode: ColorMode = 'light'

        const result = getColorMode(colorMode)

        expect(result).toBe('light')
      })
    })

    describe('when provided colorMode is dark', () => {
      it('then it returns provided colorMode', () => {
        const colorMode: ColorMode = 'dark'

        const result = getColorMode(colorMode)

        expect(result).toBe('dark')
      })
    })

    describe('when no colorMode provided and valid mode exists in cookies', () => {
      it('then it returns saved cookie mode', () => {
        mockDocumentCookie('maz-color-mode=dark; path=/')
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('dark')
      })
    })

    describe('when cookies has auto mode', () => {
      it('then it returns saved cookie auto mode when valid', () => {
        mockDocumentCookie('maz-color-mode=auto; path=/')
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('auto')
      })
    })

    describe('when cookies has invalid value', () => {
      it('then it falls back to system preference', () => {
        mockDocumentCookie('ads-color-mode=invalid; path=/')
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('dark')
      })
    })

    describe('when cookies returns empty', () => {
      it('then it falls back to system preference', () => {
        mockDocumentCookie('')
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('light')
      })
    })

    describe('when document is undefined', () => {
      it('then it falls back to system preference', () => {
        vi.stubGlobal('document', undefined)
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getColorMode()

        expect(result).toBe('dark')
      })
    })

    describe('when invalid colorMode provided', () => {
      it('then it returns light', () => {
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getColorMode('invalid' as ColorMode)

        expect(result).toBe('light')
      })
    })
  })

  describe('given getSystemPrefersDark function', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {
        matchMedia: vi.fn(),
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    describe('when system prefers dark color scheme', () => {
      it('then it returns dark', () => {
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: true,
        } as MediaQueryList)

        const result = getSystemPrefersDark()

        expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(result).toBe('dark')
      })
    })

    describe('when system prefers light color scheme', () => {
      it('then it returns light', () => {
        vi.mocked(window.matchMedia).mockReturnValue({
          matches: false,
        } as MediaQueryList)

        const result = getSystemPrefersDark()

        expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
        expect(result).toBe('light')
      })
    })

    describe('when window is undefined', () => {
      it('then it returns light', () => {
        vi.stubGlobal('window', undefined)

        const result = getSystemPrefersDark()

        expect(result).toBe('light')
      })
    })
  })
})
