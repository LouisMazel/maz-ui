import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'
import { countriesIso } from './../constantes/js/phoneCodeCountries.js'

export const browserLocale = () => {
  if (typeof window === 'undefined') return null
  const browserLocale = window.navigator.userLanguage || window.navigator.language
  let locale = browserLocale ? browserLocale.substr(3, 4).toUpperCase() : null
  if (locale === '') locale = browserLocale.substr(0, 2).toUpperCase()
  // fallback to US country
  if (locale === 'EN') locale = 'US'
  if (locale === 'JA') locale = 'JP'
  return locale
}

export const isCountryAvailable = async (locale) => {
  try {
    if (countriesIso.includes(locale)) return true
    throw `MazPhoneNumberInput: The country ${locale} is not available`
  } catch (e) {
    throw new Error(e)
  }
}

export const getResultsFromPhoneNumber = (phoneNumber, countryCode) => {
  const parsing = phoneNumber ? parsePhoneNumberFromString(phoneNumber, countryCode) : null

  let results = {
    countryCode,
    isValid: false
  }

  if (parsing) {
    results = {
      ...results,
      countryCode: parsing.country,
      countryCallingCode: parsing.countryCallingCode,
      nationalNumber: parsing.nationalNumber,
      isValid: parsing.isValid(),
      type: parsing.getType(),
      formatInternational: parsing.formatInternational(),
      formatNational: parsing.formatNational(),
      uri: parsing.getURI(),
      e164: parsing.format('E.164')
    }
  }

  return results
}

export const getAsYouTypeFormat = (phoneNumber, countryCode) => {
  if (!phoneNumber) return null
  return countryCode
    ? new AsYouType(countryCode).input(phoneNumber)
    : phoneNumber
}


export const fetchCountryCode = async () => {
  try {
    const response  = await fetch('https://ip2c.org/s')
    const responseText = await response.text()
    const result = (responseText || '').toString()
    if (result && result[0] === '1') return result.substr(2, 2)
  } catch (err) {
    return new Error('[MazPhoneNumberInput] Error while fetching country code')
  }
}