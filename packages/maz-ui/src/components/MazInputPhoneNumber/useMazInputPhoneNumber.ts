import type { CountryCode } from 'libphonenumber-js'
import { fetchLocaleIp } from '@maz-ui/utils/helpers/fetchLocaleIp'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

export interface CountryOption {
  code: CountryCode
  dialCode: string
  name: string
}

function getLocaleRegion(locale: string) {
  try {
    const { region } = new Intl.Locale(locale).maximize()

    return region?.length === 2
      ? region
      : undefined
  }
  catch {
    return undefined
  }
}

function getBrowserLocale() {
  if (typeof globalThis.window === 'undefined') {
    return
  }

  const browserLocale = globalThis.navigator.language

  if (!browserLocale) {
    return
  }

  return {
    locale: getLocaleRegion(browserLocale),
    browserLocale,
  }
}

const displayNamesByLocale = new Map<string, Intl.DisplayNames>()
const countryListByLocale = new Map<string, CountryOption[]>()

function createDisplayNames(locale: string) {
  try {
    return new Intl.DisplayNames([
      locale.replaceAll('_', '-'),
    ], { type: 'region' })
  }
  catch {
    return new Intl.DisplayNames(['en-US'], { type: 'region' })
  }
}

function getDisplayNames(locale: string) {
  let displayNames = displayNamesByLocale.get(locale)

  if (!displayNames) {
    displayNames = createDisplayNames(locale)
    displayNamesByLocale.set(locale, displayNames)
  }

  return displayNames
}

function getCountryName(
  locale: string,
  code: CountryCode | string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): string | undefined {
  if (customCountriesNameListByIsoCode?.[code as CountryCode]) {
    return customCountriesNameListByIsoCode[code as CountryCode]
  }

  return getDisplayNames(locale).of(code)
}

function buildCountryList(
  locale: string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): CountryOption[] {
  const countriesList: CountryOption[] = []

  for (const code of getCountries()) {
    const name = getCountryName(locale, code, customCountriesNameListByIsoCode)

    if (name) {
      try {
        const dialCode = getCountryCallingCode(code)
        countriesList.push({
          code,
          dialCode,
          name,
        })
      }
      catch (error) {
        console.error(`[MazInputPhoneNumber](getCountryCallingCode) ${error}`)
      }
    }
  }

  return countriesList
}

function getCountryList(
  locale?: string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): CountryOption[] {
  const countryLocale = locale || getBrowserLocale()?.browserLocale || 'en-US'

  if (customCountriesNameListByIsoCode) {
    return buildCountryList(countryLocale, customCountriesNameListByIsoCode)
  }

  let countriesList = countryListByLocale.get(countryLocale)

  if (!countriesList) {
    countriesList = buildCountryList(countryLocale)
    countryListByLocale.set(countryLocale, countriesList)
  }

  return [...countriesList]
}

async function fetchCountryCode(): Promise<{ data: CountryCode, error: undefined } | { data: undefined, error: Error }> {
  try {
    const countryCode = await fetchLocaleIp()

    if (!countryCode) {
      return {
        data: undefined,
        error: new Error(`[MazInputPhoneNumber](fetchCountryCode) No country code found`),
      }
    }

    return {
      data: countryCode as CountryCode,
      error: undefined,
    }
  }
  catch (error) {
    return {
      data: undefined,
      error: new Error(`[MazInputPhoneNumber](fetchCountryCode) ${error}`),
    }
  }
}

const isLetterOrNumberRegex = /[^\d ()+-]/g
const arabicIndicDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/g
const EXTENDED_ARABIC_INDIC_ZERO = 0x06F0
const ARABIC_INDIC_ZERO = 0x0660

function toAsciiDigits(input: string) {
  return input.normalize('NFKC').replaceAll(arabicIndicDigitRegex, (digit) => {
    const codePoint = digit.codePointAt(0) ?? ARABIC_INDIC_ZERO
    return String(codePoint - (codePoint >= EXTENDED_ARABIC_INDIC_ZERO
      ? EXTENDED_ARABIC_INDIC_ZERO
      : ARABIC_INDIC_ZERO))
  })
}

function sanitizePhoneNumber(input?: string | undefined | null) {
  if (!input) {
    return ''
  }

  return toAsciiDigits(input).replaceAll(isLetterOrNumberRegex, '').trim()
}

export function useMazInputPhoneNumber() {
  return {
    fetchCountryCode,
    getBrowserLocale,
    getCountryList,
    sanitizePhoneNumber,
  }
}
