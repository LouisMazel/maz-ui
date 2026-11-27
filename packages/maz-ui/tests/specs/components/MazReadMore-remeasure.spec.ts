import MazReadMore from '@components/MazReadMore.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('given MazReadMore measuring its content', () => {
  let scrollHeight = 40
  let resizeCallback: ((entries: unknown[], observer: unknown) => void) | undefined
  const disconnect = vi.fn()

  beforeEach(() => {
    scrollHeight = 40
    resizeCallback = undefined
    disconnect.mockClear()

    class ResizeObserverStub {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = disconnect

      constructor(callback: (entries: unknown[], observer: unknown) => void) {
        resizeCallback = callback
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverStub)

    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({ lineHeight: '20px' } as CSSStyleDeclaration)
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(() => scrollHeight)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the content fits at mount', () => {
    it('then the toggle is hidden', async () => {
      const wrapper = mount(MazReadMore, { props: { text: 'short', maxLines: 3 } })
      await flushPromises()

      expect(wrapper.find('[role="button"]').exists()).toBe(false)
    })
  })

  describe('when the content grows after mount and the element is resized', () => {
    it('then the toggle appears', async () => {
      const wrapper = mount(MazReadMore, { props: { text: 'short', maxLines: 3 } })
      await flushPromises()

      scrollHeight = 200
      resizeCallback?.([], {})
      await flushPromises()

      expect(wrapper.find('[role="button"]').exists()).toBe(true)
    })
  })

  describe('when the slot content changes in the DOM', () => {
    it('then the toggle appears', async () => {
      const wrapper = mount(MazReadMore, {
        props: { maxLines: 3 },
        slots: { default: '<p>short</p>' },
        attachTo: document.body,
      })
      await flushPromises()
      expect(wrapper.find('[role="button"]').exists()).toBe(false)

      scrollHeight = 200
      wrapper.find('.m-read-more__content').element.append(document.createElement('p'))
      await flushPromises()

      expect(wrapper.find('[role="button"]').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when the text prop changes', () => {
    it('then the toggle appears', async () => {
      const wrapper = mount(MazReadMore, { props: { text: 'short', maxLines: 3 } })
      await flushPromises()

      scrollHeight = 200
      await wrapper.setProps({ text: 'a much longer text' })
      await flushPromises()

      expect(wrapper.find('[role="button"]').exists()).toBe(true)
    })
  })

  describe('when unmounted', () => {
    it('then the resize observer is disconnected', async () => {
      const wrapper = mount(MazReadMore, { props: { text: 'short', maxLines: 3 } })
      await flushPromises()

      wrapper.unmount()

      expect(disconnect).toHaveBeenCalled()
    })
  })
})
