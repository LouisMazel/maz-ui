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
import { countriesNameListByIsoCode } from './constantes/countries-name-list-by-iso-code'
import type { Country, IpWhoResponse, Result } from './types'

function getCountryName(
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

async function loadPhoneNumberExamplesFile() {
  const { default: data } = await import('libphonenumber-js/examples.mobile.json')

  examples = data
  return examples
}

function getPhoneNumberExample(countryCode?: CountryCode) {
  try {
    return countryCode ? getExampleNumber(countryCode, examples)?.formatNational() : undefined
  } catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
  }
}

function sanitizePhoneNumber(input?: string) {
  if (!input) {
    return
  }

  const hasNonAlpha = NON_ALPHA_REGEX.test(input)
  const hasPhoneChar = PHONE_CHAR_REGEX.test(input)

  if (!hasNonAlpha && !hasPhoneChar) {
    return input.replaceAll(/[^\d.]/g, '')
  }

  return input
}

function getCountriesList(
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

function browserLocale() {
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
}

export function isCountryAvailable(locale: string) {
  try {
    const response = isSupportedCountry(locale)

    if (!response) {
      console.error(`[maz-ui](MazPhoneNumberInput) The code country "${locale}" is not available`)

      return false
    }

    return response
  } catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    return false
  }
}

const getResultsFromPhoneNumber = (countryCode?: CountryCode, phoneNumber?: string): Result => {
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

function getAsYouTypeFormat(countryCode: CountryCode, phoneNumber?: string) {
  try {
    if (!phoneNumber) {
      return
    }

    return countryCode ? new AsYouType(countryCode).input(phoneNumber) : phoneNumber
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getAsYouTypeFormat) ${error}`)
  }
}

async function fetchCountryCode() {
  try {
    const reponse = await fetch('https://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](fetchCountryCode) ${error}`)
  }
}

export function useLibphonenumber() {
  return {
    fetchCountryCode,
    getAsYouTypeFormat,
    getResultsFromPhoneNumber,
    getCountryName,
    loadPhoneNumberExamplesFile,
    getPhoneNumberExample,
    sanitizePhoneNumber,
    getCountriesList,
    browserLocale,
  }
}
