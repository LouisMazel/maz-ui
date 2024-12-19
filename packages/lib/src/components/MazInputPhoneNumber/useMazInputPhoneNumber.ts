import type { Country, IpWhoResponse } from './types'
import { type CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js'

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
  if (customCountriesNameListByIsoCode?.[code]) {
    return customCountriesNameListByIsoCode[code]
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

async function fetchCountryCode() {
  try {
    const reponse = await fetch('https://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  }
  catch (error) {
    throw new Error(`[MazInputPhoneNumber](fetchCountryCode) ${error}`)
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
