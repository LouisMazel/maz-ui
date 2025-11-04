import { upperFirst } from '../upperFirst'

describe('upperFirst', () => {
  it('should capitalize the first letter of a string', () => {
    expect(upperFirst('hello')).toBe('Hello')
    expect(upperFirst('world')).toBe('World')
  })

  it('should handle empty strings', () => {
    expect(upperFirst('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(upperFirst('a')).toBe('A')
    expect(upperFirst('z')).toBe('Z')
  })

  it('should handle strings with numbers and special characters', () => {
    expect(upperFirst('123abc')).toBe('123abc')
    expect(upperFirst('!hello')).toBe('!hello')
  })
})
