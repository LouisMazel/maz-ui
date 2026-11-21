import MazBtnScroll from '@components/MazBtnScroll.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig.ts'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

function scrollableElement(scrollHeight = 2000, clientHeight = 500) {
  const element = document.createElement('div')
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight })
  Object.defineProperty(element, 'clientHeight', { value: clientHeight })
  element.scrollTo = vi.fn()
  return element
}

async function scroll(target: HTMLElement | Window, top: number) {
  if (target instanceof HTMLElement)
    target.scrollTop = top
  else
    window.scrollY = top

  target.dispatchEvent(new Event('scroll'))
  vi.advanceTimersToNextFrame()
  await nextTick()
}

describe('given MazBtnScroll component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    window.scrollY = 0
    vi.useRealTimers()
  })

  describe('when the page is at the top', () => {
    it('then the button is hidden', async () => {
      const wrapper = mount(MazBtnScroll)
      await nextTick()

      expect(wrapper.find('.m-btn-scroll').exists()).toBe(false)
    })
  })

  describe('when the page is scrolled past the threshold', () => {
    it('then the fab button is displayed at the bottom end', async () => {
      const wrapper = mount(MazBtnScroll)
      await nextTick()

      await scroll(globalThis, 401)

      const root = wrapper.find('.m-btn-scroll')
      expect(root.classes()).toEqual(expect.arrayContaining(['maz:end-(--m-btn-scroll-offset)', 'maz:fixed', '--progress']))
      expect(root.attributes('style')).toContain('--m-btn-scroll-offset: 1.5rem')
      expect(wrapper.find('button').attributes('aria-label')).toBe('test')
      expect(wrapper.find('button').classes()).toContain('maz:rounded-full')
    })

    describe('when the button is clicked', () => {
      it('then the page scrolls smoothly to the top and click is emitted', async () => {
        const scrollTo = vi.spyOn(globalThis, 'scrollTo').mockImplementation(() => {})
        const wrapper = mount(MazBtnScroll)
        await nextTick()
        await scroll(globalThis, 800)

        await wrapper.find('button').trigger('click')

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: undefined, behavior: 'smooth' })
        expect(wrapper.emitted('click')).toHaveLength(1)
        scrollTo.mockRestore()
      })
    })
  })

  describe('when the target is an element with a threshold, a position, a label and the progress', () => {
    it('then it follows the element and shows its progress', async () => {
      const target = scrollableElement()
      const wrapper = mount(MazBtnScroll, { props: { target, threshold: 100, position: 'bottom-start', label: 'Up', progress: true, offset: '2rem', behavior: 'instant' } })
      await nextTick()

      await scroll(target, 750)

      const root = wrapper.find('.m-btn-scroll')
      expect(root.classes()).toEqual(expect.arrayContaining(['--progress', 'maz:start-(--m-btn-scroll-offset)', 'maz:absolute']))
      expect(root.classes()).not.toContain('maz:fixed')
      expect(root.attributes('style')).toContain('--m-btn-scroll-progress: 50%')
      expect(wrapper.find('button').attributes('aria-label')).toBe('Up')

      await wrapper.find('button').trigger('click')
      expect(target.scrollTo).toHaveBeenCalledWith({ top: 0, left: undefined, behavior: 'instant' })
    })
  })

  describe('when the progress is shown on the page', () => {
    it('then it is computed from the height of the document', async () => {
      vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(window.innerHeight + 1000)
      const wrapper = mount(MazBtnScroll, { props: { progress: true } })
      await nextTick()

      await scroll(globalThis, 500)

      expect(wrapper.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-progress: 50%')
      vi.restoreAllMocks()
    })

    describe('when the page cannot scroll', () => {
      it('then the progress is full', async () => {
        const target = scrollableElement(500, 500)
        const wrapper = mount(MazBtnScroll, { props: { target, threshold: 0, progress: true } })
        await nextTick()

        await scroll(target, 10)

        expect(wrapper.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-progress: 100%')
      })
    })
  })

  describe('when the position is bottom-center and the radius is not full', () => {
    it('then the button is centered with a rounded ring', async () => {
      const wrapper = mount(MazBtnScroll, { props: { position: 'bottom-center', roundedSize: 'md' } })
      await nextTick()

      await scroll(globalThis, 500)

      expect(wrapper.find('.m-btn-scroll').classes()).toContain('maz:start-1/2')
      expect(wrapper.find('.m-btn-scroll__ring').classes()).toContain('maz:rounded-lg')
    })
  })

  describe('when the target is a component', () => {
    it('then it follows the element of the component', async () => {
      const element = scrollableElement()
      const wrapper = mount(MazBtnScroll, { props: { target: { $el: element } as never, threshold: 0, progress: true } })
      await nextTick()

      await scroll(element, 750)

      expect(wrapper.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-progress: 50%')
    })
  })

  describe('when the target is the document', () => {
    it('then the button is fixed on the screen', async () => {
      const wrapper = mount(MazBtnScroll, { props: { target: document } })
      await nextTick()

      await scroll(globalThis, 500)

      expect(wrapper.find('.m-btn-scroll').classes()).toContain('maz:fixed')
    })
  })

  describe('when to is bottom', () => {
    describe('when the element is far from its end', () => {
      it('then the button is displayed and scrolls to the bottom', async () => {
        const target = scrollableElement()
        const wrapper = mount(MazBtnScroll, { props: { target, to: 'bottom', threshold: 100 } })
        await nextTick()

        await scroll(target, 10)
        await wrapper.find('button').trigger('click')

        expect(target.scrollTo).toHaveBeenCalledWith({ top: 2000, left: undefined, behavior: 'smooth' })
      })
    })

    describe('when the element is close to its end', () => {
      it('then the button is hidden', async () => {
        const target = scrollableElement()
        const wrapper = mount(MazBtnScroll, { props: { target, to: 'bottom', threshold: 100 } })
        await nextTick()

        await scroll(target, 1450)

        expect(wrapper.find('button').exists()).toBe(false)
      })
    })
  })

  describe('when visible is given', () => {
    it('then it replaces the threshold', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true } })
      await nextTick()

      expect(wrapper.find('button').exists()).toBe(true)

      await wrapper.setProps({ visible: false })

      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('when the click is prevented', () => {
    it('then it does not scroll', async () => {
      const target = scrollableElement()
      const wrapper = mount(MazBtnScroll, {
        props: { target, visible: true, onClick: (event: MouseEvent) => event.preventDefault() },
      })
      await nextTick()

      await wrapper.find('button').trigger('click')

      expect(target.scrollTo).not.toHaveBeenCalled()
    })
  })

  describe('when progress is false', () => {
    it('then there is no ring', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true, progress: false } })
      await nextTick()

      expect(wrapper.find('.m-btn-scroll').classes()).not.toContain('--progress')
    })
  })

  describe('when bordered is true', () => {
    it('then the button has a divider border', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true, bordered: true } })
      await nextTick()

      expect(wrapper.find('button').classes()).toContain('maz:border-divider!')
    })
  })

  describe('when a progress color is given', () => {
    it('then the ring uses it', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true, progress: true, progressColor: 'success' } })
      await nextTick()

      expect(wrapper.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-progress-color: var(--maz-success)')
    })
  })

  describe('when the global config sets the size', () => {
    it('then the button uses it', async () => {
      const wrapper = mount(MazBtnScroll, {
        global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: { MazBtnScroll: { size: 'lg' } } } },
      })
      await nextTick()

      await scroll(globalThis, 500)

      expect(wrapper.find('button').classes()).toContain('--lg')
    })
  })
})
