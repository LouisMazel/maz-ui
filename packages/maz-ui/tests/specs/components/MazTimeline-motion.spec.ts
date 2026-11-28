import MazTimeline from '@components/MazTimeline.vue'
import { mount } from '@vue/test-utils'

const steps = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }]

describe('given MazTimeline reveal', () => {
  let observerCallback: IntersectionObserverCallback
  let observe: ReturnType<typeof vi.fn>
  let unobserve: ReturnType<typeof vi.fn>
  let disconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()

    // eslint-disable-next-line prefer-arrow-callback
    vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: IntersectionObserverCallback) {
      observerCallback = callback

      return { observe, unobserve, disconnect }
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  function mountWithPositions(tops: number[], props: Record<string, unknown> = {}) {
    let index = 0

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const isItem = this.classList.contains('m-timeline-item')
      const top = isItem
        ? tops[index++ % tops.length]!
        : 0

      return { top, bottom: top + 50, left: 0, right: 100, width: 100, height: 50, x: 0, y: top, toJSON: () => ({}) } as DOMRect
    })

    return mount(MazTimeline, { props: { steps, direction: 'vertical', ...props } })
  }

  describe('when some steps are below the fold', () => {
    it('then only those steps are unseen, the visible ones are never hidden', async () => {
      const wrapper = mountWithPositions([0, 5000, 6000])

      await wrapper.vm.$nextTick()

      const items = wrapper.findAll('.m-timeline-item')

      expect(items[0]!.classes()).not.toContain('--unseen')
      expect(items[1]!.classes()).toContain('--unseen')
      expect(items[2]!.classes()).toContain('--unseen')
      expect(observe).toHaveBeenCalledTimes(2)
    })

    it('then a step rises once when it enters the viewport and is not observed anymore', async () => {
      const wrapper = mountWithPositions([0, 5000, 6000])

      await wrapper.vm.$nextTick()

      const target = wrapper.findAll('.m-timeline-item')[1]!.element

      observerCallback([{ isIntersecting: false, target } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
      await wrapper.vm.$nextTick()

      expect(wrapper.findAll('.m-timeline-item')[1]!.classes()).toContain('--unseen')

      observerCallback([{ isIntersecting: true, target } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
      await wrapper.vm.$nextTick()

      expect(wrapper.findAll('.m-timeline-item')[1]!.classes()).not.toContain('--unseen')
      expect(wrapper.findAll('.m-timeline-item')[2]!.classes()).toContain('--unseen')
      expect(unobserve).toHaveBeenCalledWith(target)
    })

    it('then the observer is disconnected on unmount', async () => {
      const wrapper = mountWithPositions([0, 5000, 6000])

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(disconnect).toHaveBeenCalled()
    })
  })

  describe('when every step is visible', () => {
    it('then nothing is hidden nor observed', async () => {
      const wrapper = mountWithPositions([0, 100, 200])

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.--unseen').exists()).toBe(false)
      expect(observe).not.toHaveBeenCalled()
    })
  })

  describe('when animated is false', () => {
    it('then no step is hidden', async () => {
      const wrapper = mountWithPositions([0, 5000, 6000], { animated: false })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.--unseen').exists()).toBe(false)
    })
  })

  describe('when IntersectionObserver is not available', () => {
    it('then no step is hidden', async () => {
      vi.stubGlobal('IntersectionObserver', undefined)

      const wrapper = mountWithPositions([0, 5000, 6000])

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.--unseen').exists()).toBe(false)
    })
  })
})
