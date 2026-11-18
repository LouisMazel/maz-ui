import { useMazInputPhoneNumber } from '@components/MazInputPhoneNumber/useMazInputPhoneNumber'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

const { fetchCountryCode, getBrowserLocale, getCountryList, sanitizePhoneNumber } = useMazInputPhoneNumber()

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
    describe.each([
      { language: 'zh', locale: 'CN' },
      { language: 'ca', locale: 'ES' },
      { language: 'ar', locale: 'EG' },
      { language: 'ko', locale: 'KR' },
    ])('when navigator language is $language without region', ({ language, locale }) => {
      it(`returns ${locale} as locale`, () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: language,
          configurable: true,
        })

        expect(getBrowserLocale()).toEqual({ locale, browserLocale: language })
      })
    })

    describe('when navigator language has a numeric region (es-419)', () => {
      it('returns no locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'es-419',
          configurable: true,
        })

        expect(getBrowserLocale()).toEqual({ locale: undefined, browserLocale: 'es-419' })
      })
    })

    describe('when navigator language is not a valid language tag', () => {
      it('returns no locale', () => {
        Object.defineProperty(globalThis.navigator, 'language', {
          value: 'not a locale',
          configurable: true,
        })

        expect(getBrowserLocale()).toEqual({ locale: undefined, browserLocale: 'not a locale' })
      })
    })
  })

  describe('sanitizePhoneNumber', () => {
    describe.each([
      { label: 'full-width digits', input: '０９０１２３４５６７８', expected: '09012345678' },
      { label: 'arabic-indic digits', input: '٠٦٥٨', expected: '0658' },
      { label: 'extended arabic-indic digits', input: '۰۶۵۸', expected: '0658' },
      { label: 'letters and dots', input: '+33 6.58-ab(58)', expected: '+33 658-(58)' },
    ])('when the input contains $label', ({ input, expected }) => {
      it(`returns ${expected}`, () => {
        expect(sanitizePhoneNumber(input)).toBe(expected)
      })
    })
  })

  describe('getCountryList', () => {
    describe('when it is called twice with the same locale', () => {
      it('then it builds the list once and returns independent copies', () => {
        vi.mocked(getCountries).mockReturnValue(['FR', 'BE'])
        vi.mocked(getCountryCallingCode).mockImplementation(code => (code === 'FR'
          ? '33'
          : '32') as never)

        const first = getCountryList('de-DE')
        first.reverse()
        const second = getCountryList('de-DE')

        expect(second.map(country => country.code)).toEqual(['FR', 'BE'])
        expect(second).not.toBe(first)
        expect(getCountries).toHaveBeenCalledTimes(1)
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
