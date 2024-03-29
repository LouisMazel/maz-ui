import { type CountryCode } from 'libphonenumber-js'
import { type ComponentPublicInstance, reactive, ref } from 'vue'
import { type IpWhoResponse, type Results } from './types'
import { useLibphonenumber } from './use-libphonenumber'

const { isCountryAvailable, getPhoneNumberResults, getAsYouTypeFormat } = useLibphonenumber()

const phoneNumber = ref<string>('')
const selectedCountry = ref<CountryCode>()

const selectionRange = reactive<{
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

  /**
   * OLD WAY
   */
  // const PHONE_CHAR_REGEX = new RegExp(/^[\d ().-]+$/)
  // const NON_ALPHA_REGEX = new RegExp(/^[^a-z]+$/i)
  // const hasNonAlpha = NON_ALPHA_REGEX.test(input)
  // const hasPhoneChar = PHONE_CHAR_REGEX.test(input)

  // if (!hasNonAlpha && !hasPhoneChar) {
  //   return input.replaceAll(/[^\d.]/g, '')
  // }

  const regex = new RegExp(/[^\d ()+-]/g) // Keep only digits, (), - and + characters
  // const regex = new RegExp(/\D/g) // Keep only digits

  return input.replaceAll(regex, '') // Keep only digits, (), - and + characters
}

function saveCursorPosition(PhoneInputRef: ComponentPublicInstance, currentPhoneNumber?: string) {
  const input = PhoneInputRef?.$el.querySelector('input') as HTMLInputElement | undefined
  selectionRange.start = input?.selectionStart
  selectionRange.end = input?.selectionEnd
  selectionRange.cursorAtEnd =
    currentPhoneNumber && typeof selectionRange.start === 'number' && currentPhoneNumber.length > 0
      ? selectionRange.start >= currentPhoneNumber.length
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
  } else if (selectionRange.cursorAtEnd && !noFormattingAsYouType) {
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
  }
}
