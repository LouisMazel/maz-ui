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

const PHONE_CHAR_REGEX = /^[\d ().-]+$/
const NON_ALPHA_REGEX = /^[^a-z]+$/i

let examples: Examples

export async function loadPhoneNumberExamplesFile() {
  const { default: data } = await import('libphonenumber-js/examples.mobile.json')

  examples = data
  return examples
}

export function getExamplePhoneNumber(countryCode: CountryCode) {
  return getExampleNumber(countryCode, examples)
}

export function sanitizePhoneNumber(input?: string) {
  if (!input) {
    return
  }

  const hasNonAlpha = NON_ALPHA_REGEX.test(input)
  const hasPhoneChar = PHONE_CHAR_REGEX.test(input)

  if (!hasNonAlpha && !hasPhoneChar) {
    return input.replace(/[^\d.]/g, '')
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`[MazPhoneNumberInput](getCountryCallingCode) ${error}`)
      }
    }
  }

  return countriesList
}

export function browserLocale() {
  try {
    if (typeof window === 'undefined') {
      return
    }

    const browserLocale = window.navigator.language

    if (!browserLocale) {
      return
    }

    let locale = browserLocale.slice(3, 7).toUpperCase()

    if (locale === '') {
      locale = browserLocale.slice(0, 2).toUpperCase()
    }

    if (locale === 'EN') {
      locale = 'US'
    }
    if (locale === 'JA') {
      locale = 'JP'
    }

    return locale
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](browserLocale) ${error}`)
  }
}

export function isCountryAvailable(locale: string) {
  try {
    const response = isSupportedCountry(locale)

    if (!response) {
      console.error(
        `[MazPhoneNumberInput](isCountryAvailable) The code country "${locale}" is not available`,
      )
    }

    return response
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](isCountryAvailable) ${error}`)
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
      isPossible: parsing?.isPossible(),
      countryCode: parsing?.country,
      countryCallingCode: parsing?.countryCallingCode,
      nationalNumber: parsing?.nationalNumber,
      type: parsing?.getType(),
      formatInternational: parsing?.formatInternational(),
      formatNational: parsing?.formatNational(),
      uri: parsing?.getURI(),
      e164: parsing?.format('E.164'),
      rfc3966: parsing?.format('RFC3966'),
    }
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getResultsFromPhoneNumber) ${error}`)
  }
}

export function getAsYouTypeFormat(countryCode: CountryCode, phoneNumber?: string) {
  try {
    if (!phoneNumber) {
      return
    }

    return countryCode ? new AsYouType(countryCode).input(phoneNumber) : phoneNumber
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getAsYouTypeFormat) ${error}`)
  }
}

interface IpWhoResponse {
  ip: string
  success: true
  type?: string
  continent?: string
  continent_code?: string
  country?: string
  country_code?: string
  region?: string
  region_code?: string
  city?: string
  latitude?: number
  longitude?: number
  is_eu: true
  postal?: string
  calling_code?: string
  capital?: string
  borders?: string
  flag: {
    img?: string
    emoji?: string
    emoji_unicode?: string
  }
  connection: {
    asn?: number
    org?: string
    isp?: string
    domain?: string
  }
  timezone: {
    id?: string
    abbr?: string
    is_dst: false
    offset?: number
    utc?: string
    current_time?: string
  }
}

export async function fetchCountryCode() {
  try {
    const reponse = await fetch('http://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](fetchCountryCode) ${error}`)
  }
}
