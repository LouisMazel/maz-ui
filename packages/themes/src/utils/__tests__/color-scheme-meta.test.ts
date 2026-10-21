import { injectColorSchemeMeta, resolveColorSchemeContent } from '../color-scheme-meta'

describe('given resolveColorSchemeContent', () => {
  describe('when mode is both', () => {
    describe('when colorMode is auto', () => {
      it('then it returns "light dark"', () => {
        expect(resolveColorSchemeContent('both', 'auto')).toBe('light dark')
      })
    })

    describe('when colorMode is explicitly dark', () => {
      it('then it returns "dark"', () => {
        expect(resolveColorSchemeContent('both', 'dark')).toBe('dark')
      })
    })

    describe('when colorMode is explicitly light', () => {
      it('then it returns "light"', () => {
        expect(resolveColorSchemeContent('both', 'light')).toBe('light')
      })
    })
  })

  describe('when mode is dark', () => {
    it('then it returns "dark" regardless of colorMode', () => {
      expect(resolveColorSchemeContent('dark', 'auto')).toBe('dark')
      expect(resolveColorSchemeContent('dark', 'light')).toBe('dark')
    })
  })

  describe('when mode is light', () => {
    it('then it returns "light" regardless of colorMode', () => {
      expect(resolveColorSchemeContent('light', 'auto')).toBe('light')
      expect(resolveColorSchemeContent('light', 'dark')).toBe('light')
    })
  })
})

describe('given injectColorSchemeMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  describe('when no meta tag exists', () => {
    it('then it creates and appends one with the given content', () => {
      injectColorSchemeMeta('light dark')
      const meta = document.head.querySelector('meta[name="color-scheme"]')
      expect(meta?.getAttribute('content')).toBe('light dark')
    })
  })

  describe('when a meta tag already exists', () => {
    it('then it updates its content without duplicating', () => {
      const existing = document.createElement('meta')
      existing.setAttribute('name', 'color-scheme')
      existing.setAttribute('content', 'light')
      document.head.appendChild(existing)

      injectColorSchemeMeta('dark')

      const metas = document.head.querySelectorAll('meta[name="color-scheme"]')
      expect(metas).toHaveLength(1)
      expect(metas[0].getAttribute('content')).toBe('dark')
    })
  })

  describe('when called multiple times', () => {
    it('then it keeps a single tag updated to the latest value', () => {
      injectColorSchemeMeta('light')
      injectColorSchemeMeta('dark')
      injectColorSchemeMeta('light dark')

      const metas = document.head.querySelectorAll('meta[name="color-scheme"]')
      expect(metas).toHaveLength(1)
      expect(metas[0].getAttribute('content')).toBe('light dark')
    })
  })
})
