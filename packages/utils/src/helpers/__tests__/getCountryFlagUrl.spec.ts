import { getCountryFlagUrl } from '../getCountryFlagUrl'

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
})
