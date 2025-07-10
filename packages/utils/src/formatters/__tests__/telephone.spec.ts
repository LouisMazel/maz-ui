import { it } from 'vitest'
import { formatPhoneNumber } from '../formatPhoneNumber'

it('should format a telephone number', () => {
  expect(formatPhoneNumber('+15551234567')).toEqual('+1 555 123 4567')
})

it('should return the original input if it is not a valid telephone number', () => {
  expect(formatPhoneNumber('123')).toEqual('123')
})

it('should throw an error if the input is falsy', () => {
  // @ts-expect-error - test case
  expect(() => formatPhoneNumber(null)).toThrowError(TypeError)
  // @ts-expect-error - test case
  expect(() => formatPhoneNumber(undefined)).toThrowError(TypeError)
  expect(() => formatPhoneNumber('')).toThrowError(TypeError)
})
