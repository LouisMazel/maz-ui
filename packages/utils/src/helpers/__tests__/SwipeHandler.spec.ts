import type { SwipeOptions } from '../swipeHandler'
import { Swipe } from '../swipeHandler'

describe('given Swipe class', () => {
  let mockElement: HTMLElement
  let defaultOptions: SwipeOptions

  beforeEach(() => {
    mockElement = document.createElement('div')
    defaultOptions = {
      element: mockElement,
    }

    vi.spyOn(mockElement, 'addEventListener')
    vi.spyOn(mockElement, 'removeEventListener')
  })

  describe('when creating a new instance', () => {
    it('then it should accept an HTMLElement', () => {
      const swipe = new Swipe(defaultOptions)
      expect(swipe.element).toBe(mockElement)
    })

    it('then it should accept a string selector', () => {
      const mockQuerySelector = vi.spyOn(document, 'querySelector').mockReturnValue(mockElement)
      const swipe = new Swipe({ element: '#test' })
      expect(mockQuerySelector).toHaveBeenCalledWith('#test')
      expect(swipe.element).toBe(mockElement)
    })

    it('then it should throw an error if string selector is not found', () => {
      vi.spyOn(document, 'querySelector').mockReturnValue(null)
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      /* eslint-disable sonarjs/no-unused-vars, ts/ban-ts-comment */
      // @ts-expect-error
      const _swipe = new Swipe({ element: '#test' })
      /* eslint-enable sonarjs/no-unused-vars, ts/ban-ts-comment */
      expect(spy).toHaveBeenCalledWith('[maz-ui][SwipeHandler](setElement) String selector for element is not found')
    })

    it('then it should start immediately if immediate option is true', () => {
      /* eslint-disable sonarjs/no-unused-vars, ts/ban-ts-comment */
      // @ts-expect-error
      const _swipe = new Swipe({ ...defaultOptions, immediate: true })
      /* eslint-enable sonarjs/no-unused-vars, ts/ban-ts-comment */
      expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true })
    })
  })

  describe('when calling start method', () => {
    it('then it should add event listeners', () => {
      const swipe = new Swipe(defaultOptions)
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true })
      expect(mockElement.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: true })
    })

    it('then it should add touchend listener if triggerOnEnd is true', () => {
      const swipe = new Swipe({ ...defaultOptions, triggerOnEnd: true })
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: true })
    })

    it('then it should add mousewheel listener if preventDefaultOnMouseWheel is true', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMouseWheel: true })
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mousewheel', expect.any(Function), { passive: false })
    })
  })

  describe('when calling stop method', () => {
    it('then it should remove event listeners', () => {
      const swipe = new Swipe(defaultOptions)
      swipe.start()
      swipe.stop()
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function))
    })
  })

  describe('when handling touch events', () => {
    let swipe: Swipe
    let mockTouchStart: TouchEvent
    let mockTouchMove: TouchEvent
    let mockTouchEnd: TouchEvent

    beforeEach(() => {
      swipe = new Swipe(defaultOptions)
      mockTouchStart = new TouchEvent('touchstart', { touches: [{ clientX: 0, clientY: 0 }] as unknown as Touch[] })
      mockTouchMove = new TouchEvent('touchmove', { touches: [{ clientX: 100, clientY: 50 }] as unknown as Touch[] })
      mockTouchEnd = new TouchEvent('touchend')
    })

    it('then it should update values on touchstart', () => {
      swipe.start()
      mockElement.dispatchEvent(mockTouchStart)
      expect(swipe.xStart).toBe(0)
      expect(swipe.yStart).toBe(0)
    })

    it('then it should update values on touchmove', () => {
      swipe.start()
      mockElement.dispatchEvent(mockTouchStart)
      mockElement.dispatchEvent(mockTouchMove)
      expect(swipe.xEnd).toBe(100)
      expect(swipe.yEnd).toBe(50)
      expect(swipe.xDiff).toBe(undefined)
      expect(swipe.yDiff).toBe(undefined)
    })

    it('then it should call onValuesChanged callback when values change', () => {
      const onValuesChanged = vi.fn()
      swipe = new Swipe({ ...defaultOptions, onValuesChanged })
      swipe.start()
      mockElement.dispatchEvent(mockTouchStart)
      mockElement.dispatchEvent(mockTouchMove)
      mockElement.dispatchEvent(mockTouchMove)
      expect(onValuesChanged).toHaveBeenCalledTimes(1)
    })

    it('then it should not trigger callbacks if movement is below threshold', () => {
      const onRight = vi.fn()
      swipe = new Swipe({ ...defaultOptions, onRight, threshold: 150 })
      swipe.start()
      mockElement.dispatchEvent(mockTouchStart)
      mockElement.dispatchEvent(mockTouchMove)
      expect(onRight).not.toHaveBeenCalled()
    })

    it('then it should reset values after touch end', () => {
      swipe = new Swipe({ ...defaultOptions, triggerOnEnd: true })
      swipe.start()
      mockElement.dispatchEvent(mockTouchStart)
      mockElement.dispatchEvent(mockTouchMove)
      mockElement.dispatchEvent(mockTouchEnd)
      expect(swipe.xStart).toBe(0)
      expect(swipe.yStart).toBe(0)
      expect(swipe.xEnd).toBe(100)
      expect(swipe.yEnd).toBe(50)
      expect(swipe.xDiff).toBe(undefined)
      expect(swipe.yDiff).toBe(undefined)
    })
  })
})
