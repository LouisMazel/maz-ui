import { useUserVisibility } from '@composables/useUserVisibility'

describe('given useUserVisibility composable', () => {
  describe('when called with callback', () => {
    it('then it should return a UserVisibility instance', () => {
      const callback = vi.fn()
      const userVisibility = useUserVisibility({ callback })

      expect(userVisibility).toBeDefined()
      expect(typeof userVisibility.destroy).toBe('function')
    })
  })

  describe('when called with callback and options', () => {
    it('then it should return a UserVisibility instance with options', () => {
      const callback = vi.fn()
      const options = { immediate: true }

      const userVisibility = useUserVisibility({ callback, options })

      expect(userVisibility).toBeDefined()
      expect(typeof userVisibility.destroy).toBe('function')
    })
  })

  describe('when callback is provided', () => {
    it('then it should pass the callback to UserVisibility constructor', () => {
      const callback = vi.fn()

      const userVisibility = useUserVisibility({ callback })

      expect(userVisibility).toBeDefined()
    })
  })

  describe('when options are provided', () => {
    it('then it should pass options to UserVisibility constructor', () => {
      const callback = vi.fn()
      const options = {
        immediate: true,
        timeout: 5000,
      }

      const userVisibility = useUserVisibility({ callback, options })

      expect(userVisibility).toBeDefined()
    })
  })

  describe('when UserVisibility instance is created', () => {
    it('then it should have destroy method', () => {
      const callback = vi.fn()
      const userVisibility = useUserVisibility({ callback })

      expect(userVisibility.destroy).toBeDefined()
      expect(typeof userVisibility.destroy).toBe('function')
    })
  })

  describe('when destroy method is called', () => {
    it('then it should not throw an error', () => {
      const callback = vi.fn()
      const userVisibility = useUserVisibility({ callback })

      expect(() => {
        userVisibility.destroy()
      }).not.toThrow()
    })
  })

  describe('when called without options', () => {
    it('then it should work with only callback', () => {
      const callback = vi.fn()

      const userVisibility = useUserVisibility({ callback })

      expect(userVisibility).toBeDefined()
      expect(typeof userVisibility.destroy).toBe('function')
    })
  })

  describe('when multiple instances are created', () => {
    it('then each should be independent', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      const userVisibility1 = useUserVisibility({ callback: callback1 })
      const userVisibility2 = useUserVisibility({ callback: callback2 })

      expect(userVisibility1).not.toBe(userVisibility2)
      expect(userVisibility1.destroy).not.toBe(userVisibility2.destroy)
    })
  })
})
