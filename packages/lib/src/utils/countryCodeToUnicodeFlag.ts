import { truthyFilter } from './../utils/truthyFilter'

export function countryCodeToUnicodeFlag(locale: string) {
  return [...locale]
    .map((letter) => {
      const code = letter.codePointAt(0)
      return code ? (code % 32) + 0x1_F1_E5 : undefined
    })
    .filter(truthyFilter)
    .map(n => String.fromCodePoint(n))
    .join('')
}
