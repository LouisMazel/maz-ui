import { telephone } from '@filters/telephone'
import { it } from 'vitest'

it('should format a telephone number', () => {
  expect(telephone('+15551234567')).toEqual('+1 555 123 4567')
})

it('should return the original input if it is not a valid telephone number', () => {
  expect(telephone('123')).toEqual('123')
})

it('should throw an error if the input is falsy', () => {
  expect(() => telephone(null)).toThrowError(TypeError)
  expect(() => telephone(undefined)).toThrowError(TypeError)
  expect(() => telephone('')).toThrowError(TypeError)
})
