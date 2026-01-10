import type { Mock } from 'vitest'
import MazCardSpotlight from '@components/MazCardSpotlight.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('given mazCardSpotlight component', () => {
  let intersectionObserverCallback: IntersectionObserverCallback
  let intersectionObserverInstance: { observe: Mock, disconnect: Mock, unobserve: Mock }

  beforeEach(() => {
    intersectionObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }

    globalThis.IntersectionObserver = vi.fn((callback) => {
      intersectionObserverCallback = callback
      return intersectionObserverInstance
    }) as any

    globalThis.requestAnimationFrame = vi.fn((callback) => {
      callback(0)
      return 0
    })

    globalThis.cancelAnimationFrame = vi.fn()

    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
      x: 100,
      y: 100,
      toJSON: () => {},
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when component renders', () => {
    it('renders with default props', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-card-spotlight')
      expect(wrapper.classes()).toContain('m-reset-css')
    })

    it('applies elevation classes when elevation prop is true', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          elevation: true,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('maz-shadow-elevation')
      expect(wrapper.classes()).toContain('maz-drop-shadow-md')
    })

    it('does not apply elevation classes when elevation prop is false', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          elevation: false,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('maz-shadow-elevation')
      expect(wrapper.classes()).not.toContain('maz-drop-shadow-md')
    })

    it('applies padding class to content when padding prop is true', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          padding: true,
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).toContain('maz-p-4')
    })

    it('does not apply padding class when padding prop is false', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          padding: false,
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).not.toContain('maz-p-4')
    })

    it('applies custom contentClass', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          contentClass: 'custom-class',
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).toContain('custom-class')
    })

    it('applies custom contentStyle', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          contentStyle: { backgroundColor: 'red' },
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.attributes('style')).toContain('background-color: red')
    })

    it('applies custom color', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          color: 'secondary',
        },
      })

      await wrapper.vm.$nextTick()

      const container = wrapper.find('.m-card-spotlight')
      expect(container.attributes('style')).toContain('--maz-secondary')
    })

    it('applies custom innerOpacity', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          innerOpacity: 0.5,
        },
      })

      await wrapper.vm.$nextTick()

      const container = wrapper.find('.m-card-spotlight')
      expect(container.attributes('style')).toContain('--inner-opacity: 0.5')
    })

    it('renders slot content', async () => {
      const wrapper = mount(MazCardSpotlight, {
        slots: {
          default: '<div class="test-slot">Test Content</div>',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.test-slot').exists()).toBe(true)
      expect(wrapper.find('.test-slot').text()).toBe('Test Content')
    })
  })

  describe('when component is mounted', () => {
    it('sets up IntersectionObserver', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0 },
      )
      expect(intersectionObserverInstance.observe).toHaveBeenCalled()
    })

    it('caches getBoundingClientRect on mount', async () => {
      const getBoundingClientRectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(getBoundingClientRectSpy).toHaveBeenCalled()
    })

    it('adds mousemove event listener', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
        { passive: true },
      )
    })

    it('adds scroll event listener', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true },
      )
    })

    it('adds resize event listener', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
        { passive: true },
      )
    })
  })

  describe('when blob animation is triggered', () => {
    it('shows blob when mouse moves and component is intersecting', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await flushPromises()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      await flushPromises()

      const blob = wrapper.find('.blob')
      expect(blob.exists()).toBe(true)
      expect(blob.attributes('style')).not.toContain('display: none')
    })

    it('uses requestAnimationFrame for blob position updates', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      expect(globalThis.requestAnimationFrame).toHaveBeenCalled()
    })

    it('updates blob transform using direct DOM manipulation', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const blob = wrapper.find('.blob')
      const blobElement = blob.element as HTMLElement

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      await wrapper.vm.$nextTick()

      expect(blobElement.style.transform).toBe('translate(-54px, -54px)')
    })

    it('does not show blob when component is not intersecting', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      intersectionObserverCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const blob = wrapper.find('.blob')

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      await wrapper.vm.$nextTick()

      expect(blob.isVisible()).toBe(false)
    })

    it('stops animation when component leaves viewport', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await flushPromises()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      await flushPromises()

      const blob = wrapper.find('.blob')
      expect(blob.attributes('style')).not.toContain('display: none')

      intersectionObserverCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      await flushPromises()

      expect(blob.attributes('style')).toContain('display: none')
    })

    it('prevents multiple simultaneous requestAnimationFrame calls', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      const rafMock = globalThis.requestAnimationFrame as Mock
      rafMock.mockClear()
      rafMock.mockReturnValue(123)
      rafMock.mockImplementation((callback: FrameRequestCallback) => {
        setTimeout(callback, 16)
        return 123
      })

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
        mouseMoveHandler({ clientX: 151, clientY: 151 } as MouseEvent)
        mouseMoveHandler({ clientX: 152, clientY: 152 } as MouseEvent)
      }

      expect(rafMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when scroll or resize occurs', () => {
    it('recalculates cached rect on scroll', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')
      const getBoundingClientRectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      const initialCallCount = getBoundingClientRectSpy.mock.calls.length

      const scrollHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'scroll',
      )?.[1]

      if (typeof scrollHandler === 'function') {
        scrollHandler({} as Event)
      }

      expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(initialCallCount + 1)
    })

    it('recalculates cached rect on resize', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')
      const getBoundingClientRectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      const initialCallCount = getBoundingClientRectSpy.mock.calls.length

      const resizeHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'resize',
      )?.[1]

      if (typeof resizeHandler === 'function') {
        resizeHandler({} as Event)
      }

      expect(getBoundingClientRectSpy).toHaveBeenCalledTimes(initialCallCount + 1)
    })
  })

  describe('when component is unmounted', () => {
    it('removes mousemove event listener', async () => {
      const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
    })

    it('removes scroll event listener', async () => {
      const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('removes resize event listener', async () => {
      const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('disconnects IntersectionObserver', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(intersectionObserverInstance.disconnect).toHaveBeenCalled()
    })

    it('cancels pending requestAnimationFrame', async () => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')
      const rafMock = globalThis.requestAnimationFrame as Mock
      rafMock.mockClear()
      rafMock.mockReturnValue(123)
      rafMock.mockImplementation(() => 123)

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      const mouseMoveHandler = addEventListenerSpy.mock.calls.find(
        (call: any[]) => call[0] === 'mousemove',
      )?.[1]

      if (typeof mouseMoveHandler === 'function') {
        mouseMoveHandler({ clientX: 150, clientY: 150 } as MouseEvent)
      }

      wrapper.unmount()

      expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(123)
    })
  })
})
