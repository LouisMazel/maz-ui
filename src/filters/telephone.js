import {
  parsePhoneNumberFromString
} from 'libphonenumber-js'

export default (telephone) => {
  if (typeof telephone === 'undefined') throw new Error('The `telephone` attribute is required.')

  const parsedPhone = parsePhoneNumberFromString(telephone)
  return parsedPhone
    ? parsedPhone.formatInternational()
    : telephone
}
