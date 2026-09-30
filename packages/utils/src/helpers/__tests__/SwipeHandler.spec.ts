import type { SwipeOptions } from '../swipeHandler'
import { Swipe } from '../swipeHandler'

function createPointerEvent(type: string, init: { clientX?: number, clientY?: number, cancelable?: boolean, pointerType?: string } = {}) {
  const event = new MouseEvent(type, { clientX: init.clientX, clientY: init.clientY, cancelable: init.cancelable })
  if (init.pointerType !== undefined) {
    Object.defineProperty(event, 'pointerType', { value: init.pointerType, configurable: true })
  }
  return event
}

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
    it('then it accepts an HTMLElement', () => {
      const swipe = new Swipe(defaultOptions)
      expect(swipe.element).toBe(mockElement)
    })

    it('then it accepts a string selector', () => {
      const mockQuerySelector = vi.spyOn(document, 'querySelector').mockReturnValue(mockElement)
      const swipe = new Swipe({ element: '#test' })
      expect(mockQuerySelector).toHaveBeenCalledWith('#test')
      expect(swipe.element).toBe(mockElement)
    })

    it('then it logs an error if string selector is not found', () => {
      vi.spyOn(document, 'querySelector').mockReturnValue(null)
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      /* eslint-disable sonarjs/no-unused-vars, ts/ban-ts-comment */
      // @ts-expect-error
      const _swipe = new Swipe({ element: '#test' })
      /* eslint-enable sonarjs/no-unused-vars, ts/ban-ts-comment */
      expect(spy).toHaveBeenCalledWith('[maz-ui][SwipeHandler](setElement) String selector for element is not found')
    })

    it('then it starts immediately when immediate option is true', () => {
      /* eslint-disable sonarjs/no-unused-vars, ts/ban-ts-comment */
      // @ts-expect-error
      const _swipe = new Swipe({ ...defaultOptions, immediate: true })
      /* eslint-enable sonarjs/no-unused-vars, ts/ban-ts-comment */
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), { passive: true })
    })
  })

  describe('when calling start method', () => {
    it('then it adds the pointer event listeners', () => {
      const swipe = new Swipe(defaultOptions)
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function), { passive: true })
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), { passive: true })
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function), { passive: true })
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function), { passive: true })
    })

    it('then it adds a non-passive pointermove listener when preventDefaultOnMove is true', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMove: true })
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function), { passive: false })
    })

    it('then it adds a mousewheel listener when preventDefaultOnMouseWheel is true', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMouseWheel: true })
      swipe.start()
      expect(mockElement.addEventListener).toHaveBeenCalledWith('mousewheel', expect.any(Function), { passive: false })
    })
  })

  describe('when calling stop method', () => {
    it('then it removes the pointer event listeners', () => {
      const swipe = new Swipe(defaultOptions)
      swipe.start()
      swipe.stop()
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function))
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('pointercancel', expect.any(Function))
    })
  })

  describe('when handling pointer events', () => {
    let swipe: Swipe

    beforeEach(() => {
      swipe = new Swipe(defaultOptions)
    })

    it('then it updates the start values on pointer down', () => {
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20 }))
      expect(swipe.xStart).toBe(10)
      expect(swipe.yStart).toBe(20)
    })

    it('then it updates the end values and diffs on pointer move', () => {
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 40, clientY: 35 }))
      expect(swipe.xEnd).toBe(40)
      expect(swipe.yEnd).toBe(35)
      expect(swipe.xDiff).toBe(-30)
      expect(swipe.yDiff).toBe(-15)
    })

    it('then it calls onValuesChanged when values change', () => {
      const onValuesChanged = vi.fn()
      swipe = new Swipe({ ...defaultOptions, onValuesChanged })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 12, clientY: 22 }))
      expect(onValuesChanged).toHaveBeenCalled()
    })

    it('then it does not trigger callbacks when movement is below threshold', () => {
      const onRight = vi.fn()
      swipe = new Swipe({ ...defaultOptions, onRight, threshold: 150 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 100, clientY: 50 }))
      expect(onRight).not.toHaveBeenCalled()
    })
  })

  describe('when handling directional swipes', () => {
    it('then it calls onLeft for a left swipe', () => {
      const onLeft = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onLeft, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 50, clientY: 100 }))
      expect(onLeft).toHaveBeenCalled()
    })

    it('then it calls onRight for a right swipe', () => {
      const onRight = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onRight, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 50, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 200, clientY: 100 }))
      expect(onRight).toHaveBeenCalled()
    })

    it('then it calls onUp for an up swipe', () => {
      const onUp = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onUp, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 100, clientY: 200 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 100, clientY: 50 }))
      expect(onUp).toHaveBeenCalled()
    })

    it('then it calls onDown for a down swipe', () => {
      const onDown = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onDown, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 100, clientY: 50 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 100, clientY: 200 }))
      expect(onDown).toHaveBeenCalled()
    })
  })

  describe('when preventDefaultOnMove is true', () => {
    it('then it prevents default on a cancelable pointer move', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMove: true })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 0, clientY: 0 }))
      const pointerMove = createPointerEvent('pointermove', { clientX: 100, clientY: 0, cancelable: true })
      const preventSpy = vi.spyOn(pointerMove, 'preventDefault')
      mockElement.dispatchEvent(pointerMove)
      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('when a disallowed pointer type is used', () => {
    it('then it ignores the gesture', () => {
      const onLeft = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onLeft, threshold: 10, pointerTypes: ['touch'] })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200, clientY: 100, pointerType: 'mouse' }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 50, clientY: 100, pointerType: 'mouse' }))
      expect(onLeft).not.toHaveBeenCalled()
      expect(swipe.xStart).toBeUndefined()
    })
  })

  describe('when mousewheel event occurs with preventDefaultOnMouseWheel', () => {
    it('then it prevents default on the event', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMouseWheel: true })
      swipe.start()
      const event = new Event('mousewheel', { cancelable: true })
      const preventSpy = vi.spyOn(event, 'preventDefault')
      mockElement.dispatchEvent(event)
      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('when stop is called with preventDefaultOnMouseWheel', () => {
    it('then it removes the mousewheel listener', () => {
      const swipe = new Swipe({ ...defaultOptions, preventDefaultOnMouseWheel: true })
      swipe.start()
      swipe.stop()
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('mousewheel', expect.any(Function))
    })
  })

  describe('when no element is provided', () => {
    it('then it logs an error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const swipe = new Swipe({})
      swipe.start()
      expect(spy).toHaveBeenCalledWith(
        '[maz-ui][SwipeHandler](setElement) Element should be provided. Its can be a string selector or an HTMLElement',
      )
    })
  })

  describe('when a pointer move occurs without a prior pointer down', () => {
    it('then it does not compute diffs', () => {
      const swipe = new Swipe(defaultOptions)
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 100, clientY: 50 }))
      expect(swipe.xDiff).toBeUndefined()
      expect(swipe.yDiff).toBeUndefined()
    })
  })

  describe('when a pointer move occurs after the start values were reset by a triggered swipe', () => {
    it('then it skips the diff computation', () => {
      const onLeft = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onLeft, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 50, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 40, clientY: 100 }))
      expect(swipe.xDiff).toBeUndefined()
    })
  })

  describe('when triggerOnEnd is true and the pointer is released without moving', () => {
    it('then it does not call the direction callbacks', () => {
      const onLeft = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onLeft, triggerOnEnd: true, threshold: 10 })
      swipe.start()
      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointerup', { clientX: 200, clientY: 100 }))
      expect(onLeft).not.toHaveBeenCalled()
    })
  })

  describe('when triggerOnEnd is true and swipe distance exceeds threshold', () => {
    it('then it calls the direction callback on pointer up and resets the values', () => {
      const onLeft = vi.fn()
      const onValuesChanged = vi.fn()
      const swipe = new Swipe({ ...defaultOptions, onLeft, onValuesChanged, triggerOnEnd: true, threshold: 10 })
      swipe.start()

      mockElement.dispatchEvent(createPointerEvent('pointerdown', { clientX: 200, clientY: 100 }))
      mockElement.dispatchEvent(createPointerEvent('pointermove', { clientX: 50, clientY: 100 }))

      expect(onLeft).not.toHaveBeenCalled()

      mockElement.dispatchEvent(createPointerEvent('pointerup', { clientX: 50, clientY: 100 }))

      expect(onLeft).toHaveBeenCalled()
      expect(swipe.xStart).toBeUndefined()
    })
  })
})
