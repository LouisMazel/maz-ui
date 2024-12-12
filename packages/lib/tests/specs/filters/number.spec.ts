import { number } from '@filters/number'

describe('filterNumber', () => {
  it('should return the formatted number with default options', () => {
    const result = number(123_456.789, 'en-US', { maximumFractionDigits: 2 })

    expect(result).toBe('123,456.79')
  })

  it('should return the formatted number with custom options', () => {
    const result = number(123_456.789, 'en-US', { minimumFractionDigits: 3 })

    expect(result).toBe('123,456.789')
  })

  it('should throw an error if the `number` argument is not provided', () => {
    // @ts-expect-error - test case
    expect(() => number(undefined, 'en-US')).toThrow(TypeError)
  })

  it('should throw an error if the `locale` argument is not provided', () => {
    // @ts-expect-error - test case
    expect(() => number(123_456.789, undefined)).toThrow(TypeError)
  })

  it('should throw an error if the `locale` argument is not a string', () => {
    // @ts-expect-error - test case
    expect(() => number(123_456.789, 123)).toThrow(TypeError)
  })
})
