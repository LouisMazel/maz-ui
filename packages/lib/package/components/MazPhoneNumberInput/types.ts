import type {
  CountryCallingCode,
  CountryCode,
  NationalNumber,
  NumberType,
} from 'libphonenumber-js'

import type locales from './constantes/locales'

export type Result = {
  isValid: boolean
  isPossible?: boolean
  countryCode?: CountryCode
  countryCallingCode?: CountryCallingCode
  nationalNumber?: NationalNumber
  type?: NumberType
  formatInternational?: string
  formatNational?: string
  uri?: string
  e164?: string
  rfc3966?: string
}

export type Translations = typeof locales

export type Country = {
  iso2: CountryCode
  dialCode: CountryCallingCode
  name: string
}
