import type { CountryCode } from 'libphonenumber-js'
import type { Country } from './types'
import { fetchLocaleIp } from '@maz-ui/utils/src/utils/fetchLocaleIp.js'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

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

let displayNamesInstance: Intl.DisplayNames | undefined
let displayNamesLocale: string | undefined

function getCountryName(
  locale: string,
  code: CountryCode | string,
  customCountriesNameListByIsoCode?: Record<CountryCode, string>,
): string | undefined {
  if (customCountriesNameListByIsoCode?.[code as CountryCode]) {
    return customCountriesNameListByIsoCode[code as CountryCode]
  }

  if (displayNamesLocale !== locale || !displayNamesInstance) {
    displayNamesLocale = locale
    displayNamesInstance = new Intl.DisplayNames([locale], { type: 'region' })
  }

  return displayNamesInstance.of(code)
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
      }
      catch (error) {
        console.error(`[MazInputPhoneNumber](getCountryCallingCode) ${error}`)
      }
    }
  }

  return countriesList
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

function sanitizePhoneNumber(input?: string | undefined | null) {
  if (!input) {
    return ''
  }
  const regex = new RegExp(/[^\d ()+-]/g) // Keep only digits, (), - and + characters

  return input.replaceAll(regex, '').trim()
}

export function useMazInputPhoneNumber() {
  return {
    sanitizePhoneNumber,
    fetchCountryCode,
    getBrowserLocale,
    getCountriesList,
  }
}
