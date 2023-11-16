import { truthyFilter } from './truthy-filter'

export function countryCodeToUnicodeFlag(locale: string) {
  return [...locale]
    .map((letter) => {
      const code = letter.codePointAt(0)
      return code ? (code % 32) + 0x1_f1_e5 : undefined
    })
    .filter(truthyFilter)
    .map((n) => String.fromCodePoint(n))
    .join('')
}
