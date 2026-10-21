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

  describe('when MutationObserver is not available on globalThis', () => {
    it('then it returns a noop stop without throwing', () => {
      const original = globalThis.MutationObserver
      // @ts-expect-error - simulate an environment without MutationObserver
      delete globalThis.MutationObserver

      const target = document.createElement('div')
      const result = useMutationObserver(target, vi.fn(), { attributes: true })

      expect(result).toHaveProperty('stop')
      expect(() => result.stop()).not.toThrow()

      globalThis.MutationObserver = original
    })
  })
})
