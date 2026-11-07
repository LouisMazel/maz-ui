import MazAnimatedCounter from '@components/MazAnimatedCounter.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup'
import { shallowMount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

function intersect(element: Element, isIntersecting = true) {
  const callback = vi.mocked(IntersectionObserver).mock.calls.at(-1)![0]

  callback(
    [
      { target: element, isIntersecting } as IntersectionObserverEntry,
    ],
    IntersectionObserverMock as unknown as IntersectionObserver,
  )
}

async function runAnimation() {
  await vi.advanceTimersByTimeAsync(0)

  for (let index = 0; index < 30; index++) {
    await vi.advanceTimersByTimeAsync(20)
  }
}

function getValues(wrapper: ReturnType<typeof shallowMount>) {
  const [value, placeholder] = wrapper.findAll('.m-animated-counter__value')

  return {
    value: value.text(),
    placeholder: placeholder.text(),
  }
}

describe('given a MazAnimatedCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
    vi.mocked(IntersectionObserverMock.disconnect).mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it is rendered on the server', () => {
    it('then the final value reserves the width and is exposed to assistive technologies', async () => {
      const html = await renderToString(createSSRApp({
        render: () => h(MazAnimatedCounter, { count: 564, prefix: '$' }),
      }))

      const container = document.createElement('div')
      container.innerHTML = html
      const [value, placeholder] = container.querySelectorAll('.m-animated-counter__value')

      expect(container.querySelector('.maz\\:sr-only')?.textContent).toBe('$564')
      expect(value.textContent).toBe('$0')
      expect(placeholder.textContent).toBe('$564')
      expect(placeholder.classList.contains('maz:invisible')).toBe(true)
    })
  })

  describe('when it is mounted with a prefix and a suffix', () => {
    it('then the accessible value is the target and the visible values are hidden from assistive technologies', () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 10, prefix: '$', suffix: '%' },
      })

      expect(wrapper.find('.maz\\:sr-only').text()).toBe('$10%')
      expect(getValues(wrapper)).toEqual({ value: '$0%', placeholder: '$10%' })
      wrapper.findAll('.m-animated-counter__value').forEach(value => expect(value.attributes('aria-hidden')).toBe('true'))
    })
  })

  describe('when it is mounted outside the viewport', () => {
    it('then the animation does not start', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 100, delay: 0 },
      })

      await runAnimation()

      expect(getValues(wrapper).value).toBe('0')
      expect(IntersectionObserverMock.observe).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when it enters the viewport with once', () => {
    it('then the counter reaches the target and the element is no longer observed', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 100, duration: 200, delay: 0 },
      })

      intersect(wrapper.element)
      await runAnimation()

      expect(getValues(wrapper).value).toBe('100')
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when it enters the viewport again without once', () => {
    it('then the animation replays and the element stays observed', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: {
          count: 50,
          duration: 100,
          delay: 0,
          once: false,
        },
      })

      intersect(wrapper.element)
      await runAnimation()
      intersect(wrapper.element, false)
      intersect(wrapper.element)
      await vi.advanceTimersByTimeAsync(0)

      expect(Number(getValues(wrapper).value)).toBeLessThan(50)

      await runAnimation()

      expect(getValues(wrapper).value).toBe('50')
      expect(IntersectionObserverMock.unobserve).not.toHaveBeenCalled()
    })
  })

  describe('when the count changes after the animation played', () => {
    it('then the counter animates from the previous value', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 10, duration: 100, delay: 0 },
      })

      intersect(wrapper.element)
      await runAnimation()
      await wrapper.setProps({ count: 20 })

      expect(getValues(wrapper).value).toBe('10')

      await runAnimation()

      expect(getValues(wrapper)).toEqual({ value: '20', placeholder: '20' })
    })
  })

  describe('when the count changes before the element is visible', () => {
    it('then only the reserved width is updated', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 0, delay: 0 },
      })

      await wrapper.setProps({ count: 564 })
      await runAnimation()

      expect(getValues(wrapper)).toEqual({ value: '0', placeholder: '564' })
    })
  })

  describe('when the user prefers reduced motion', () => {
    it('then the target is displayed immediately', async () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        configurable: true,
        value: vi.fn().mockReturnValue({ matches: true }),
      })
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 42, delay: 500 },
      })

      intersect(wrapper.element)
      await wrapper.vm.$nextTick()

      expect(getValues(wrapper).value).toBe('42')
      Reflect.deleteProperty(globalThis, 'matchMedia')
    })
  })

  describe('when it is unmounted during the animation', () => {
    it('then the observer is disconnected and the animation stops', async () => {
      const wrapper = shallowMount(MazAnimatedCounter, {
        props: { count: 100, duration: 1000, delay: 0 },
      })

      intersect(wrapper.element)
      await vi.advanceTimersByTimeAsync(40)
      wrapper.unmount()

      expect(IntersectionObserverMock.disconnect).toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
