import { getErrorMessage } from '../getErrorMessage'

describe('given getErrorMessage function', () => {
  describe('when called with an Error instance', () => {
    it('then it should return the error message', () => {
      const error = new Error('test error')
      expect(getErrorMessage(error)).toBe('test error')
    })
  })

  describe('when called with a string', () => {
    it('then it should return the string as-is', () => {
      expect(getErrorMessage('string error')).toBe('string error')
    })
  })

  describe('when called with an object having a message property', () => {
    it('then it should return the message as string', () => {
      expect(getErrorMessage({ message: 'object error' })).toBe('object error')
    })

    it('then it should handle non-string message property', () => {
      expect(getErrorMessage({ message: 42 })).toBe('42')
    })
  })

  describe('when called with a truthy non-standard value', () => {
    it('then it should return String representation', () => {
      expect(getErrorMessage(42)).toBe('42')
    })
  })

  describe('when called with a falsy value', () => {
    it('then it should return the default message for null and undefined', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
    })

    it('then it should return empty string for empty string input', () => {
      expect(getErrorMessage('')).toBe('')
    })

    it('then it should return the default message for 0', () => {
      expect(getErrorMessage(0)).toBe('An unexpected error occurred')
    })
  })
})
