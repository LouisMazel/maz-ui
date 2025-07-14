import { isEqual } from '../isEqual'

describe('given isEqual function', () => {
  describe('when comparing primitive values', () => {
    it('then it should return true for equal values', () => {
      expect(isEqual(5, 5)).toBe(true)
      expect(isEqual('test', 'test')).toBe(true)
      expect(isEqual(true, true)).toBe(true)
      expect(isEqual(null, null)).toBe(true)

      expect(isEqual(undefined, undefined)).toBe(true)
    })

    it('then it should return false for different values', () => {
      expect(isEqual(5, 6)).toBe(false)
      expect(isEqual('test', 'test2')).toBe(false)
      expect(isEqual(true, false)).toBe(false)

      expect(isEqual(null, undefined)).toBe(false)
    })
  })

  describe('when comparing arrays', () => {
    it('then it should return true for equal arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true)
    })

    it('then it should return false for different arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
      expect(isEqual([1, 2, 3], [1, 2])).toBe(false)
      expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false)
    })
  })

  describe('when comparing objects', () => {
    it('then it should return true for equal objects', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true)
    })

    it('then it should return false for different objects', () => {
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
      expect(isEqual({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false)
      expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false)
    })
  })

  describe('when comparing Date types', () => {
    it('then it should return true for equal dates', () => {
      const date = new Date()
      expect(isEqual(date, date)).toBe(true)
      expect(isEqual(new Date('2021-01-02'), new Date('2021-01-02'))).toBe(true)
    })

    it('then it should return false', () => {
      expect(isEqual(new Date('2021-01-01'), new Date('2021-01-02'))).toBe(false)
    })
  })

  describe('when comparing Symbol types', () => {
    it('then it should return true for equal symbol', () => {
      const symbol = Symbol('test')
      expect(isEqual(symbol, symbol)).toBe(true)
    })

    it('then it should return false', () => {
      expect(isEqual(Symbol('test'), Symbol('test'))).toBe(false)
    })
  })

  describe('when comparing bigint types', () => {
    it('then it should return true for equal bigint', () => {
      expect(isEqual(BigInt(123), BigInt(123))).toBe(true)
    })

    it('then it should return false', () => {
      expect(isEqual(BigInt(123), BigInt(124))).toBe(false)
    })
  })

  describe('when comparing mixed types', () => {
    it('then it should return false', () => {
      expect(isEqual(5, '5')).toBe(false)
      expect(isEqual([], {})).toBe(false)
      expect(isEqual({ a: 1 }, [1])).toBe(false)
    })
  })
})
