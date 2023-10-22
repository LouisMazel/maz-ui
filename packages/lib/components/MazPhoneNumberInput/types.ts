import type { CountryCallingCode, CountryCode, NationalNumber, NumberType } from 'libphonenumber-js'

import { type defaultLocales } from './default-locales'

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

export type Translations = typeof defaultLocales

export type Country = {
  iso2: CountryCode
  dialCode: CountryCallingCode
  name: string
}

export interface IpWhoResponse {
  ip: string
  success: true
  type?: string
  continent?: string
  continent_code?: string
  country?: string
  country_code?: string
  region?: string
  region_code?: string
  city?: string
  latitude?: number
  longitude?: number
  is_eu: true
  postal?: string
  calling_code?: string
  capital?: string
  borders?: string
  flag: {
    img?: string
    emoji?: string
    emoji_unicode?: string
  }
  connection: {
    asn?: number
    org?: string
    isp?: string
    domain?: string
  }
  timezone: {
    id?: string
    abbr?: string
    is_dst: false
    offset?: number
    utc?: string
    current_time?: string
  }
}
