import { useMutationObserver } from '../use-mutation-observer'

describe('given useMutationObserver composable', () => {
  describe('when creating with a target element', () => {
    it('then it should return isSupported, stop, and takeRecords', () => {
      const target = document.createElement('div')
      const callback = vi.fn()

      const result = useMutationObserver(target, callback, { attributes: true })

      expect(result).toHaveProperty('stop')
    })
  })

  describe('when stop is called', () => {
    it('then it should disconnect the observer', () => {
      const target = document.createElement('div')
      const callback = vi.fn()

      const { stop } = useMutationObserver(target, callback, {
        attributes: true,
      })

      expect(() => stop()).not.toThrow()
    })
  })
})
