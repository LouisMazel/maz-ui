import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup'
import { shallowMount } from '@vue/test-utils'

function getLastIntersectionCallback(): IntersectionObserverCallback {
  const calls = vi.mocked(IntersectionObserver).mock.calls
  return calls.at(-1)![0]
}

function intersect(element: Element, isIntersecting: boolean) {
  getLastIntersectionCallback()(
    [
      { target: element, isIntersecting } as IntersectionObserverEntry,
    ],
    IntersectionObserverMock as unknown as IntersectionObserver,
  )
}

function mockRect(top: number, bottom: number) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top, bottom } as DOMRect)
}

describe('given a MazAnimatedElement', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
    vi.mocked(IntersectionObserverMock.disconnect).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when it is rendered with a direction, a duration and a delay', () => {
    it('then the animation class and the timing styles are set on the first render', () => {
      const wrapper = shallowMount(MazAnimatedElement, {
        props: { direction: 'down', duration: 1000, delay: 500 },
      })

      expect(wrapper.classes()).toContain('animate-slide-down-blur')
      expect(wrapper.attributes('style')).toContain('animation-duration: 1000ms')
      expect(wrapper.attributes('style')).toContain('animation-delay: 500ms')
    })
  })

  describe('when it is mounted inside the viewport', () => {
    it('then the animation plays without waiting for the observer', () => {
      mockRect(10, 100)
      const wrapper = shallowMount(MazAnimatedElement)

      expect(wrapper.classes()).toContain('animate-slide-up-blur')
      expect(wrapper.classes()).not.toContain('m-animated-element--pending')
    })
  })

  describe('when it is mounted below the viewport', () => {
    it('then the animation waits for the element to enter the viewport', async () => {
      mockRect(2000, 2100)
      const wrapper = shallowMount(MazAnimatedElement)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('m-animated-element--pending')
      expect(IntersectionObserverMock.observe).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when the element enters the viewport with once', () => {
    it('then the animation plays and the element is no longer observed', async () => {
      mockRect(2000, 2100)
      const wrapper = shallowMount(MazAnimatedElement, {
        props: { once: true },
      })
      await wrapper.vm.$nextTick()

      intersect(wrapper.element, true)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('m-animated-element--pending')
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when the element leaves the viewport without once', () => {
    it('then the animation is reset and the element stays observed', async () => {
      mockRect(2000, 2100)
      const wrapper = shallowMount(MazAnimatedElement, {
        props: { once: false },
      })
      await wrapper.vm.$nextTick()

      intersect(wrapper.element, true)
      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).not.toContain('m-animated-element--pending')

      intersect(wrapper.element, false)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('m-animated-element--pending')
      expect(IntersectionObserverMock.unobserve).not.toHaveBeenCalled()
    })
  })

  describe('when the element leaves the viewport with once', () => {
    it('then the animation is kept', async () => {
      mockRect(10, 100)
      const wrapper = shallowMount(MazAnimatedElement, {
        props: { once: true },
      })

      intersect(wrapper.element, false)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('m-animated-element--pending')
    })
  })

  describe('when the user prefers reduced motion', () => {
    it('then no observer is created', () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        configurable: true,
        value: vi.fn().mockReturnValue({ matches: true }),
      })
      const wrapper = shallowMount(MazAnimatedElement)

      expect(IntersectionObserver).not.toHaveBeenCalled()
      expect(wrapper.classes()).not.toContain('m-animated-element--pending')
      Reflect.deleteProperty(globalThis, 'matchMedia')
    })
  })

  describe('when it is unmounted', () => {
    it('then the observer is disconnected', () => {
      const wrapper = shallowMount(MazAnimatedElement)
      wrapper.unmount()

      expect(IntersectionObserverMock.disconnect).toHaveBeenCalledOnce()
    })
  })
})
