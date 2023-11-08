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
import type { Country, IpWhoResponse, Result } from './types'

let displayNamesInstance: Intl.DisplayNames | undefined = undefined

function getCountryName(
  locale: string,
  code: CountryCode | string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): string | undefined {
  if (customCountriesNameListByIsoCode?.[code]) {
    return customCountriesNameListByIsoCode[code]
  }

  if (!displayNamesInstance) {
    displayNamesInstance = new Intl.DisplayNames([locale], { type: 'region' })
  }

  return displayNamesInstance.of(code)
}

const PHONE_CHAR_REGEX = /^[\d ().-]+$/
const NON_ALPHA_REGEX = /^[^a-z]+$/i

let examples: Examples

async function loadPhoneNumberExamplesFile() {
  const { default: data } = await import('libphonenumber-js/examples.mobile.json')

  examples = data
  return examples
}

function isSameCountryCallingCode(countryCode: CountryCode, countryCode2: CountryCode) {
  return getCountryCallingCode(countryCode) === getCountryCallingCode(countryCode2)
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
    return ''
  }

  const hasNonAlpha = NON_ALPHA_REGEX.test(input)
  const hasPhoneChar = PHONE_CHAR_REGEX.test(input)

  if (!hasNonAlpha && !hasPhoneChar) {
    return input.replaceAll(/[^\d.]/g, '')
  }

  return input
}

function getCountriesList(
  locale?: string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): Country[] | undefined {
  const countriesList: Country[] = []
  const isoList = getCountries()

  locale = locale ?? browserLocale().browserLocale ?? 'en-US'

  for (const iso2 of isoList) {
    const name = getCountryName(locale, iso2, customCountriesNameListByIsoCode)

    if (name) {
      try {
        const dialCode = getCountryCallingCode(iso2)
        countriesList.push({
          iso2,
          dialCode,
          name,
        })
      } catch (error) {
        console.error(`[MazPhoneNumberInput](getCountryCallingCode) ${error}`)
      }
    }
  }

  return countriesList
}

function browserLocale() {
  if (typeof window === 'undefined') {
    return {}
  }

  const browserLocale = window.navigator.language

  if (!browserLocale) {
    return {}
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

  return { locale, browserLocale }
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

const getResultsFromPhoneNumber = ({
  phoneNumber,
  countryCode,
}: {
  phoneNumber?: string
  countryCode?: CountryCode
}): Result => {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        countryCode,
      }
    }

    const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode)

    return {
      isValid: parsedNumber?.isValid() ?? false,
      isPossible: parsedNumber?.isPossible(),
      countryCode: parsedNumber?.country,
      countryCallingCode: parsedNumber?.countryCallingCode,
      nationalNumber: parsedNumber?.nationalNumber,
      type: parsedNumber?.getType(),
      formatInternational: parsedNumber?.formatInternational(),
      formatNational: parsedNumber?.formatNational(),
      uri: parsedNumber?.getURI(),
      e164: parsedNumber?.format('E.164'),
      rfc3966: parsedNumber?.format('RFC3966'),
    }
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getResultsFromPhoneNumber) ${error}`)
  }
}

function getAsYouTypeFormat(countryCode?: CountryCode, phoneNumber?: string) {
  try {
    if (!phoneNumber) {
      return
    }

    return new AsYouType(countryCode).input(phoneNumber)
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
    loadPhoneNumberExamplesFile,
    getPhoneNumberExample,
    sanitizePhoneNumber,
    getCountriesList,
    browserLocale,
    isSameCountryCallingCode,
  }
}
