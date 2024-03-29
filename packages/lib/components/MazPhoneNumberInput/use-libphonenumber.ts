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
import type { Country, Results } from './types'
import { ref } from 'vue'

let displayNamesInstance: Intl.DisplayNames | undefined = undefined
let displayNamesLocale: string | undefined = undefined

function getCountryName(
  locale: string,
  code: CountryCode | string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): string | undefined {
  if (customCountriesNameListByIsoCode?.[code]) {
    return customCountriesNameListByIsoCode[code]
  }

  if (displayNamesLocale !== locale || !displayNamesInstance) {
    displayNamesLocale = locale
    displayNamesInstance = new Intl.DisplayNames([locale], { type: 'region' })
  }

  return displayNamesInstance.of(code)
}

const examples = ref<Examples>()

async function loadPhoneNumberExamplesFile() {
  if (examples.value) {
    return examples.value
  }

  const { default: data } = await import('libphonenumber-js/examples.mobile.json')

  examples.value = data

  return examples.value
}

function isSameCountryCallingCode(countryCode: CountryCode, countryCode2: CountryCode) {
  return getCountryCallingCode(countryCode) === getCountryCallingCode(countryCode2)
}

function getPhoneNumberExample(countryCode?: CountryCode) {
  try {
    if (!examples.value) {
      return
    }

    return countryCode ? getExampleNumber(countryCode, examples.value)?.formatNational() : undefined
  } catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
  }
}

function getCountriesList(
  locale?: string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): Country[] | undefined {
  const countriesList: Country[] = []
  const isoList = getCountries()

  locale = locale ?? getBrowserLocale()?.browserLocale ?? 'en-US'

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

function getBrowserLocale() {
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

  return {
    locale,
    browserLocale,
  }
}

function isCountryAvailable(locale: string) {
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

function getPhoneNumberResults({
  phoneNumber,
  countryCode,
}: {
  phoneNumber?: string
  countryCode?: CountryCode
}): Results {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        countryCode,
      }
    }

    const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode)

    return {
      countryCode: parsedNumber?.country ?? countryCode,
      isValid: parsedNumber?.isValid() ?? false,
      isPossible: parsedNumber?.isPossible(),
      countryCallingCode: parsedNumber?.countryCallingCode,
      nationalNumber: parsedNumber?.nationalNumber,
      type: parsedNumber?.getType(),
      formatInternational: parsedNumber?.formatInternational(),
      formatNational: parsedNumber?.formatNational(),
      uri: parsedNumber?.getURI(),
      e164: parsedNumber?.format('E.164'),
      rfc3966: parsedNumber?.format('RFC3966'),
      phoneNumber,
    }
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getResultsFromPhoneNumber) ${error}`)
  }
}

function getAsYouTypeFormat(countryCode?: CountryCode, phoneNumber?: string): string {
  try {
    if (!phoneNumber) {
      return ''
    }

    return new AsYouType(countryCode).input(phoneNumber)
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](getAsYouTypeFormat) ${error}`)
  }
}

export function useLibphonenumber() {
  return {
    examples,
    getAsYouTypeFormat,
    getPhoneNumberResults,
    loadPhoneNumberExamplesFile,
    getPhoneNumberExample,
    getCountriesList,
    getBrowserLocale,
    isSameCountryCallingCode,
    isCountryAvailable,
  }
}
