export interface NormalizeStringOptions {
  /**
   * Remove accents from the string
   * @default true
   */
  removeAccents?: boolean
  /**
   * Keep the case of the string
   * @default false
   */
  caseSensitive?: boolean
  /**
   * Replace spaces with `-`
   * @default true
   */
  replaceSpaces?: boolean
  /**
   * Remove special characters
   * Be careful, only for languages that use the Latin alphabet
   * @default false
   */
  removeSpecialCharacters?: boolean
  /**
   * Remove leading and trailing whitespaces
   * @default true
   */
  trim?: boolean
  /**
   * Normalize spaces
   * Will replace multiple spaces with a single space
   * @default true
   */
  normalizeSpaces?: boolean
  /**
   * Remove numbers
   * @default false
   */
  removeNumbers?: boolean
  /**
   * Normalize the string with custom normalization forms
   * @default ['NFC', 'NFKD']
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
   * options: 'NFC', 'NFD', 'NFKC', 'NFKD'
   */
  customNormalizationForms?: string[]
}

const defaultOptions: NormalizeStringOptions = {
  removeAccents: true,
  caseSensitive: false,
  replaceSpaces: true,
  removeSpecialCharacters: false,
  trim: true,
  normalizeSpaces: true,
  removeNumbers: false,
  customNormalizationForms: ['NFC', 'NFKD'],
}

export function normalizeString(
  input: string | number | boolean,
  options?: NormalizeStringOptions,
): string {
  const finalOptions = { ...defaultOptions, ...options }

  const accentsMap: Record<string, string> = { À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A', à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a', È: 'E', É: 'E', Ê: 'E', Ë: 'E', è: 'e', é: 'e', ê: 'e', ë: 'e', Î: 'I', Ï: 'I', í: 'I', î: 'i', ï: 'i', Ô: 'O', Õ: 'O', Ö: 'O', Ø: 'O', ô: 'o', õ: 'o', ö: 'o', ø: 'o', Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U', ù: 'u', ú: 'u', û: 'u', ü: 'u', Ç: 'C', ç: 'c', ÿ: 'y', Ñ: 'N', ñ: 'n', ó: 'o',
  }

  let result = input.toString()

  if (finalOptions.trim) {
    result = result.trim()
  }

  if (finalOptions.normalizeSpaces) {
    result = result.replaceAll(/\s+/g, ' ')
  }

  if (finalOptions.replaceSpaces) {
    result = result.replaceAll(' ', '-')
  }

  if (finalOptions.removeNumbers) {
    result = result.replaceAll(/\d/g, '')
  }

  if (finalOptions.removeAccents) {
    result = result.replaceAll(/[ÀÁÂÃÄÅÇÈÉÊËÎÏÑÔÕÖØÙÚÛÜàáâãäåçèéêëíîïñóôõöøùúûüÿ]/g, (char) => {
      return accentsMap[char] || char
    })

    result = result.replaceAll(/[\u0300-\u036F]/g, '')
  }

  if (finalOptions.caseSensitive === false) {
    result = result.toLowerCase()
  }

  if (finalOptions.removeSpecialCharacters) {
    result = result.replaceAll(/[^\dA-Z-]/gi, '')
  }

  if (finalOptions.trim) {
    result = result.trim()
  }

  if (finalOptions.customNormalizationForms) {
    for (const form of finalOptions.customNormalizationForms) {
      result = result.normalize(form)
    }
  }

  return result
}
