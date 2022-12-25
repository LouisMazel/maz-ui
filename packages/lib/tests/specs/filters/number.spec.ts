import { number } from '@package/filters/number'

describe('FilterNumber', () => {
  test('should return the formatted number with default options', () => {
    const result = number(123_456.789, 'en-US', { maximumFractionDigits: 2 })

    expect(result).toBe('123,456.79')
  })

  test('should return the formatted number with custom options', () => {
    const result = number(123_456.789, 'en-US', { minimumFractionDigits: 3 })

    expect(result).toBe('123,456.789')
  })

  test('should throw an error if the `number` argument is not provided', () => {
    expect(() => number(undefined, 'en-US')).toThrow(TypeError)
  })

  test('should throw an error if the `locale` argument is not provided', () => {
    expect(() => number(123_456.789, undefined)).toThrow(TypeError)
  })

  test('should throw an error if the `locale` argument is not a string', () => {
    // @ts-ignore
    expect(() => number(123_456.789, 123)).toThrow(TypeError)
  })
})
