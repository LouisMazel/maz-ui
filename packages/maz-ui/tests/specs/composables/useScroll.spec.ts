import { useScroll } from '@composables/useScroll.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'
import { nextTick, ref } from 'vue'

function scrollableElement({ width = 100, height = 100, scrollWidth = 100, scrollHeight = 1000 } = {}) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'clientWidth', { value: width })
  Object.defineProperty(element, 'clientHeight', { value: height })
  Object.defineProperty(element, 'scrollWidth', { value: scrollWidth })
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight })
  element.scrollTo = vi.fn()
  return element
}

function scroll(element: HTMLElement, top: number, left = 0) {
  element.scrollTop = top
  element.scrollLeft = left
  element.dispatchEvent(new Event('scroll'))
  vi.runOnlyPendingTimers()
}

describe('given useScroll', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when the target is an element at the top', () => {
    it('then arrivedState.top is true and the position is 0', async () => {
      const { x, y, arrivedState } = useScroll(scrollableElement())
      await nextTick()

      expect(x.value).toBe(0)
      expect(y.value).toBe(0)
      expect(arrivedState).toEqual({ top: true, bottom: false, left: true, right: true })
    })
  })

  describe('when the element is scrolled down', () => {
    it('then y, the direction and isScrolling are updated and onScroll is called', async () => {
      const element = scrollableElement()
      const onScroll = vi.fn()
      const { y, directions, isScrolling, arrivedState } = useScroll(element, { onScroll, idle: 1000 })
      await nextTick()

      element.scrollTop = 300
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(y.value).toBe(300)
      expect(directions.bottom).toBe(true)
      expect(directions.top).toBe(false)
      expect(isScrolling.value).toBe(true)
      expect(arrivedState.top).toBe(false)
      expect(onScroll).toHaveBeenCalledOnce()
    })
  })

  describe('when the element is scrolled back up', () => {
    it('then directions.top is true', async () => {
      const element = scrollableElement()
      const { directions } = useScroll(element, { idle: 1000 })
      await nextTick()

      element.scrollTop = 300
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()
      element.scrollTop = 100
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(directions.top).toBe(true)
      expect(directions.bottom).toBe(false)
    })
  })

  describe('when several scroll events happen in one frame', () => {
    it('then onScroll is called once', async () => {
      const element = scrollableElement()
      const onScroll = vi.fn()
      useScroll(element, { onScroll })
      await nextTick()

      element.dispatchEvent(new Event('scroll'))
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(onScroll).toHaveBeenCalledOnce()
    })
  })

  describe('when the element reaches the bottom within the offset', () => {
    it('then arrivedState.bottom is true', async () => {
      const element = scrollableElement()
      const { arrivedState } = useScroll(element, { offset: { bottom: 50 } })
      await nextTick()

      scroll(element, 860)

      expect(arrivedState.bottom).toBe(true)
    })
  })

  describe('when the element is scrolled horizontally', () => {
    it('then x, directions.right and arrivedState.right are updated', async () => {
      const element = scrollableElement({ scrollWidth: 500 })
      const { x, directions, arrivedState } = useScroll(element, { offset: 10, idle: 1000 })
      await nextTick()

      element.scrollLeft = 395
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(x.value).toBe(395)
      expect(directions.right).toBe(true)
      expect(arrivedState.right).toBe(true)
      expect(arrivedState.left).toBe(false)
    })
  })

  describe('when the scroll stops for the idle time', () => {
    it('then isScrolling and the directions are reset and onStop is called', async () => {
      const element = scrollableElement()
      const onStop = vi.fn()
      const { isScrolling, directions } = useScroll(element, { idle: 100, onStop })
      await nextTick()

      element.scrollTop = 300
      element.dispatchEvent(new Event('scroll'))
      vi.advanceTimersByTime(100)

      expect(isScrolling.value).toBe(false)
      expect(directions.bottom).toBe(false)
      expect(onStop).toHaveBeenCalledOnce()
    })
  })

  describe('when the target is the window', () => {
    it('then it reads the position of the page', async () => {
      const { y } = useScroll()
      await nextTick()

      window.scrollY = 250
      globalThis.dispatchEvent(new Event('scroll'))
      vi.advanceTimersToNextFrame()

      expect(y.value).toBe(250)
      window.scrollY = 0
    })
  })

  describe('when the target is the document', () => {
    describe('when scrollToTop is called', () => {
      it('then the window scrolls to the top smoothly', async () => {
        const scrollTo = vi.spyOn(globalThis, 'scrollTo').mockImplementation(() => {})
        const { scrollToTop } = useScroll(document)
        await nextTick()

        scrollToTop()

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: undefined, behavior: 'smooth' })
        scrollTo.mockRestore()
      })
    })
  })

  describe('when the target is a component', () => {
    describe('when scrollToBottom is called', () => {
      it('then the element of the component scrolls to its height', async () => {
        const element = scrollableElement()
        const { scrollToBottom } = useScroll(ref({ $el: element } as never))
        await nextTick()

        scrollToBottom('instant')

        expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000, left: undefined, behavior: 'instant' })
      })
    })
  })

  describe('when there is no target', () => {
    it('then scrollTo and scrollToBottom do nothing', async () => {
      const { scrollToBottom, scrollTo, measure } = useScroll(ref(null))
      await nextTick()

      expect(() => {
        scrollToBottom()
        scrollTo({ top: 10 })
        measure()
      }).not.toThrow()
    })
  })

  describe('when the target ref changes', () => {
    it('then the previous element is not listened anymore', async () => {
      const first = scrollableElement()
      const second = scrollableElement()
      const target = ref<HTMLElement>(first)
      const onScroll = vi.fn()
      useScroll(target, { onScroll })
      await nextTick()

      target.value = second
      await nextTick()
      scroll(first, 100)
      scroll(second, 100)

      expect(onScroll).toHaveBeenCalledOnce()
    })
  })

  describe('when stop is called while a frame is pending', () => {
    it('then onScroll is not called', async () => {
      const element = scrollableElement()
      const onScroll = vi.fn()
      const { stop } = useScroll(element, { onScroll })
      await nextTick()

      element.dispatchEvent(new Event('scroll'))
      stop()
      vi.runAllTimers()
      scroll(element, 100)

      expect(onScroll).not.toHaveBeenCalled()
    })
  })

  describe('when the component unmounts', () => {
    it('then the listener is removed', async () => {
      const element = scrollableElement()
      const remove = vi.spyOn(element, 'removeEventListener')
      const [, app] = withSetup(() => useScroll(element))
      await nextTick()

      app.unmount()

      expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
  })
})
