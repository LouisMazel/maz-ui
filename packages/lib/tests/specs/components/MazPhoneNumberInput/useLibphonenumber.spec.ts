import { useLibphonenumber } from '@components/MazInputPhoneNumber/useLibphonenumber'
import { AsYouType, getExampleNumber, isSupportedCountry } from 'libphonenumber-js'

const { isCountryAvailable, getPhoneNumberExample, getAsYouTypeFormat, loadExamples } = useLibphonenumber()

vi.mock('libphonenumber-js', () => ({
  parsePhoneNumberFromString: vi.fn(),
  AsYouType: vi.fn(),
  getCountries: vi.fn(),
  getCountryCallingCode: vi.fn(),
  getExampleNumber: vi.fn(),
  isSupportedCountry: vi.fn(),
}))

describe('unit Tests for useLibphonenumber.ts', () => {
  describe('getPhoneNumberExample', () => {
    it('should return a phone number example for a given country code', async () => {
      // Mock de la fonction getExampleNumber
      await loadExamples()
      // @ts-expect-error - test case - test case
      getExampleNumber.mockReturnValue({ formatNational: () => '+1 123-456-7890' })

      const result = getPhoneNumberExample('US')
      expect(result).toBe('+1 123-456-7890')
    })

    it('should handle errors gracefully', () => {
      // Mock de la fonction getExampleNumber pour générer une erreur
      // @ts-expect-error - test case
      getExampleNumber.mockImplementation(() => {
        throw new Error('Example number not available')
      })
      // @ts-expect-error - test case
      const result = getPhoneNumberExample('InvalidCountryCode')
      expect(result).toBeUndefined()
    })
  })

  describe('isCountryAvailable', () => {
    it('should return true for a supported country', () => {
      // Mock de la fonction isSupportedCountry
      // @ts-expect-error - test case
      isSupportedCountry.mockReturnValue(true)

      const result = isCountryAvailable('US')
      expect(result).toBe(true)
    })

    it('should return false for an unsupported country', () => {
      // Mock de la fonction isSupportedCountry
      // @ts-expect-error - test case
      isSupportedCountry.mockReturnValue(false)

      const result = isCountryAvailable('InvalidCountryCode')
      expect(result).toBe(false)
    })
  })

  describe('getAsYouTypeFormat', () => {
    it('should return the formatted phone number for a given input', () => {
      // Mock de la classe AsYouType
      // @ts-expect-error - test case
      AsYouType.mockImplementation(() => ({
        input: phoneNumber => `Formatted: ${phoneNumber}`,
      }))

      const result = getAsYouTypeFormat('US', '123-456-7890')
      expect(result).toBe('Formatted: 123-456-7890')
    })
  })

  describe('useLibphonenumber', () => {
    it('should return an object with the expected functions', () => {
      const libphonenumberFunctions = useLibphonenumber()
      expect(libphonenumberFunctions).toEqual(
        expect.objectContaining({
          getAsYouTypeFormat: expect.any(Function),
          getPhoneNumberResults: expect.any(Function),
          getPhoneNumberExamplesFile: expect.any(Function),
          getPhoneNumberExample: expect.any(Function),
          isCountryAvailable: expect.any(Function),
          getCountries: expect.any(Function),
          getCountryCallingCode: expect.any(Function),
          isSameCountryCallingCode: expect.any(Function),
        }),
      )
    })
  })
})
