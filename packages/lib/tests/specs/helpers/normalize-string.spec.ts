import { normalizeString } from '@modules/helpers/normalize-string'

describe('normalizeString', () => {
  test('should normalize accents by default', () => {
    expect(normalizeString('áéíóú')).toBe('aeiou')
  })

  test('should remove accents based on options', () => {
    expect(normalizeString('áéíóú', { removeAccents: false })).toBe('áéíóú')
  })

  test('should handle case sensitivity based on options', () => {
    expect(normalizeString('AbCde', { caseSensitive: true })).toBe('AbCde')
    expect(normalizeString('AbCde', { caseSensitive: false })).toBe('abcde')
  })

  test('should replace spaces with dashes based on options', () => {
    expect(normalizeString('a b c')).toBe('a-b-c')
  })

  test('should remove special characters based on options', () => {
    const options = { removeSpecialCharacters: true }
    expect(normalizeString('a&b@c', options)).toBe('abc')
  })

  test('should handle special characters', () => {
    expect(
      normalizeString("!@#$%^&*()_+=[]{}|;':,.<>?", {
        removeSpecialCharacters: true,
      }),
    ).toBe('')
  })

  test('should remove numbers based on options', () => {
    const options = { removeNumbers: true }
    expect(normalizeString('a1b2c3', options)).toBe('abc')
  })

  test('should normalize spaces based on options', () => {
    expect(normalizeString('a  b   c')).toBe('a-b-c')
  })

  test('should normalize the string with custom normalization forms based on options', () => {
    const options = { customNormalizationForms: ['NFKC'] }
    expect(normalizeString('ﬃ', options)).toBe('ffi')
  })

  test('should trim leading and trailing whitespaces based on options', () => {
    expect(normalizeString('  abc  ')).toBe('abc')
  })

  test('should handle various combinations of options', () => {
    const options = {
      removeAccents: true,
      caseSensitive: false,
      replaceSpaces: true,
      removeSpecialCharacters: true,
      trim: true,
      normalizeSpaces: true,
      removeNumbers: true,
      customNormalizationForms: ['NFC', 'NFKD'],
    }
    expect(normalizeString('Áé 123 ñ', options)).toBe('ae--n')
  })
})
