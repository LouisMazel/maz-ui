export function countryCodeToUnicodeFlag(locale: string) {
  const characters = [...locale]
  return (
    characters
      // eslint-disable-next-line unicorn/prefer-code-point
      .map((letter) => (letter.charCodeAt(0) % 32) + 0x1_f1_e5)
      .map((n) => String.fromCodePoint(n))
      .join('')
  )
}
