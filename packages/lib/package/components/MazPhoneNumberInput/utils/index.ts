import {
  parsePhoneNumberFromString,
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  type Examples,
} from 'libphonenumber-js'
import { countriesNameListByIsoCode } from './countries-name-list-by-iso-code'
import type { Country, Result } from '../types'

export function getCountryName(
  code: CountryCode | string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): string | undefined {
  return {
    ...countriesNameListByIsoCode,
    ...customCountriesNameListByIsoCode,
  }[code]
}

const PHONE_CHAR_REGEX = /^[-.() \d]+$/
const NON_ALPHA_REGEX = /^[^a-z]+$/i

let examples: Examples

export async function loadPhoneNumberExamplesFile() {
  examples = (await import('libphonenumber-js/examples.mobile.json')).default
  return examples
}

export function getExamplePhoneNumber(countryCode: CountryCode) {
  return getExampleNumber(countryCode, examples)
}

export function sanitizePhoneNumber(input?: string) {
  if (!input) {
    return undefined
  }

  const hasNonAlpha = NON_ALPHA_REGEX.test(input)
  const hasPhoneChar = PHONE_CHAR_REGEX.test(input)

  if (!hasNonAlpha && !hasPhoneChar) {
    return input.replace(/[^0-9.]/g, '')
  }

  return input
}

export function getCountriesList(
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): Country[] | undefined {
  const countriesList: Country[] = []
  const isoList = getCountries()

  for (const iso2 of isoList) {
    const name = getCountryName(iso2, customCountriesNameListByIsoCode)

    if (name) {
      try {
        const dialCode = getCountryCallingCode(iso2)
        countriesList.push({
          iso2,
          dialCode,
          name,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[MazPhoneNumberInput] (getCountryCallingCode) ${err}`)
      }
    }
  }

  return countriesList
}

export function browserLocale() {
  try {
    if (typeof window === 'undefined') {
      return undefined
    }

    const browserLocale = window.navigator.language

    if (!browserLocale) {
      return undefined
    }

    let locale = browserLocale.substr(3, 4).toUpperCase()

    if (locale === '') {
      locale = browserLocale.substr(0, 2).toUpperCase()
    }

    if (locale === 'EN') {
      locale = 'US'
    }
    if (locale === 'JA') {
      locale = 'JP'
    }

    return locale
  } catch (err) {
    throw new Error(`[MazPhoneNumberInput] (browserLocale) ${err}`)
  }
}

export function isCountryAvailable(locale: string) {
  try {
    return isSupportedCountry(locale)
  } catch (err) {
    throw new Error(
      `[MazPhoneNumberInput] (isCountryAvailable) The country ${locale} is not available -  ${err}`,
    )
  }
}

export const getResultsFromPhoneNumber = (
  countryCode?: CountryCode,
  phoneNumber?: string,
): Result => {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        countryCode,
      }
    }
    const parsing = parsePhoneNumberFromString(phoneNumber, countryCode)

    return {
      isValid: parsing?.isValid() ?? false,
      countryCode: parsing?.country,
      countryCallingCode: parsing?.countryCallingCode,
      nationalNumber: parsing?.nationalNumber,
      type: parsing?.getType(),
      formatInternational: parsing?.formatInternational(),
      formatNational: parsing?.formatNational(),
      uri: parsing?.getURI(),
      e164: parsing?.format('E.164'),
    }
  } catch (err) {
    throw new Error(`[MazPhoneNumberInput] (getResultsFromPhoneNumber) ${err}`)
  }
}

export function getAsYouTypeFormat(
  countryCode: CountryCode,
  phoneNumber?: string,
) {
  try {
    if (!phoneNumber) {
      return undefined
    }

    return countryCode
      ? new AsYouType(countryCode).input(phoneNumber)
      : phoneNumber
  } catch (err) {
    throw new Error(`[MazPhoneNumberInput] (getAsYouTypeFormat) ${err}`)
  }
}

export async function fetchCountryCode() {
  try {
    const response = await fetch('https://ip2c.org/s')
    const responseText = await response.text()
    const result = (responseText || '').toString()

    if (!result || result[0] !== '1') {
      return undefined
    }

    return result.substr(2, 2)
  } catch (err) {
    throw new Error(`[MazPhoneNumberInput] (fetchCountryCode) ${err}`)
  }
}
