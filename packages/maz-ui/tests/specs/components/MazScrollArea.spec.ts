import MazScrollArea from '@components/MazScrollArea.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

const observed = vi.hoisted(() => ({ callback: undefined as undefined | (() => void), disconnect: vi.fn(), observe: vi.fn() }))

class FakeResizeObserver {
  constructor(callback: () => void) {
    observed.callback = callback
  }

  observe = observed.observe
  disconnect = observed.disconnect
  unobserve = vi.fn()
}

function setMetrics(element: HTMLElement, metrics: Partial<Record<'scrollHeight' | 'clientHeight' | 'scrollWidth' | 'clientWidth' | 'scrollTop' | 'scrollLeft', number>>) {
  for (const [key, value] of Object.entries({ scrollHeight: 100, clientHeight: 100, scrollWidth: 100, clientWidth: 100, scrollTop: 0, scrollLeft: 0, ...metrics }))
    Object.defineProperty(element, key, { value, configurable: true, writable: true })
}

function mountComponent(props: Record<string, unknown> = {}, metrics = {}) {
  const original = HTMLElement.prototype.getBoundingClientRect
  const wrapper = mount(MazScrollArea, { props, slots: { default: '<p>content</p>' }, attachTo: document.body })
  setMetrics(wrapper.element as HTMLElement, metrics)
  ;(wrapper.vm as unknown as { update: () => void }).update()
  HTMLElement.prototype.getBoundingClientRect = original
  return wrapper
}

describe('given a MazScrollArea', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
    observed.observe.mockClear()
    observed.disconnect.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when the content fits', () => {
    it('then the area is not focusable and has no role', async () => {
      const wrapper = mountComponent({ label: 'List' })
      await nextTick()

      expect(wrapper.attributes('tabindex')).toBeUndefined()
      expect(wrapper.attributes('role')).toBeUndefined()
      expect(wrapper.attributes('aria-label')).toBeUndefined()
    })

    it('then no fade is displayed', async () => {
      const wrapper = mountComponent()
      await nextTick()

      expect(wrapper.classes()).not.toContain('m-scroll-area--bottom')
      expect(wrapper.classes()).not.toContain('m-scroll-area--top')
    })
  })

  describe('when the content scrolls', () => {
    it('then the area is a focusable named region', async () => {
      const wrapper = mountComponent({ label: 'List' }, { scrollHeight: 400 })
      await nextTick()

      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.attributes('role')).toBe('region')
      expect(wrapper.attributes('aria-label')).toBe('List')
    })

    it('then the area is focusable without a role when it has no label', async () => {
      const wrapper = mountComponent({}, { scrollHeight: 400 })
      await nextTick()

      expect(wrapper.attributes('tabindex')).toBe('0')
      expect(wrapper.attributes('role')).toBeUndefined()
    })

    it('then the bottom fade shows first, then both once scrolled, then only the top at the end', async () => {
      const wrapper = mountComponent({}, { scrollHeight: 400, clientHeight: 100 })
      await nextTick()
      expect(wrapper.classes()).toContain('m-scroll-area--bottom')
      expect(wrapper.classes()).not.toContain('m-scroll-area--top')

      setMetrics(wrapper.element as HTMLElement, { scrollHeight: 400, clientHeight: 100, scrollTop: 100 })
      await wrapper.trigger('scroll')
      expect(wrapper.classes()).toContain('m-scroll-area--top')
      expect(wrapper.classes()).toContain('m-scroll-area--bottom')
      expect(wrapper.emitted('scroll')).toHaveLength(1)

      setMetrics(wrapper.element as HTMLElement, { scrollHeight: 400, clientHeight: 100, scrollTop: 300 })
      await wrapper.trigger('scroll')
      expect(wrapper.classes()).toContain('m-scroll-area--top')
      expect(wrapper.classes()).not.toContain('m-scroll-area--bottom')
    })

    it('then the horizontal fades follow the horizontal scroll', async () => {
      const wrapper = mountComponent({ orientation: 'horizontal' }, { scrollWidth: 400, clientWidth: 100 })
      await nextTick()
      expect(wrapper.classes()).toContain('m-scroll-area--end')
      expect(wrapper.classes()).not.toContain('m-scroll-area--start')

      setMetrics(wrapper.element as HTMLElement, { scrollWidth: 400, clientWidth: 100, scrollLeft: -150 })
      await wrapper.trigger('scroll')
      expect(wrapper.classes()).toContain('m-scroll-area--start')
    })
  })

  describe('when the props are set', () => {
    it('then the max size, the fade size and the orientation apply', () => {
      const wrapper = mountComponent({ maxHeight: '10rem', maxWidth: '20rem', fadeSize: '1rem', orientation: 'both' })
      const style = (wrapper.element as HTMLElement).style

      expect(style.maxHeight).toBe('10rem')
      expect(style.maxWidth).toBe('20rem')
      expect(style.getPropertyValue('--m-scroll-area-fade')).toBe('1rem')
      expect(wrapper.classes()).toContain('maz:overflow-auto')
    })

    it('then the fade can be turned off', () => {
      const wrapper = mountComponent({ fade: false })

      expect(wrapper.classes()).not.toContain('m-scroll-area--fade')
    })
  })

  describe('when the size of the content changes', () => {
    it('then the observer measures the area again and stops on unmount', async () => {
      const wrapper = mountComponent({}, { scrollHeight: 100 })
      expect(observed.observe).toHaveBeenCalledTimes(2)

      setMetrics(wrapper.element as HTMLElement, { scrollHeight: 500 })
      observed.callback?.()
      await nextTick()
      expect(wrapper.attributes('tabindex')).toBe('0')

      wrapper.unmount()
      expect(observed.disconnect).toHaveBeenCalled()
    })

    it('then it works without ResizeObserver', () => {
      vi.stubGlobal('ResizeObserver', undefined)

      expect(() => mountComponent()).not.toThrow()
    })
  })

  describe('when it renders on the server', () => {
    it('then the markup has the default slot', async () => {
      const html = await renderToString(createSSRApp(MazScrollArea))

      expect(html).toContain('m-scroll-area')
    })
  })
})
