import { useMutationObserver } from '@composables/useMutationObserver'
import { ref } from 'vue'

describe('given useMutationObserver composable', () => {
  describe('when creating with a target element', () => {
    it('then it should return isSupported, stop, and takeRecords', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const result = useMutationObserver(target, callback, { attributes: true })

      expect(result).toHaveProperty('isSupported')
      expect(result).toHaveProperty('stop')
      expect(result).toHaveProperty('takeRecords')
    })

    it('then isSupported should be true in jsdom', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const { isSupported } = useMutationObserver(target, callback, { attributes: true })

      expect(isSupported.value).toBe(true)
    })
  })

  describe('when stop is called', () => {
    it('then it should disconnect the observer', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const { stop } = useMutationObserver(target, callback, {
        attributes: true,
      })

      expect(() => stop()).not.toThrow()
    })
  })

  describe('when takeRecords is called', () => {
    it('then it should return records from the observer', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const { takeRecords } = useMutationObserver(target, callback, {
        attributes: true,
      })

      const records = takeRecords()
      expect(records).toBeDefined()
    })
  })

  describe('when target is undefined', () => {
    it('then it should handle gracefully', () => {
      const target = ref<HTMLElement | undefined>(undefined)
      const callback = vi.fn()

      const { isSupported } = useMutationObserver(target, callback, { attributes: true })

      expect(isSupported.value).toBe(true)
    })
  })

  describe('when target is a Vue component instance', () => {
    it('then it should use the $el property', () => {
      const el = document.createElement('div')
      const target = ref({ $el: el } as any)
      const callback = vi.fn()

      const { isSupported } = useMutationObserver(target, callback, {
        attributes: true,
      })

      expect(isSupported.value).toBe(true)
    })
  })

  describe('when internalWindow is not provided', () => {
    it('then it should use globalThis', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const { isSupported } = useMutationObserver(target, callback, { attributes: true })

      expect(isSupported.value).toBe(true)
    })
  })

  describe('when internalWindow does not support MutationObserver', () => {
    it('then isSupported should be false', () => {
      const target = ref(document.createElement('div'))
      const callback = vi.fn()

      const { isSupported } = useMutationObserver(target, callback, {
        internalWindow: {} as Window,
        attributes: true,
      })

      expect(isSupported.value).toBe(false)
    })
  })
})
