import { localeToUnicodeFlag } from '@modules/helpers'

describe('localeToUnicodeFlag', () => {
  test('devrait retourner un drapeau Unicode pour la locale "fr"', () => {
    const result = localeToUnicodeFlag('fr')
    expect(result).toBe('🇫🇷')
  })

  test('devrait retourner un drapeau Unicode pour la locale "de"', () => {
    const result = localeToUnicodeFlag('de')
    expect(result).toBe('🇩🇪')
  })

  test('devrait retourner un drapeau Unicode pour la locale "es"', () => {
    const result = localeToUnicodeFlag('es')
    expect(result).toBe('🇪🇸')
  })

  test('devrait retourner un drapeau Unicode pour la locale "it"', () => {
    const result = localeToUnicodeFlag('it')
    expect(result).toBe('🇮🇹')
  })

  // Ajoutez d'autres tests pour d'autres locales si nécessaire
})
