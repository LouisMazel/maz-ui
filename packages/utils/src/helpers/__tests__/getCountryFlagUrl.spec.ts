import { FLAG_CDN_BASE_URL, getCountryFlagUrl } from '../getCountryFlagUrl'

describe('given getCountryFlagUrl function', () => {
  describe('when called with a supported country code', () => {
    it('then it should return an SVG URL by default', () => {
      expect(getCountryFlagUrl('fr')).toBe('https://flagcdn.com/fr.svg')
    })

    it('then it should handle uppercase codes', () => {
      expect(getCountryFlagUrl('FR')).toBe('https://flagcdn.com/fr.svg')
    })
  })

  describe('when called with a size parameter', () => {
    it('then it should return a PNG URL with the specified size', () => {
      expect(getCountryFlagUrl('us', '16x12')).toBe('https://flagcdn.com/16x12/us.png')
    })

    it('then it should support height sizes', () => {
      expect(getCountryFlagUrl('de', 'h20')).toBe('https://flagcdn.com/h20/de.png')
    })

    it('then it should support width sizes', () => {
      expect(getCountryFlagUrl('gb', 'w320')).toBe('https://flagcdn.com/w320/gb.png')
    })
  })

  describe('when called with an unsupported country code', () => {
    it('then it should return undefined', () => {
      expect(getCountryFlagUrl('zz')).toBeUndefined()
      expect(getCountryFlagUrl('invalid')).toBeUndefined()
    })
  })

  describe('when called with a custom baseUrl', () => {
    it('then it should use the custom base URL for SVG', () => {
      expect(getCountryFlagUrl('fr', undefined, '/assets/flags')).toBe('/assets/flags/fr.svg')
    })

    it('then it should use the custom base URL for PNG with size', () => {
      expect(getCountryFlagUrl('us', 'h20', '/assets/flags')).toBe('/assets/flags/h20/us.png')
    })

    it('then it should strip trailing slash from baseUrl', () => {
      expect(getCountryFlagUrl('de', undefined, '/assets/flags/')).toBe('/assets/flags/de.svg')
    })

    it('then it should return undefined for unsupported codes even with custom baseUrl', () => {
      expect(getCountryFlagUrl('zz', undefined, '/assets/flags')).toBeUndefined()
    })
  })

  describe('FLAG_CDN_BASE_URL constant', () => {
    it('then it should export the default flagcdn.com base URL', () => {
      expect(FLAG_CDN_BASE_URL).toBe('https://flagcdn.com')
    })
  })
})
