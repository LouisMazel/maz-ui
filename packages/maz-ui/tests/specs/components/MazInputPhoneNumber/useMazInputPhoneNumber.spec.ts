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
    describe('when navigator language is en-US', () => {
      it('returns US as locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'en-US',
          configurable: true,
        })

        const result = getBrowserLocale()
        expect(result).toEqual({ locale: 'US', browserLocale: 'en-US' })
      })
    })

    describe('when navigator language has extended format (en-GB-oxendict)', () => {
      it('extracts only the first 2 characters of the region code', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'en-GB-oxendict',
          configurable: true,
        })

        const result = getBrowserLocale()
        expect(result).toEqual({ locale: 'GB', browserLocale: 'en-GB-oxendict' })
      })
    })

    describe('when navigator language is fr-FR', () => {
      it('returns FR as locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'fr-FR',
          configurable: true,
        })

        const result = getBrowserLocale()
        expect(result).toEqual({ locale: 'FR', browserLocale: 'fr-FR' })
      })
    })

    describe('when navigator language is en without region', () => {
      it('returns US as locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'en',
          configurable: true,
        })

        const result = getBrowserLocale()
        expect(result).toEqual({ locale: 'US', browserLocale: 'en' })
      })
    })

    describe('when navigator language is ja', () => {
      it('returns JP as locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'ja',
          configurable: true,
        })

        const result = getBrowserLocale()
        expect(result).toEqual({ locale: 'JP', browserLocale: 'ja' })
      })
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
