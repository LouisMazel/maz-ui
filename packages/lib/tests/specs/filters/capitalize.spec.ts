import { capitalize } from '@filters/capitalize'

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('returns an empty string if the value is falsy', () => {
    expect(capitalize('')).toBe('')
    // @ts-expect-error - test case
    expect(capitalize(null)).toBe('')
    // @ts-expect-error - test case
    expect(capitalize(undefined)).toBe('')
  })

  it('returns a capitalized string if the value is a number', () => {
    // @ts-expect-error - test case
    expect(capitalize(1)).toBe('1')
    // @ts-expect-error - test case
    expect(capitalize(123)).toBe('123')
  })
})
