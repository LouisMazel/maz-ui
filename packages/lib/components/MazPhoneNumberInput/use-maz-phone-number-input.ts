import { getCountryCallingCode, type CountryCode, getCountries } from 'libphonenumber-js'
import { type ComponentPublicInstance, ref } from 'vue'
import { type Country, type IpWhoResponse, type Results } from './types'
import { useLibphonenumber } from './use-libphonenumber'

const { isCountryAvailable, getPhoneNumberResults, getAsYouTypeFormat } = useLibphonenumber()

const phoneNumber = ref<string>('')
const selectedCountry = ref<CountryCode>()

const selectionRange = ref<{
  start?: number | null
  end?: number | null
  cursorAtEnd?: boolean
}>({
  start: 0,
  end: 0,
  cursorAtEnd: true,
})

const results = ref<Results>({
  isValid: false,
  countryCode: undefined,
})

async function fetchCountryCode() {
  try {
    const reponse = await fetch('https://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  } catch (error) {
    throw new Error(`[MazPhoneNumberInput](fetchCountryCode) ${error}`)
  }
}

function sanitizePhoneNumber(input?: string) {
  if (!input) {
    return ''
  }
  const regex = new RegExp(/[^\d ()+-]/g) // Keep only digits, (), - and + characters

  return input.replaceAll(regex, '').trim() // Keep only digits, (), - and + characters
}

function saveCursorPosition(PhoneInputRef: ComponentPublicInstance, currentPhoneNumber?: string) {
  const input = PhoneInputRef?.$el.querySelector('input') as HTMLInputElement | undefined
  selectionRange.value.start = input?.selectionStart
  selectionRange.value.end = input?.selectionEnd
  selectionRange.value.cursorAtEnd =
    currentPhoneNumber &&
    typeof selectionRange.value.start === 'number' &&
    currentPhoneNumber.length > 0
      ? selectionRange.value.start >= currentPhoneNumber.length
      : true
}

function setSelectedCountry(countryCode?: string) {
  if (!countryCode) {
    return
  }

  if (!isCountryAvailable(countryCode)) {
    selectedCountry.value = undefined
    return
  }

  selectedCountry.value = countryCode as CountryCode
}

function onPhoneNumberChanged({
  newPhoneNumber,
  autoFormat,
  noFormattingAsYouType,
  updateResults = true,
}: {
  newPhoneNumber: string
  autoFormat: boolean
  noFormattingAsYouType: boolean
  updateResults?: boolean
}) {
  const sanitizedPhoneNumber = sanitizePhoneNumber(newPhoneNumber)

  if (updateResults) {
    results.value = getPhoneNumberResults({
      phoneNumber: sanitizedPhoneNumber,
      countryCode: selectedCountry.value,
    })
  }

  if (results.value.isValid && results.value.formatNational && autoFormat) {
    phoneNumber.value = results.value.formatNational
  } else if (selectionRange.value.cursorAtEnd && !noFormattingAsYouType) {
    const asYouTypeFormatted = getAsYouTypeFormat(selectedCountry.value, sanitizedPhoneNumber)
    phoneNumber.value = asYouTypeFormatted
  } else {
    phoneNumber.value = sanitizedPhoneNumber
  }

  if (results.value.countryCode && results.value.countryCode !== selectedCountry.value) {
    onCountryChanged({
      countryCode: results.value.countryCode,
      autoFormat,
      noFormattingAsYouType,
      updateResults: false,
    })
  }
}

function onCountryChanged({
  countryCode,
  autoFormat,
  noFormattingAsYouType,
  updateResults = true,
}: {
  countryCode?: CountryCode
  autoFormat: boolean
  noFormattingAsYouType: boolean
  updateResults?: boolean
}) {
  if (!countryCode) {
    selectedCountry.value = undefined
    return
  }

  if (countryCode !== selectedCountry.value) {
    setSelectedCountry(countryCode)
  }

  if (updateResults) {
    results.value = getPhoneNumberResults({
      phoneNumber: phoneNumber.value,
      countryCode,
    })
  }

  onPhoneNumberChanged({
    newPhoneNumber: phoneNumber.value,
    autoFormat,
    noFormattingAsYouType,
    updateResults: false,
  })
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

export function useMazPhoneNumberInput() {
  return {
    setSelectedCountry,
    results,
    sanitizePhoneNumber,
    fetchCountryCode,
    selectedCountry,
    phoneNumber,
    selectionRange,
    saveCursorPosition,
    onPhoneNumberChanged,
    onCountryChanged,
    getBrowserLocale,
    getCountriesList,
  }
}
