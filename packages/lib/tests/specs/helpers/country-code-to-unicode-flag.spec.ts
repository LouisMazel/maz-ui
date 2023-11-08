import { countryCodeToUnicodeFlag } from '@modules/helpers/country-code-to-unicode-flag'

describe('countryCodeToUnicodeFlag', () => {
  test('devrait retourner un drapeau Unicode pour la locale "fr"', () => {
    const result = countryCodeToUnicodeFlag('fr')
    expect(result).toBe('🇫🇷')
  })

  test('devrait retourner un drapeau Unicode pour la locale "de"', () => {
    const result = countryCodeToUnicodeFlag('de')
    expect(result).toBe('🇩🇪')
  })

  test('devrait retourner un drapeau Unicode pour la locale "es"', () => {
    const result = countryCodeToUnicodeFlag('es')
    expect(result).toBe('🇪🇸')
  })

  test('devrait retourner un drapeau Unicode pour la locale "it"', () => {
    const result = countryCodeToUnicodeFlag('it')
    expect(result).toBe('🇮🇹')
  })

  // Ajoutez d'autres tests pour d'autres locales si nécessaire
})
