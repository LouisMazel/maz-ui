import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const telephone = (telephone: string): string => {
  if (!telephone) {
    throw new TypeError('The `telephone` attribute is required.')
  }

  const parsedPhone = parsePhoneNumberFromString(telephone)
  return parsedPhone ? parsedPhone.formatInternational() : telephone
}
