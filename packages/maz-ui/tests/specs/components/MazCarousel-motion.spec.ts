import MazCarousel from '@components/MazCarousel.vue'
import { flushPromises, mount } from '@vue/test-utils'

function setMetrics(element: HTMLElement, metrics: { scrollWidth: number, clientWidth: number, scrollLeft: number }) {
  Object.defineProperty(element, 'scrollWidth', { value: metrics.scrollWidth, configurable: true })
  Object.defineProperty(element, 'clientWidth', { value: metrics.clientWidth, configurable: true })
  element.scrollLeft = metrics.scrollLeft
}

async function mountCarousel(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazCarousel, { props, slots: { default: '<div class="item">Item</div>' }, attachTo: document.body })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given MazCarousel counter and progress', () => {
  describe('when the counter is enabled', () => {
    it('then it shows the current page and the page count', async () => {
      const wrapper = await mountCarousel({ counter: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      setMetrics(items, { scrollWidth: 1000, clientWidth: 250, scrollLeft: 250 })
      items.dispatchEvent(new Event('scroll'))
      await flushPromises()
      await vi.dynamicImportSettled()
      await flushPromises()

      const counter = wrapper.find('.m-carousel__counter')

      expect(counter.attributes('aria-hidden')).toBe('true')
      expect(counter.text()).toContain('2')
      expect(counter.text()).toContain('4')
    })

    it('then it is hidden when everything fits in one page', async () => {
      const wrapper = await mountCarousel({ counter: true })

      expect(wrapper.find('.m-carousel__counter').exists()).toBe(false)
    })

    it('then the header exists even without buttons nor title', async () => {
      const wrapper = await mountCarousel({ counter: true, hideScrollButtons: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      setMetrics(items, { scrollWidth: 1000, clientWidth: 250, scrollLeft: 0 })
      items.dispatchEvent(new Event('scroll'))
      await flushPromises()

      expect(wrapper.find('.m-carousel__header').exists()).toBe(true)
      expect(wrapper.find('.m-carousel__counter').exists()).toBe(true)
      expect(wrapper.find('.m-carousel__btn').exists()).toBe(false)
    })
  })

  describe('when the progress bar is enabled', () => {
    it('then the thumb is as wide as the visible part and slides with the scroll', async () => {
      const wrapper = await mountCarousel({ progress: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      setMetrics(items, { scrollWidth: 1000, clientWidth: 250, scrollLeft: 375 })
      items.dispatchEvent(new Event('scroll'))
      await flushPromises()

      expect(wrapper.find('.m-carousel__progress').attributes('aria-hidden')).toBe('true')
      expect(wrapper.find('.m-carousel__progress-bar').attributes('style')).toContain('--m-carousel-thumb-size: 25%; --m-carousel-thumb-x: 150%')
    })

    it('then it starts with the first page visible', async () => {
      const wrapper = await mountCarousel({ progress: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      setMetrics(items, { scrollWidth: 1000, clientWidth: 250, scrollLeft: 0 })
      items.dispatchEvent(new Event('scroll'))
      await flushPromises()

      expect(wrapper.find('.m-carousel__progress-bar').attributes('style')).toContain('--m-carousel-thumb-x: 0%')
    })

    it('then it is not rendered by default', async () => {
      const wrapper = await mountCarousel()

      expect(wrapper.find('.m-carousel__progress').exists()).toBe(false)
      expect(wrapper.find('.m-carousel').classes()).not.toContain('--indicator')
    })

    it('then the native scrollbar is hidden', async () => {
      const wrapper = await mountCarousel({ progress: true })

      expect(wrapper.find('.m-carousel').classes()).toContain('--indicator')
    })
  })
})

describe('given MazCarousel drag scroll', () => {
  let frames: FrameRequestCallback[]

  beforeEach(() => {
    frames = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function pointer(type: string, init: { clientX?: number, timeStamp?: number, pointerType?: string } = {}) {
    const event = new Event(type, { bubbles: true, cancelable: true })

    const { timeStamp = 0, ...rest } = init

    Object.assign(event, { button: 0, pointerId: 1, pointerType: 'mouse', clientX: 0, ...rest })
    Object.defineProperty(event, 'timeStamp', { value: timeStamp })

    return event
  }

  describe('when the mouse drags the items', () => {
    it('then the items scroll with the pointer and the carousel is flagged', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      items.scrollLeft = 200
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0 }))
      items.dispatchEvent(pointer('pointermove', { clientX: 250, timeStamp: 50 }))
      await flushPromises()

      expect(items.scrollLeft).toBe(250)
      expect(wrapper.classes()).toContain('--dragging')
      expect(wrapper.classes()).toContain('--drag-scroll')
    })

    it('then it keeps gliding after the release and stops at rest', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      items.scrollLeft = 200
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0 }))
      items.dispatchEvent(pointer('pointermove', { clientX: 200, timeStamp: 50 }))
      items.dispatchEvent(pointer('pointerup'))

      expect(frames).toHaveLength(1)

      frames[0]!(16)
      frames[1]!(32)

      expect(items.scrollLeft).toBeGreaterThan(300)

      for (let index = 2; index < 200 && frames[index]; index++)
        frames[index]!(32 + index * 16)

      await flushPromises()

      expect(wrapper.classes()).not.toContain('--dragging')
    })

    it('then the click that ends the drag is cancelled', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement
      const onClick = vi.fn()

      wrapper.find('.item').element.addEventListener('click', onClick)
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0 }))
      items.dispatchEvent(pointer('pointermove', { clientX: 280, timeStamp: 300 }))
      items.dispatchEvent(pointer('pointerup'))
      wrapper.find('.item').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

      expect(onClick).not.toHaveBeenCalled()
    })

    it('then a click without movement goes through', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement
      const onClick = vi.fn()

      wrapper.find('.item').element.addEventListener('click', onClick)
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0 }))
      items.dispatchEvent(pointer('pointerup'))
      wrapper.find('.item').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('then the native drag of images is prevented', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const event = new Event('dragstart', { bubbles: true, cancelable: true })

      wrapper.find('.m-carousel__items').element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('when drag scroll is off or the pointer is not a mouse', () => {
    it('then nothing is dragged', async () => {
      const wrapper = await mountCarousel()
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      items.scrollLeft = 200
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0 }))
      items.dispatchEvent(pointer('pointermove', { clientX: 250, timeStamp: 50 }))

      expect(items.scrollLeft).toBe(200)
    })

    it('then a touch pointer is left to the native scroll', async () => {
      const wrapper = await mountCarousel({ dragScroll: true })
      const items = wrapper.find('.m-carousel__items').element as HTMLElement

      items.scrollLeft = 200
      items.dispatchEvent(pointer('pointerdown', { clientX: 300, timeStamp: 0, pointerType: 'touch' }))
      items.dispatchEvent(pointer('pointermove', { clientX: 250, timeStamp: 50 }))

      expect(items.scrollLeft).toBe(200)
      expect(wrapper.classes()).not.toContain('--dragging')
    })
  })
})
