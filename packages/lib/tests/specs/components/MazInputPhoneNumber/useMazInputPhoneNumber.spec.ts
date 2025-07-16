import { useMazInputPhoneNumber } from '@components/MazInputPhoneNumber/useMazInputPhoneNumber'

const { fetchCountryCode, getBrowserLocale } = useMazInputPhoneNumber()

vi.mock('libphonenumber-js', () => ({
  parsePhoneNumberFromString: vi.fn(),
  AsYouType: vi.fn(),
  getCountries: vi.fn(),
  getCountryCallingCode: vi.fn(),
  getExampleNumber: vi.fn(),
  isSupportedCountry: vi.fn(),
}))

describe('unit Tests for useMazInputPhoneNumber.ts', () => {
  describe('browserLocale', () => {
    it('should return the browser locale', () => {
      // Mock de window.navigator.language
      Object.defineProperty(globalThis.navigator, 'language', {
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
        }),
      )
    })
  })
})
