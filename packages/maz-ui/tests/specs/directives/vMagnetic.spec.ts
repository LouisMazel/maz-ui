import { vMagnetic, vMagneticInstall } from '@directives/vMagnetic.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FakeIntersectionObserver } from '../../helpers/intersection-observer.ts'
import { pointer, rect, stubMedia } from '../../helpers/media.ts'

enableAutoUnmount(afterEach)

function render(value: any) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h('button', 'Magnetic'), [[vMagnetic, binding.value]]),
  }), { attachTo: document.body })

  rect(wrapper.element, { left: 100, top: 100, width: 100, height: 40 })

  return { wrapper, binding, element: wrapper.element as HTMLElement }
}

function move(clientX: number, clientY: number, pointerType = 'mouse') {
  globalThis.dispatchEvent(pointer('pointermove', { clientX, clientY, pointerType }))
}

describe('given the vMagnetic directive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubMedia()
    FakeIntersectionObserver.instances.length = 0
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('when it is rendered on the server', () => {
    it('then nothing is added to the markup', async () => {
      const html = await renderToString(createApp({
        render: () => withDirectives(h('button', 'Magnetic'), [[vMagnetic, true]]),
      }))

      expect(html).toBe('<button>Magnetic</button>')
    })
  })

  describe('when the element is visible and the pointer approaches', () => {
    it('then it leans toward the pointer, then settles', () => {
      const { element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      move(250, 120)
      vi.advanceTimersByTime(1000)

      const [x, y = '0'] = element.style.translate.split(' ')

      expect(Number.parseFloat(x!)).toBeCloseTo((250 - 150) * 0.3, 0)
      expect(Number.parseFloat(y)).toBeCloseTo(0, 0)
    })

    it('then strength and radius are used', () => {
      const { element } = render({ strength: 0.5, radius: 20 })

      FakeIntersectionObserver.last!.trigger(true)
      move(250, 120)
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).toBe('')

      move(215, 120)
      vi.advanceTimersByTime(1000)

      expect(Number.parseFloat(element.style.translate)).toBeCloseTo(32.5, 0)
    })

    it('then it springs back when the pointer goes away', () => {
      const { element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      move(160, 120)
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).not.toBe('')

      move(900, 900)
      vi.advanceTimersByTime(2000)

      expect(element.style.translate).toBe('')
    })

    it('then it springs back when the pointer leaves the page', () => {
      const { element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      move(160, 120)
      vi.advanceTimersByTime(1000)
      document.documentElement.dispatchEvent(new Event('pointerleave'))
      vi.advanceTimersByTime(2000)

      expect(element.style.translate).toBe('')
    })

    it('then a touch pointer and reduced motion do not move it', () => {
      const { element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      move(160, 120, 'touch')
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).toBe('')

      stubMedia({ reduced: true })
      move(160, 120)
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).toBe('')
    })
  })

  describe('when the element is not visible', () => {
    it('then the pointer is not listened to', () => {
      const { element } = render(undefined)

      move(160, 120)
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).toBe('')
    })

    it('then leaving the screen stops the listening and resets the element', () => {
      const { element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      FakeIntersectionObserver.last!.trigger(true)
      move(160, 120)
      vi.advanceTimersByTime(1000)
      FakeIntersectionObserver.last!.trigger(false)

      expect(element.style.translate).toBe('')

      move(160, 120)
      vi.advanceTimersByTime(1000)

      expect(element.style.translate).toBe('')
    })
  })

  describe('when the device cannot hover or the effect is off', () => {
    it('then nothing is observed', () => {
      stubMedia({ hover: false })
      render(undefined)

      expect(FakeIntersectionObserver.instances).toHaveLength(0)
    })

    it('then false turns the effect off', () => {
      render(false)

      expect(FakeIntersectionObserver.instances).toHaveLength(0)
    })
  })

  describe('when the options change', () => {
    it('then the effect is set up again', async () => {
      const { binding } = render({ strength: 0.2 })

      binding.value = { strength: 0.4 }
      await nextTick()

      expect(FakeIntersectionObserver.instances.length).toBeGreaterThan(0)
    })

    it('then identical options change nothing', async () => {
      const { binding } = render({ strength: 0.2 })
      const count = FakeIntersectionObserver.instances.length

      binding.value = { strength: 0.2 }
      await nextTick()

      expect(FakeIntersectionObserver.instances).toHaveLength(count)
    })
  })

  describe('when the component is unmounted', () => {
    it('then the listener is removed and the translation is cleared', () => {
      const { wrapper, element } = render(undefined)

      FakeIntersectionObserver.last!.trigger(true)
      move(160, 120)
      vi.advanceTimersByTime(1000)
      wrapper.unmount()

      expect(element.style.translate).toBe('')
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as magnetic', () => {
      const app = createApp({})

      app.use(vMagneticInstall)

      expect(app.directive('magnetic')).toBe(vMagnetic)
    })
  })
})
