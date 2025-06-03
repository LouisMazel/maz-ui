import { useFreezeValue } from '@composables/useFreezeValue'

import { ref } from 'vue'

describe('given useFreezeValue function', () => {
  describe('when freezing a primitive value', () => {
    it('then it should return the same value', () => {
      expect(useFreezeValue(5)).toBe(5)
      expect(useFreezeValue('test')).toBe('test')
      expect(useFreezeValue(true)).toBe(true)
    })
  })

  describe('when freezing an array', () => {
    it('then it should return a new frozen array with the same values', () => {
      const originalArray = [1, 2, 3]
      const frozenArray = useFreezeValue(originalArray)

      expect(frozenArray).toEqual(originalArray)
      expect(frozenArray).not.toBe(originalArray)
      expect(Object.isFrozen(frozenArray)).toBe(true)
    })
  })

  describe('when freezing an object', () => {
    it('then it should return a new frozen object with the same properties', () => {
      const originalObject = { a: 1, b: 2 }
      const frozenObject = useFreezeValue(originalObject)

      expect(frozenObject).toEqual(originalObject)
      expect(frozenObject).not.toBe(originalObject)
      expect(Object.isFrozen(frozenObject)).toBe(true)
    })
  })

  describe('when freezing a ref', () => {
    it('then it should return the unwrapped value', () => {
      const refValue = ref(10)
      expect(useFreezeValue(refValue)).toBe(10)
    })
  })
})
