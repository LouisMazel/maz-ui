import { camelCase } from './camelCase.js'
import { kebabCase } from './kebabCase.js'
import { pascalCase } from './pascalCase.js'
import { snakeCase } from './snakeCase.js'

export type CaseFormat = 'kebab-case' | 'camelCase' | 'PascalCase' | 'snake_case' | 'lowercase' | 'UPPERCASE'

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
   * Convert the output to a specific case format
   * @default undefined (keeps original case, respects caseSensitive option)
   */
  case?: CaseFormat
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
  case: undefined,
  customNormalizationForms: ['NFC', 'NFKD'],
}

/** Latin letters without a canonical decomposition: `NFD` does not split them into a base letter and an accent */
const UNDECOMPOSABLE_LETTERS: Record<string, string> = {
  Æ: 'AE',
  æ: 'ae',
  Œ: 'OE',
  œ: 'oe',
  Ø: 'O',
  ø: 'o',
  Ł: 'L',
  ł: 'l',
  Đ: 'D',
  đ: 'd',
  Ħ: 'H',
  ħ: 'h',
  ı: 'i',
  ß: 'ss',
  ẞ: 'SS',
}

const UNDECOMPOSABLE_LETTERS_PATTERN = /[æđħıłßøœ]/giu

/**
 * Apply case transformation to string
 */
function applyCaseTransform(str: string, caseFormat: CaseFormat): string {
  switch (caseFormat) {
    case 'kebab-case':
      return kebabCase(str)
    case 'camelCase':
      return camelCase(str)
    case 'PascalCase':
      return pascalCase(str)
    case 'snake_case':
      return snakeCase(str)
    case 'lowercase':
      return str.toLowerCase()
    case 'UPPERCASE':
      return str.toUpperCase()
    default:
      return str
  }
}

export function normalizeString(
  input: string | number | boolean,
  options?: NormalizeStringOptions,
): string {
  const finalOptions = {
    ...defaultOptions,
    ...options,
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
    result = result
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .replaceAll(UNDECOMPOSABLE_LETTERS_PATTERN, char => UNDECOMPOSABLE_LETTERS[char] ?? char)
  }

  // Apply case transformation BEFORE caseSensitive check
  if (finalOptions.case) {
    result = applyCaseTransform(result, finalOptions.case)
  }
  else if (finalOptions.caseSensitive === false) {
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
