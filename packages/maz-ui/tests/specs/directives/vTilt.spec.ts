import { vTilt, vTiltInstall } from '@directives/vTilt.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FakeIntersectionObserver } from '../../helpers/intersection-observer.ts'
import { pointer, rect, stubMedia } from '../../helpers/media.ts'

enableAutoUnmount(afterEach)

function render(value: any) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h('div', 'Tilt'), [[vTilt, binding.value]]),
  }), { attachTo: document.body })

  rect(wrapper.element, { left: 0, top: 0, width: 200, height: 100 })

  return { wrapper, binding, element: wrapper.element as HTMLElement }
}

const variable = (element: HTMLElement, name: string) => Number.parseFloat(element.style.getPropertyValue(name))

describe('given the vTilt directive', () => {
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
        render: () => withDirectives(h('div', 'Tilt'), [[vTilt, true]]),
      }))

      expect(html).toBe('<div>Tilt</div>')
    })
  })

  describe('when it is mounted', () => {
    it('then the element is marked with the perspective', () => {
      const { element } = render({ perspective: 500 })

      expect(element.hasAttribute('data-maz-tilt')).toBe(true)
      expect(element.style.getPropertyValue('--maz-tilt-perspective')).toBe('500px')
    })

    it('then false turns the effect off', () => {
      const { element } = render(false)

      expect(element.hasAttribute('data-maz-tilt')).toBe(false)
    })
  })

  describe('when the pointer moves on the element', () => {
    it('then the element leans toward the pointer within the max angle', () => {
      const { element } = render({ max: 10 })

      element.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 0 }))
      vi.advanceTimersByTime(2000)

      expect(variable(element, '--maz-tilt-ry')).toBeCloseTo(10)
      expect(variable(element, '--maz-tilt-rx')).toBeCloseTo(10)
      expect(element.hasAttribute('data-maz-tilt-active')).toBe(true)
    })

    it('then the pointer leaving brings it back', () => {
      const { element } = render(true)

      element.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 0 }))
      vi.advanceTimersByTime(2000)
      element.dispatchEvent(pointer('pointerleave'))
      vi.advanceTimersByTime(4000)

      expect(variable(element, '--maz-tilt-ry')).toBeCloseTo(0)
      expect(element.hasAttribute('data-maz-tilt-active')).toBe(false)
    })

    it('then a touch pointer, reduced motion and an empty element do nothing', () => {
      const { element } = render(true)

      element.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 0, pointerType: 'touch' }))
      rect(element, { width: 0, height: 0 })
      element.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 0 }))
      rect(element, { width: 200, height: 100 })
      stubMedia({ reduced: true })
      element.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 0 }))
      vi.advanceTimersByTime(2000)

      expect(element.style.getPropertyValue('--maz-tilt-ry')).toBe('')
    })
  })

  describe('when the glare option is set', () => {
    it('then a glare layer is added and removed, and the element is positioned', () => {
      const { wrapper, element } = render({ glare: true })

      expect(element.querySelector('.m-tilt-glare')?.getAttribute('aria-hidden')).toBe('true')
      expect(element.style.position).toBe('relative')

      element.dispatchEvent(pointer('pointermove', { clientX: 100, clientY: 50 }))
      vi.advanceTimersByTime(2000)

      expect(element.style.getPropertyValue('--maz-tilt-gx')).toBe('50.0%')

      wrapper.unmount()

      expect(element.querySelector('.m-tilt-glare')).toBeNull()
      expect(element.style.position).toBe('')
    })
  })

  describe('when the float option is set', () => {
    it('then the element floats, and the floating pauses off screen', () => {
      const { element } = render({ float: 24 })

      expect(element.hasAttribute('data-maz-tilt-float')).toBe(true)
      expect(element.style.getPropertyValue('--maz-tilt-float-distance')).toBe('24px')

      FakeIntersectionObserver.last!.trigger(false)

      expect(element.hasAttribute('data-maz-tilt-idle')).toBe(true)

      FakeIntersectionObserver.last!.trigger(true)

      expect(element.hasAttribute('data-maz-tilt-idle')).toBe(false)
    })

    it('then true uses the default distance', () => {
      const { element } = render({ float: true })

      expect(element.style.getPropertyValue('--maz-tilt-float-distance')).toBe('')
    })
  })

  describe('when the global option is set', () => {
    it('then the whole page drives the tilt while the element is visible', () => {
      const { element } = render({ global: true, max: 10 })

      globalThis.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 0 }))
      vi.advanceTimersByTime(1000)

      expect(element.style.getPropertyValue('--maz-tilt-ry')).toBe('')

      FakeIntersectionObserver.last!.trigger(true)
      FakeIntersectionObserver.last!.trigger(true)
      globalThis.dispatchEvent(pointer('pointermove', { clientX: globalThis.innerWidth, clientY: globalThis.innerHeight }))
      vi.advanceTimersByTime(3000)

      expect(variable(element, '--maz-tilt-ry')).toBeCloseTo(10)
      expect(variable(element, '--maz-tilt-rx')).toBeCloseTo(-10)
    })

    it('then it rests when the pointer leaves the page, and ignores touch and reduced motion', () => {
      const { element } = render({ global: true, max: 10 })

      FakeIntersectionObserver.last!.trigger(true)
      globalThis.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 0, pointerType: 'touch' }))
      vi.advanceTimersByTime(1000)

      expect(element.style.getPropertyValue('--maz-tilt-ry')).toBe('')

      globalThis.dispatchEvent(pointer('pointermove', { clientX: globalThis.innerWidth, clientY: 0 }))
      vi.advanceTimersByTime(3000)
      document.documentElement.dispatchEvent(new Event('pointerleave'))
      vi.advanceTimersByTime(4000)

      expect(variable(element, '--maz-tilt-ry')).toBeCloseTo(0)

      stubMedia({ reduced: true })
      globalThis.dispatchEvent(pointer('pointermove', { clientX: globalThis.innerWidth, clientY: 0 }))
      vi.advanceTimersByTime(3000)

      expect(variable(element, '--maz-tilt-ry')).toBeCloseTo(0)
    })

    it('then leaving the screen stops the listening', () => {
      const { element } = render({ global: true })

      FakeIntersectionObserver.last!.trigger(true)
      FakeIntersectionObserver.last!.trigger(false)
      globalThis.dispatchEvent(pointer('pointermove', { clientX: globalThis.innerWidth, clientY: 0 }))
      vi.advanceTimersByTime(3000)

      expect(element.style.getPropertyValue('--maz-tilt-ry')).toBe('')
    })
  })

  describe('when the options change or the component is unmounted', () => {
    it('then the new options replace the old ones', async () => {
      const { element, binding } = render({ perspective: 500 })

      binding.value = { perspective: 900 }
      await nextTick()

      expect(element.style.getPropertyValue('--maz-tilt-perspective')).toBe('900px')
    })

    it('then identical options change nothing', async () => {
      const { element, binding } = render({ perspective: 500 })

      binding.value = { perspective: 500 }
      await nextTick()

      expect(element.style.getPropertyValue('--maz-tilt-perspective')).toBe('500px')
    })

    it('then everything is cleaned on unmount', () => {
      const { wrapper, element } = render({ float: true, global: true })

      wrapper.unmount()

      expect(element.hasAttribute('data-maz-tilt')).toBe(false)
      expect(element.hasAttribute('data-maz-tilt-float')).toBe(false)
      expect(element.style.getPropertyValue('--maz-tilt-perspective')).toBe('')
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as tilt', () => {
      const app = createApp({})

      app.use(vTiltInstall)

      expect(app.directive('tilt')).toBe(vTilt)
    })
  })
})
