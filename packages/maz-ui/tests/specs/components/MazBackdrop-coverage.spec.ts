import MazBackdrop from '@components/MazBackdrop.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { addOverlayLayer, isInUpperOverlayLayer, removeOverlayLayer } from '@/utils/overlayLayers.ts'

const wrappers: ReturnType<typeof mount>[] = []

function getWrapper(props: Record<string, unknown> = {}, slot: string | undefined = '<div class="panel">Panel</div>') {
  const wrapper = mount(MazBackdrop, {
    props: { modelValue: false, growFromOrigin: true, origin: { x: 100, y: 100 }, ...props },
    slots: slot ? { default: slot } : {},
    attachTo: document.body,
    global: { stubs: { transition: false, teleport: false } },
  })
  wrappers.push(wrapper)

  return wrapper
}

function mockTransitionDuration(value: string) {
  const original = globalThis.getComputedStyle.bind(globalThis)

  vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
    const style = original(element, pseudo)

    if (element.classList.contains('m-backdrop')) {
      return new Proxy(style, {
        get: (target, key) => key === 'transitionDuration' ? value : Reflect.get(target, key) as unknown,
      })
    }

    return style
  })
}

describe('given a backdrop transition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Element.prototype.animate = vi.fn(() => {
      return {
        oncancel: null,
        cancel: vi.fn(),
        get onfinish() {
          return null
        },
        set onfinish(callback: (() => void) | null) {
          setTimeout(() => callback?.(), 10)
        },
      }
    }) as unknown as typeof Element.prototype.animate
  })

  afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when the fade has a duration in seconds and in milliseconds', () => {
    it('then the enter waits for the longest duration', async () => {
      mockTransitionDuration('0.2s, 150ms, nope')
      const timeoutSpy = vi.spyOn(globalThis, 'setTimeout')
      const wrapper = getWrapper()

      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(timeoutSpy.mock.calls.some(([, delay]) => delay === 200)).toBe(true)

      await vi.advanceTimersByTimeAsync(300)
      await flushPromises()

      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when there is no panel in the content', () => {
    it('then the transition only waits for the fade', async () => {
      mockTransitionDuration('100ms')
      const wrapper = getWrapper({}, '')

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await vi.advanceTimersByTimeAsync(200)
      await flushPromises()

      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when there is no fade and no panel', () => {
    it('then the transition ends at once', async () => {
      mockTransitionDuration('0s')
      const wrapper = getWrapper({}, '')

      await wrapper.setProps({ modelValue: true })
      await nextTick()
      await vi.advanceTimersByTimeAsync(100)
      await flushPromises()

      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })
})

describe('given an open backdrop', () => {
  afterEach(() => {
    wrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    document.documentElement.className = ''
    document.documentElement.removeAttribute('style')
    vi.restoreAllMocks()
  })

  describe('when it is the lower layer', () => {
    it('then its content is detected as an upper overlay for the layers below', async () => {
      const lower = { contains: () => false }
      addOverlayLayer(lower)

      const wrapper = getWrapper({ modelValue: true, growFromOrigin: false })
      await nextTick()

      const inside = document.querySelector('.panel') as Node
      const outside = document.body

      expect(isInUpperOverlayLayer(lower, inside)).toBe(true)
      expect(isInUpperOverlayLayer(lower, outside)).toBe(false)

      wrapper.unmount()
      wrappers.length = 0
      removeOverlayLayer(lower)
    })
  })

  describe('when the page has no scrollbar', () => {
    it('then no scrollbar compensation is set', async () => {
      Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: globalThis.innerWidth })

      getWrapper({ modelValue: true, growFromOrigin: false })
      await nextTick()

      expect(document.documentElement.classList.contains('--has-scrollbar')).toBe(false)
      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(true)

      delete (document.documentElement as Partial<HTMLElement>).clientWidth
    })
  })

  describe('when the page has a scrollbar', () => {
    it('then its width is exposed', async () => {
      Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: globalThis.innerWidth - 15 })

      getWrapper({ modelValue: true, growFromOrigin: false })
      await nextTick()

      expect(document.documentElement.classList.contains('--has-scrollbar')).toBe(true)
      expect(document.documentElement.style.getPropertyValue('--scrollbar-width')).toBe('15px')

      delete (document.documentElement as Partial<HTMLElement>).clientWidth
    })
  })

  describe('when removing the listeners fails', () => {
    it('then a warning is logged and the unmount goes on', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = getWrapper({ modelValue: true, growFromOrigin: false })
      await nextTick()

      const original = globalThis.removeEventListener.bind(globalThis)
      vi.spyOn(globalThis, 'removeEventListener').mockImplementation((type: string, ...rest: [unknown, unknown?]) => {
        if (type === 'keydown')
          throw new Error('fail')

        return (original as (...args: unknown[]) => void)(type, ...rest)
      })

      wrapper.unmount()
      wrappers.length = 0

      expect(warn).toHaveBeenCalledWith('Error removing event listeners:', expect.any(Error))
    })
  })
})
