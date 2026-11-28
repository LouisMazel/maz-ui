import MazReadMore from '@components/MazReadMore.vue'
import { flushPromises, mount } from '@vue/test-utils'

const text = 'Lorem ipsum dolor sit amet. '.repeat(40)

describe('given MazReadMore motion', () => {
  let heights: number[]

  beforeEach(() => {
    vi.useFakeTimers()
    heights = []
    HTMLElement.prototype.animate = vi.fn() as never
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const height = this.classList.contains('m-read-more__content')
        ? heights.shift() ?? 100
        : 0

      return { top: 0, left: 0, right: 0, bottom: height, width: 100, height, x: 0, y: 0, toJSON: () => ({}) } as DOMRect
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).animate
  })

  async function mountReadMore(props: Record<string, unknown> = {}) {
    const wrapper = mount(MazReadMore, { props: { text, maxChars: 20, ...props }, attachTo: document.body })

    await flushPromises()
    await flushPromises()

    return wrapper
  }

  describe('when the content expands', () => {
    it('then the height runs from the collapsed height to the full height, then settles', async () => {
      const wrapper = await mountReadMore()

      heights = [60, 300]
      await wrapper.find('[role="button"]').trigger('click')
      await flushPromises()

      const content = wrapper.find('.m-read-more__content')

      expect(content.classes()).toContain('--animating')
      expect(content.classes()).not.toContain('--closing')
      expect(content.attributes('style')).toContain('height: 300px')

      content.element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      await flushPromises()

      expect(content.classes()).not.toContain('--animating')
      expect(content.attributes('style') ?? '').not.toContain('height')
      expect(content.attributes('aria-expanded')).toBe('true')
    })

    it('then it settles after a delay when no transition ends', async () => {
      const wrapper = await mountReadMore()

      heights = [60, 300]
      await wrapper.find('[role="button"]').trigger('click')
      await flushPromises()
      vi.advanceTimersByTime(1000)
      await flushPromises()

      expect(wrapper.find('.m-read-more__content').classes()).not.toContain('--animating')
    })
  })

  describe('when the content collapses', () => {
    it('then the full text stays until the height has shrunk', async () => {
      const wrapper = await mountReadMore()

      heights = [60, 300]
      await wrapper.find('[role="button"]').trigger('click')
      await flushPromises()
      vi.advanceTimersByTime(1000)
      await flushPromises()

      heights = [300, 60]
      await wrapper.find('[role="button"]').trigger('click')
      await flushPromises()

      const content = wrapper.find('.m-read-more__content')

      expect(content.classes()).toContain('--closing')
      expect(content.text()).not.toContain('...')

      vi.advanceTimersByTime(1000)
      await flushPromises()

      expect(content.text()).toContain('...')
    })
  })

  describe('when the height does not change', () => {
    it('then the state flips without animation', async () => {
      const wrapper = await mountReadMore()

      heights = [100, 100]
      await wrapper.find('[role="button"]').trigger('click')
      await flushPromises()

      expect(wrapper.find('.m-read-more__content').classes()).not.toContain('--animating')
    })
  })

  describe('when animated is false', () => {
    it('then the state flips at once', async () => {
      const wrapper = await mountReadMore({ animated: false })

      await wrapper.find('[role="button"]').trigger('click')

      expect(wrapper.find('.m-read-more__content').classes()).not.toContain('--animating')
      expect(wrapper.find('.m-read-more__content').text()).not.toContain('...')
    })
  })

  describe('when fade is enabled', () => {
    it('then the collapsed content is fadeable and faded, and the fade goes when expanded', async () => {
      const wrapper = await mountReadMore({ fade: true, animated: false })
      const content = wrapper.find('.m-read-more__content')

      expect(content.classes()).toEqual(expect.arrayContaining(['--fadeable', '--faded']))

      await wrapper.find('[role="button"]').trigger('click')

      expect(content.classes()).toContain('--fadeable')
      expect(content.classes()).not.toContain('--faded')
    })

    it('then there is no fade by default', async () => {
      const wrapper = await mountReadMore()

      expect(wrapper.find('.m-read-more__content').classes()).not.toContain('--fadeable')
    })
  })
})
