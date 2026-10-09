import type { VueWrapper } from '@vue/test-utils'
import MazPullToRefresh from '@components/MazPullToRefresh.vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

function fireTouch(target: EventTarget, type: string, points: Array<{ x: number, y: number }>) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: points.map(({ x, y }) => ({ clientX: x, clientY: y })) })
  target.dispatchEvent(event)
}

function pull(target: EventTarget, deltaY: number) {
  fireTouch(target, 'touchstart', [{ x: 0, y: 0 }])
  fireTouch(target, 'touchmove', [{ x: 0, y: deltaY / 2 }])
  fireTouch(target, 'touchmove', [{ x: 0, y: deltaY }])
}

const translations = { pull: 'Pull to refresh', release: 'Release to refresh', refreshing: 'Refreshing…' }

function release(target: EventTarget) {
  fireTouch(target, 'touchend', [])
}

function mountInScroller(props: Record<string, unknown>) {
  const Host = defineComponent({
    setup() {
      return () => h('div', { class: 'scroller', style: 'overflow-y: auto' }, [
        h(MazPullToRefresh, props, { default: () => h('p', { class: 'content' }, 'Content') }),
      ])
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, scroller: wrapper.find('.scroller').element as HTMLElement, component: wrapper.findComponent(MazPullToRefresh) }
}

describe('given the MazPullToRefresh component', () => {
  let wrapper: VueWrapper | undefined

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.useRealTimers()
  })

  describe('when it is rendered without onRefresh', () => {
    it('then it only renders its content', () => {
      wrapper = mount(MazPullToRefresh, { slots: { default: 'Content' } })

      expect(wrapper.text()).toBe('Content')
      expect(wrapper.find('.m-pull-to-refresh__header').exists()).toBe(false)
    })
  })

  describe('when it sits inside a scrollable ancestor', () => {
    describe('when the user pulls past the distance and releases', () => {
      it('then it refreshes and emits the lifecycle events in order', async () => {
        const onRefresh = vi.fn().mockResolvedValue('data')
        const mounted = mountInScroller({ onRefresh, translations })
        wrapper = mounted.wrapper
        await nextTick()

        pull(mounted.scroller, 200)
        await nextTick()
        expect(mounted.component.find('.m-pull-to-refresh').classes()).toContain('--available')
        expect(mounted.component.text()).toContain('Release to refresh')

        release(mounted.scroller)
        await nextTick()
        expect(mounted.component.find('.m-pull-to-refresh').attributes('aria-busy')).toBe('true')
        expect(mounted.component.find('[role="status"]').text()).toBe('Refreshing…')

        await vi.advanceTimersByTimeAsync(400)

        expect(onRefresh).toHaveBeenCalledOnce()
        expect(Object.keys(mounted.component.emitted())).toEqual(expect.arrayContaining(['start', 'loaded', 'response', 'finish']))
        expect(mounted.component.emitted('response')?.[0]).toEqual(['data'])
        expect(mounted.component.find('[role="status"]').text()).toBe('')
      })
    })

    describe('when the ancestor is scrolled down', () => {
      it('then pulling scrolls instead of refreshing', async () => {
        const onRefresh = vi.fn()
        const mounted = mountInScroller({ onRefresh })
        wrapper = mounted.wrapper
        await nextTick()
        mounted.scroller.scrollTop = 120

        pull(mounted.scroller, 300)
        release(mounted.scroller)
        await nextTick()

        expect(onRefresh).not.toHaveBeenCalled()
      })
    })

    describe('when the pull is short', () => {
      it('then it shows the pull hint and its progress ring', async () => {
        const mounted = mountInScroller({ onRefresh: vi.fn(), translations })
        wrapper = mounted.wrapper
        await nextTick()

        pull(mounted.scroller, 80)
        await nextTick()

        expect(mounted.component.text()).toContain('Pull to refresh')
        expect(mounted.component.find('circle').exists()).toBe(true)
        expect(mounted.component.find('.m-pull-to-refresh__header').attributes('style')).toContain('height: 40px')
      })
    })
  })

  describe('when a container selector is given', () => {
    it('then the gesture is read on that container', async () => {
      const container = document.createElement('div')
      container.id = 'page-scroller'
      document.body.append(container)
      const onRefresh = vi.fn()
      wrapper = mount(MazPullToRefresh, { props: { onRefresh, containerSelector: '#page-scroller' }, attachTo: document.body })
      await nextTick()

      pull(container, 200)
      release(container)
      await nextTick()

      expect(onRefresh).toHaveBeenCalledOnce()
      await vi.advanceTimersByTimeAsync(400)
      container.remove()
    })
  })

  describe('when translations are given', () => {
    it('then they replace the default texts', async () => {
      const mounted = mountInScroller({ onRefresh: vi.fn(), translations: { pull: 'Tirer' } })
      wrapper = mounted.wrapper
      await nextTick()

      pull(mounted.scroller, 60)
      await nextTick()

      expect(mounted.component.text()).toContain('Tirer')
    })
  })

  describe('when standalone mode is required outside an installed app', () => {
    it('then the pull to refresh is disabled', async () => {
      Object.defineProperty(globalThis, 'matchMedia', { value: () => ({ matches: false }), configurable: true })
      const onRefresh = vi.fn()
      wrapper = mount(MazPullToRefresh, { props: { onRefresh, standaloneMode: true }, attachTo: document.body })
      await nextTick()

      pull(globalThis, 200)
      release(globalThis)
      await nextTick()

      expect(wrapper.find('.m-pull-to-refresh__header').exists()).toBe(false)
      expect(onRefresh).not.toHaveBeenCalled()
    })
  })

  describe('when standalone mode is required inside an installed app', () => {
    it('then the pull to refresh is enabled', async () => {
      Object.defineProperty(globalThis, 'matchMedia', { value: () => ({ matches: true }), configurable: true })
      wrapper = mount(MazPullToRefresh, { props: { onRefresh: vi.fn(), standaloneMode: true }, attachTo: document.body })
      await nextTick()

      expect(wrapper.find('.m-pull-to-refresh__header').exists()).toBe(true)
    })
  })

  describe('when onRefresh rejects', () => {
    it('then it emits error then finish without throwing', async () => {
      const failure = new Error('offline')
      wrapper = mount(MazPullToRefresh, { props: { onRefresh: vi.fn().mockRejectedValue(failure) }, attachTo: document.body })
      await nextTick()

      const exposed = wrapper.vm as unknown as { refresh: () => Promise<void> }
      const done = exposed.refresh()
      await vi.advanceTimersByTimeAsync(400)
      await done

      expect(wrapper.emitted('error')?.[0]).toEqual([failure])
      expect(wrapper.emitted('finish')).toHaveLength(1)
      expect(wrapper.emitted('loaded')).toBeUndefined()
    })
  })

  describe('when the loading slot is provided', () => {
    it('then it replaces the spinner while refreshing', async () => {
      wrapper = mount(MazPullToRefresh, {
        props: { onRefresh: () => new Promise(() => {}) },
        slots: { 'pull-loading': '<span class="custom-loader">Loading</span>' },
        attachTo: document.body,
      })
      await nextTick()

      void (wrapper.vm as unknown as { refresh: () => Promise<void> }).refresh()
      await nextTick()

      expect(wrapper.find('.custom-loader').exists()).toBe(true)
    })
  })
})
