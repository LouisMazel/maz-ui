import { canHover, createSmoother, ensurePositioned, injectStyles, isMotionReduced } from '@/utils/effects.ts'
import { stubMedia } from '../../helpers/media.ts'

describe('given the effects helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.className = ''
  })

  describe('when the motion is checked', () => {
    it('then the preference of the user is used by default', () => {
      stubMedia({ reduced: true })

      expect(isMotionReduced()).toBe(true)
    })

    it('then the class m-motion-reduced wins over the preference', () => {
      stubMedia({ reduced: false })
      document.documentElement.classList.add('m-motion-reduced')

      expect(isMotionReduced()).toBe(true)
    })

    it('then the class m-motion-full wins over the preference', () => {
      stubMedia({ reduced: true })
      document.documentElement.classList.add('m-motion-full')

      expect(isMotionReduced()).toBe(false)
    })

    it('then the motion is not reduced when matchMedia does not exist', () => {
      vi.stubGlobal('matchMedia', undefined)

      expect(isMotionReduced()).toBe(false)
      expect(canHover()).toBe(false)
    })
  })

  describe('when the pointer is checked', () => {
    it('then a precise hovering pointer can hover', () => {
      stubMedia({ hover: true })

      expect(canHover()).toBe(true)
    })

    it('then a touch screen cannot hover', () => {
      stubMedia({ hover: false })

      expect(canHover()).toBe(false)
    })
  })

  describe('when styles are injected twice with the same key', () => {
    it('then one adopted stylesheet is added', () => {
      const before = document.adoptedStyleSheets.length

      injectStyles('effects-test', '.a{color:red}')
      injectStyles('effects-test', '.a{color:red}')

      expect(document.adoptedStyleSheets).toHaveLength(before + 1)
    })

    it('then a style element is used when adopted stylesheets fail', () => {
      vi.stubGlobal('CSSStyleSheet', class {
        replaceSync() {
          throw new Error('unsupported')
        }
      })

      injectStyles('effects-fallback', '.b{color:red}')

      expect(document.head.querySelectorAll('style[data-maz-styles="effects-fallback"]')).toHaveLength(1)
    })
  })

  describe('when an element is made a positioning context', () => {
    it('then a static element becomes relative and is restored', () => {
      const element = document.createElement('div')
      document.body.append(element)

      const restore = ensurePositioned(element)

      expect(element.style.position).toBe('relative')

      restore()

      expect(element.style.position).toBe('')
      element.remove()
    })

    it('then a positioned element is left alone', () => {
      const element = document.createElement('div')
      element.style.position = 'absolute'
      document.body.append(element)

      ensurePositioned(element)()

      expect(element.style.position).toBe('absolute')
      element.remove()
    })
  })

  describe('given a smoother', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('when a target is set', () => {
      it('then the values reach it, then the loop stops', () => {
        const apply = vi.fn()
        const smoother = createSmoother(apply, { damping: 0.5, epsilon: 0.01 })

        smoother.set([10, -10])

        expect(smoother.running).toBe(true)

        vi.advanceTimersByTime(1000)

        expect(apply).toHaveBeenLastCalledWith([10, -10])
        expect(smoother.running).toBe(false)
      })

      it('then a second target does not start a second loop', () => {
        const apply = vi.fn()
        const smoother = createSmoother(apply)

        smoother.set([1])
        smoother.set([2])
        vi.advanceTimersByTime(16)

        expect(apply).toHaveBeenCalledTimes(1)
        smoother.stop()
      })
    })

    describe('when it is stopped or reset', () => {
      it('then nothing runs anymore and the values start again from zero', () => {
        const apply = vi.fn()
        const smoother = createSmoother(apply, { damping: 1 })

        smoother.set([5])
        smoother.stop()
        smoother.stop()
        vi.advanceTimersByTime(100)

        expect(apply).not.toHaveBeenCalled()

        smoother.set([5])
        vi.advanceTimersByTime(16)
        smoother.reset()
        smoother.set([3])
        vi.advanceTimersByTime(16)

        expect(apply).toHaveBeenLastCalledWith([3])
      })
    })
  })
})
