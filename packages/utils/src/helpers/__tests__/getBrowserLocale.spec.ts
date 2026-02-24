import { getBrowserLocale } from '../getBrowserLocale'

describe('given getBrowserLocale function', () => {
  describe('when running in browser environment', () => {
    it('then it should return the navigator language', () => {
      const result = getBrowserLocale()
      expect(typeof result).toBe('string')
      expect(result).toBe(globalThis.navigator.language)
    })
  })
})
