import { runViewTransition } from '../view-transition'

describe('given runViewTransition', () => {
  describe('when document.startViewTransition is available', () => {
    beforeEach(() => {
      vi.stubGlobal('document', {
        startViewTransition: vi.fn((cb: () => void) => {
          cb()
          return { finished: Promise.resolve() }
        }),
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('then it wraps the callback inside startViewTransition', async () => {
      const callback = vi.fn()
      await runViewTransition(callback)

      expect((globalThis as any).document.startViewTransition).toHaveBeenCalledOnce()
      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('when document.startViewTransition is missing', () => {
    beforeEach(() => {
      vi.stubGlobal('document', {})
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('then it executes the callback synchronously as a fallback', async () => {
      const callback = vi.fn()
      await runViewTransition(callback)

      expect(callback).toHaveBeenCalledOnce()
    })
  })

  describe('when document is undefined (SSR)', () => {
    beforeEach(() => {
      vi.stubGlobal('document', undefined)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('then it executes the callback synchronously', async () => {
      const callback = vi.fn()
      await runViewTransition(callback)

      expect(callback).toHaveBeenCalledOnce()
    })
  })
})
