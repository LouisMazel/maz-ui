import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) {
    throw new TypeError('[maz-ui](formatPhoneNumber) The `phoneNumber` argument is required.')
  }

  const parsedPhone = parsePhoneNumberFromString(phoneNumber)
  return parsedPhone ? parsedPhone.formatInternational() : phoneNumber
}
