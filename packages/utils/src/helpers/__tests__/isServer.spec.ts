import { isServer } from '../isServer'

describe('given isServer function', () => {
  describe('when running in jsdom environment', () => {
    it('then it should return false since document and window are defined', () => {
      expect(isServer()).toBe(false)
    })
  })
})
