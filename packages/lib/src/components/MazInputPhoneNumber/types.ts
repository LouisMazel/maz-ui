import type { CountryCallingCode, CountryCode, NationalNumber, NumberType } from 'libphonenumber-js'

export interface Results {
  isValid: boolean
  isPossible?: boolean
  countryCode?: CountryCode | undefined | null
  parsedCountryCode?: CountryCode | undefined | null
  countryCallingCode?: CountryCallingCode
  nationalNumber?: NationalNumber
  type?: NumberType
  formatInternational?: string
  formatNational?: string
  uri?: string
  e164?: string
  rfc3966?: string
  possibleCountries?: CountryCode[]
  phoneNumber?: string | undefined | null
}

export interface Country {
  name: string
  code: CountryCode
  dialCode: CountryCallingCode
}
