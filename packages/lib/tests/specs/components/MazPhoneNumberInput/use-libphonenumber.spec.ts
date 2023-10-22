import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
} from 'libphonenumber-js'

import {
  useLibphonenumber,
  isCountryAvailable,
} from '@components/MazPhoneNumberInput/use-libphonenumber'

const {
  getPhoneNumberExample,
  sanitizePhoneNumber,
  getCountriesList,
  browserLocale,
  getAsYouTypeFormat,
  fetchCountryCode,
} = useLibphonenumber()

vi.mock('libphonenumber-js', () => ({
  parsePhoneNumberFromString: vi.fn(),
  AsYouType: vi.fn(),
  getCountries: vi.fn(),
  getCountryCallingCode: vi.fn(),
  getExampleNumber: vi.fn(),
  isSupportedCountry: vi.fn(),
}))

describe('Unit Tests for use-libphonenumber.ts', () => {
  describe('getPhoneNumberExample', () => {
    it('should return a phone number example for a given country code', () => {
      // Mock de la fonction getExampleNumber
      getExampleNumber.mockReturnValue({ formatNational: () => '+1 123-456-7890' })

      const result = getPhoneNumberExample('US')
      expect(result).toBe('+1 123-456-7890')
    })

    it('should handle errors gracefully', () => {
      // Mock de la fonction getExampleNumber pour générer une erreur
      getExampleNumber.mockImplementation(() => {
        throw new Error('Example number not available')
      })

      const result = getPhoneNumberExample('InvalidCountryCode')
      expect(result).toBeUndefined()
    })
  })

  describe('sanitizePhoneNumber', () => {
    it('should remove non-numeric characters from the input', () => {
      const result = sanitizePhoneNumber('(1234) 567 890 frfr')
      expect(result).toBe('1234567890')
    })

    it('should handle empty input', () => {
      const result = sanitizePhoneNumber('')
      expect(result).toBe('')
    })
  })

  describe('getCountriesList', () => {
    it('should return a list of countries with iso2, dialCode, and name', () => {
      // Mock de la fonction getCountries
      getCountries.mockReturnValue(['US', 'CA'])

      const result = getCountriesList('fr-FR')
      expect(result).toEqual([
        { iso2: 'US', dialCode: undefined, name: 'États-Unis' },
        { iso2: 'CA', dialCode: undefined, name: 'Canada' },
      ])
    })

    it('should handle errors gracefully', () => {
      // Mock de la fonction getCountryCallingCode pour générer une erreur
      getCountryCallingCode.mockImplementation(() => {
        throw new Error('Error getting dial code')
      })

      const result = getCountriesList('en-US', {})
      expect(result).toEqual([])
    })
  })

  describe('browserLocale', () => {
    it('should return the browser locale', () => {
      // Mock de window.navigator.language
      Object.defineProperty(window.navigator, 'language', {
        value: 'en-US',
      })

      const result = browserLocale()
      expect(result).toEqual({ locale: 'US', browserLocale: 'en-US' })
    })
  })

  describe('isCountryAvailable', () => {
    it('should return true for a supported country', () => {
      // Mock de la fonction isSupportedCountry
      isSupportedCountry.mockReturnValue(true)

      const result = isCountryAvailable('US')
      expect(result).toBe(true)
    })

    it('should return false for an unsupported country', () => {
      // Mock de la fonction isSupportedCountry
      isSupportedCountry.mockReturnValue(false)

      const result = isCountryAvailable('InvalidCountryCode')
      expect(result).toBe(false)
    })
  })

  describe('getAsYouTypeFormat', () => {
    it('should return the formatted phone number for a given input', () => {
      // Mock de la classe AsYouType
      AsYouType.mockImplementation(() => ({
        input: (phoneNumber) => `Formatted: ${phoneNumber}`,
      }))

      const result = getAsYouTypeFormat('US', '123-456-7890')
      expect(result).toBe('Formatted: 123-456-7890')
    })
  })

  describe('fetchCountryCode', () => {
    it('should return the country code from an API', async () => {
      // Mock de la fonction fetch
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ country_code: 'FR' }),
      })

      const result = await fetchCountryCode()
      expect(result).toBe('FR')
    })

    it('should handle errors when fetching the country code', async () => {
      // Mock de la fonction fetch pour générer une erreur
      global.fetch = vi.fn().mockRejectedValue(new Error('API error'))

      try {
        await fetchCountryCode()
      } catch (error) {
        expect(error.message).toBe('[MazPhoneNumberInput](fetchCountryCode) Error: API error')
      }
    })
  })

  describe('useLibphonenumber', () => {
    it('should return an object with the expected functions', () => {
      const libphonenumberFunctions = useLibphonenumber()
      expect(libphonenumberFunctions).toEqual(
        expect.objectContaining({
          fetchCountryCode: expect.any(Function),
          getAsYouTypeFormat: expect.any(Function),
          getResultsFromPhoneNumber: expect.any(Function),
          loadPhoneNumberExamplesFile: expect.any(Function),
          getPhoneNumberExample: expect.any(Function),
          sanitizePhoneNumber: expect.any(Function),
          getCountriesList: expect.any(Function),
          browserLocale: expect.any(Function),
          isSameCountryCallingCode: expect.any(Function),
        }),
      )
    })
  })
})
