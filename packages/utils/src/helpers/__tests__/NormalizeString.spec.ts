import { normalizeString } from '../normalizeString'

describe('normalizeString', () => {
  it('should normalize accents by default', () => {
    expect(normalizeString('áéíóú')).toBe('aeiou')
  })

  it('should remove accents based on options', () => {
    expect(normalizeString('áéíóú', { removeAccents: false })).toBe('áéíóú')
  })

  it('should handle case sensitivity based on options', () => {
    expect(normalizeString('AbCde', { caseSensitive: true })).toBe('AbCde')
    expect(normalizeString('AbCde', { caseSensitive: false })).toBe('abcde')
  })

  it('should replace spaces with dashes based on options', () => {
    expect(normalizeString('a b c')).toBe('a-b-c')
  })

  it('should remove special characters based on options', () => {
    const options = { removeSpecialCharacters: true }
    expect(normalizeString('a&b@c', options)).toBe('abc')
  })

  it('should handle special characters', () => {
    expect(
      normalizeString('!@#$%^&*()_+=[]{}|;\':,.<>?', {
        removeSpecialCharacters: true,
      }),
    ).toBe('')
  })

  it('should remove numbers based on options', () => {
    const options = { removeNumbers: true }
    expect(normalizeString('a1b2c3', options)).toBe('abc')
  })

  it('should normalize spaces based on options', () => {
    expect(normalizeString('a  b   c')).toBe('a-b-c')
  })

  it('should normalize the string with custom normalization forms based on options', () => {
    const options = { customNormalizationForms: ['NFKC'] }
    expect(normalizeString('ﬃ', options)).toBe('ffi')
  })

  it('should trim leading and trailing whitespaces based on options', () => {
    expect(normalizeString('  abc  ')).toBe('abc')
  })

  it('should handle various combinations of options', () => {
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

  describe('case transformation', () => {
    it('should convert to kebab-case', () => {
      expect(normalizeString('MazBtn', { case: 'kebab-case' })).toBe('maz-btn')
      expect(normalizeString('mazInputText', { case: 'kebab-case' })).toBe('maz-input-text')
      expect(normalizeString('XML Parser', { case: 'kebab-case' })).toBe('xml-parser')
    })

    it('should convert to camelCase', () => {
      expect(normalizeString('maz-btn', { case: 'camelCase' })).toBe('mazBtn')
      expect(normalizeString('maz-input-text', { case: 'camelCase' })).toBe('mazInputText')
    })

    it('should convert to PascalCase', () => {
      expect(normalizeString('maz-btn', { case: 'PascalCase' })).toBe('MazBtn')
      expect(normalizeString('maz-input-text', { case: 'PascalCase' })).toBe('MazInputText')
    })

    it('should convert to snake_case', () => {
      expect(normalizeString('MazBtn', { case: 'snake_case' })).toBe('maz_btn')
      expect(normalizeString('mazInputText', { case: 'snake_case' })).toBe('maz_input_text')
      expect(normalizeString('XML Parser', { case: 'snake_case' })).toBe('xml_parser')
    })

    it('should convert to lowercase', () => {
      expect(normalizeString('MazBtn', { case: 'lowercase' })).toBe('mazbtn')
      expect(normalizeString('MAZ-BTN', { case: 'lowercase' })).toBe('maz-btn')
    })

    it('should convert to UPPERCASE', () => {
      expect(normalizeString('maz-btn', { case: 'UPPERCASE' })).toBe('MAZ-BTN')
      expect(normalizeString('mazBtn', { case: 'UPPERCASE' })).toBe('MAZBTN')
    })

    it('should handle case option with other normalization options', () => {
      const options = {
        case: 'kebab-case' as const,
        removeAccents: true,
        normalizeSpaces: true,
        trim: true,
      }
      expect(normalizeString('  Máz  Bútton  ', options)).toBe('maz-button')
    })

    it('should prioritize case option over caseSensitive', () => {
      const options = {
        case: 'kebab-case' as const,
        caseSensitive: true, // This should be ignored when case is specified
      }
      expect(normalizeString('MazBtn', options)).toBe('maz-btn')
    })
  })
})
