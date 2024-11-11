import type { Results } from './types'
import {
  AsYouType,
  type CountryCode,
  type Examples,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumberFromString,
} from 'libphonenumber-js'

function isCountryAvailable(locale: string) {
  try {
    const response = isSupportedCountry(locale)

    if (!response) {
      console.error(`[maz-ui](MazPhoneNumberInput) The code country "${locale}" is not available`)

      return false
    }

    return response
  }
  catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
    return false
  }
}

function getPhoneNumberResults({
  phoneNumber,
  countryCode,
}: {
  phoneNumber?: string | undefined | null
  countryCode?: CountryCode | undefined | null
}): Results {
  try {
    if (!phoneNumber) {
      return {
        isValid: false,
        countryCode,
      }
    }

    const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode ?? undefined)
    const isValid = parsedNumber?.isValid() ?? false

    return {
      countryCode: parsedNumber?.country,
      isValid,
      isPossible: parsedNumber?.isPossible(),
      countryCallingCode: parsedNumber?.countryCallingCode,
      nationalNumber: parsedNumber?.nationalNumber,
      type: parsedNumber?.getType(),
      formatInternational: parsedNumber?.formatInternational(),
      formatNational: parsedNumber?.formatNational(),
      uri: parsedNumber?.getURI(),
      e164: parsedNumber?.format('E.164'),
      rfc3966: parsedNumber?.format('RFC3966'),
      possibleCountries: parsedNumber?.getPossibleCountries(),
      phoneNumber,
    }
  }
  catch (error) {
    throw new Error(`[MazPhoneNumberInput](getResultsFromPhoneNumber) ${error}`)
  }
}

async function getPhoneNumberExamplesFile() {
  const { default: data } = await import('libphonenumber-js/examples.mobile.json')

  return data
}

function getPhoneNumberExample(examples: Examples, countryCode?: CountryCode | undefined | null) {
  try {
    if (!examples) {
      return
    }

    return countryCode ? getExampleNumber(countryCode, examples)?.formatNational() : undefined
  }
  catch (error) {
    console.error(`[maz-ui](MazPhoneNumberInput) ${error}`)
  }
}

function getAsYouTypeFormat(countryCode?: CountryCode | undefined | null, phoneNumber?: string | undefined | null): string | undefined {
  try {
    if (!phoneNumber || !countryCode) {
      return
    }

    const asYouTypeInstance = new AsYouType(countryCode)

    return asYouTypeInstance.input(phoneNumber)
  }
  catch (error) {
    throw new Error(`[MazPhoneNumberInput](getAsYouTypeFormat) ${error}`)
  }
}

export function useLibphonenumber() {
  function isSameCountryCallingCode(countryCode: CountryCode, countryCode2: CountryCode) {
    return getCountryCallingCode(countryCode) === getCountryCallingCode(countryCode2)
  }

  return {
    getAsYouTypeFormat,
    getPhoneNumberResults,
    getPhoneNumberExamplesFile,
    getPhoneNumberExample,
    isSameCountryCallingCode,
    isCountryAvailable,
    getCountries,
    getCountryCallingCode,
  }
}
