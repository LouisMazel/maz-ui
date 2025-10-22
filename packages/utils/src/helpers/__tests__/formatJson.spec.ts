import { formatJson } from '../formatJson'

describe('formatJson', () => {
  it('capitalizes the first letter of a string', () => {
    expect(formatJson({ a: 1, b: 2 })).toBe('{\n  "a": 1,\n  "b": 2\n}')
    expect(formatJson({ a: 1, b: 2 }, 4)).toBe('{\n    "a": 1,\n    "b": 2\n}')
  })

  it('returns an empty string if the value is falsy', () => {
    expect(formatJson(null)).toBe('null')
    expect(formatJson(undefined)).toBe(undefined)
  })
})
