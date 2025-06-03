import { useMazInputPhoneNumber } from '@components/MazInputPhoneNumber/useMazInputPhoneNumber'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

const { sanitizePhoneNumber, getCountriesList, fetchCountryCode, getBrowserLocale }
  = useMazInputPhoneNumber()

vi.mock('libphonenumber-js', () => ({
  parsePhoneNumberFromString: vi.fn(),
  AsYouType: vi.fn(),
  getCountries: vi.fn(),
  getCountryCallingCode: vi.fn(),
  getExampleNumber: vi.fn(),
  isSupportedCountry: vi.fn(),
}))

describe('unit Tests for useMazInputPhoneNumber.ts', () => {
  describe('sanitizePhoneNumber', () => {
    it('should remove non-numeric characters from the input', () => {
      const result = sanitizePhoneNumber('(1234) 567 890 frfr')
      expect(result).toBe('(1234) 567 890')
    })

    it('should handle empty input', () => {
      const result = sanitizePhoneNumber('')
      expect(result).toBe('')
    })
  })

  describe('getCountriesList', () => {
    it('should return a list of countries with iso2, dialCode, and name', () => {
      // Mock de la fonction getCountries
      // @ts-expect-error - test case
      getCountries.mockReturnValue(['US', 'CA'])

      const result = getCountriesList('fr-FR')

      expect(result).toEqual([
        { iso2: 'US', dialCode: undefined, name: 'États-Unis' },
        { iso2: 'CA', dialCode: undefined, name: 'Canada' },
      ])
    })

    it('should handle errors gracefully', () => {
      // Mock de la fonction getCountryCallingCode pour générer une erreur
      // @ts-expect-error - test case
      getCountryCallingCode.mockImplementation(() => {
        throw new Error('Error getting dial code')
      })

      const result = getCountriesList('en-US')
      expect(result).toEqual([])
    })
  })

  describe('browserLocale', () => {
    it('should return the browser locale', () => {
      // Mock de window.navigator.language
      Object.defineProperty(window.navigator, 'language', {
        value: 'en-US',
      })

      const result = getBrowserLocale()
      expect(result).toEqual({ locale: 'US', browserLocale: 'en-US' })
    })
  })

  describe('fetchCountryCode', () => {
    it('should return the country code from an API', async () => {
      // Mock de la fonction fetch
      globalThis.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ country_code: 'FR' }),
      })

      const result = await fetchCountryCode()
      expect(result.data).toBe('FR')
    })

    it('should handle errors when fetching the country code', async () => {
      // Mock de la fonction fetch pour générer une erreur
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('API error'))

      try {
        await fetchCountryCode()
      }
      catch (error) {
        // @ts-expect-error - test case
        expect(error.message).toBe('[MazInputPhoneNumber](fetchCountryCode) Error: API error')
      }
    })
  })

  describe('useLibphonenumber', () => {
    it('should return an object with the expected functions', () => {
      const mazInputPhoneNumberFunctions = useMazInputPhoneNumber()
      expect(mazInputPhoneNumberFunctions).toEqual(
        expect.objectContaining({
          fetchCountryCode: expect.any(Function),
          getBrowserLocale: expect.any(Function),
          getCountriesList: expect.any(Function),
          sanitizePhoneNumber: expect.any(Function),
        }),
      )
    })
  })
})
