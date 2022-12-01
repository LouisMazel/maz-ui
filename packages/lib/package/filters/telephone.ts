import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const telephone = (telephone: string): string => {
  if (typeof telephone === 'undefined') {
    throw new TypeError('The `telephone` attribute is required.')
  }

  const parsedPhone = parsePhoneNumberFromString(telephone)
  return parsedPhone ? parsedPhone.formatInternational() : telephone
}
