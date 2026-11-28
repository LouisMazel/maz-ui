import { vDraw, vDrawInstall } from '@directives/vDraw.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FakeIntersectionObserver } from '../../helpers/intersection-observer.ts'
import { stubMedia } from '../../helpers/media.ts'

enableAutoUnmount(afterEach)

function render(value: any, withStroke = true) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h('svg', { viewBox: '0 0 10 10' }, [
      h('path', { d: 'M0 0L10 10', stroke: withStroke ? 'currentColor' : 'none' }),
      h('circle', { cx: 5, cy: 5, r: 2, stroke: 'currentColor' }),
    ]), [[vDraw, binding.value]]),
  }), { attachTo: document.body })

  return { wrapper, binding, element: wrapper.element as unknown as HTMLElement }
}

const state = (element: HTMLElement) => element.getAttribute('data-maz-draw-state')

describe('given the vDraw directive', () => {
  beforeEach(() => {
    stubMedia()
    FakeIntersectionObserver.instances.length = 0
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    Object.defineProperty(SVGElement.prototype, 'getTotalLength', { value: () => 14.2, configurable: true })
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element) => ({ stroke: element.getAttribute('stroke') ?? 'none' }) as CSSStyleDeclaration)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete (SVGElement.prototype as { getTotalLength?: unknown }).getTotalLength
  })

  describe('when it is rendered on the server', () => {
    it('then nothing is added to the markup', async () => {
      const html = await renderToString(createApp({
        render: () => withDirectives(h('svg', [h('path', { d: 'M0 0' })]), [[vDraw, true]]),
      }))

      expect(html).toBe('<svg><path d="M0 0"></path></svg>')
    })
  })

  describe('when it is mounted', () => {
    it('then the stroked shapes are measured and hidden until the SVG enters the screen', () => {
      const { element } = render(undefined)
      const strokes = element.querySelectorAll('[data-maz-draw-stroke]')

      expect(strokes).toHaveLength(2)
      expect((strokes[0] as SVGElement).style.getPropertyValue('--maz-draw-length')).toBe('15')
      expect((strokes[1] as SVGElement).style.getPropertyValue('--maz-i')).toBe('1')
      expect(state(element)).toBe('hidden')
    })

    it('then a shape without stroke is skipped', () => {
      const { element } = render(true, false)

      expect(element.querySelectorAll('[data-maz-draw-stroke]')).toHaveLength(1)
    })

    it('then an SVG without any stroke is left alone', () => {
      const wrapper = mount(defineComponent({
        render: () => withDirectives(h('svg', [h('path', { d: 'M0 0', stroke: 'none' })]), [[vDraw, true]]),
      }))

      expect(wrapper.attributes('data-maz-draw-state')).toBeUndefined()
    })

    it('then a stroked shape is drawn itself', () => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

      path.setAttribute('stroke', 'red')
      ;(vDraw as { mounted: (element: Element, binding: unknown) => void }).mounted(path, { value: true })

      expect(path.hasAttribute('data-maz-draw-stroke')).toBe(true)

      ;(vDraw as { unmounted: (element: Element) => void }).unmounted(path)
    })

    it('then false and reduced motion turn the effect off', () => {
      expect(state(render(false).element)).toBeNull()

      stubMedia({ reduced: true })

      expect(state(render(true).element)).toBeNull()
    })
  })

  describe('when the SVG enters the screen', () => {
    it('then it draws, once', () => {
      const { element } = render({ stagger: 200, duration: 900, delay: 100 })

      expect(element.style.getPropertyValue('--maz-draw-stagger')).toBe('200ms')
      expect(element.style.getPropertyValue('--maz-draw-duration')).toBe('900ms')
      expect(element.style.getPropertyValue('--maz-draw-delay')).toBe('100ms')

      FakeIntersectionObserver.last!.trigger(true)

      expect(state(element)).toBe('in')
      expect(FakeIntersectionObserver.last!.elements.size).toBe(0)
    })

    it('then with once false it erases when it leaves', () => {
      const { element } = render({ once: false })

      FakeIntersectionObserver.last!.trigger(true)

      expect(state(element)).toBe('in')

      FakeIntersectionObserver.last!.trigger(false)

      expect(state(element)).toBe('hidden')
    })
  })

  describe('when the mode is scroll', () => {
    it('then the drawing is linked to the scroll where the browser supports it', () => {
      vi.stubGlobal('CSS', { supports: () => true })
      const { element } = render('scroll')

      expect(element.getAttribute('data-maz-draw-mode')).toBe('scroll')
      expect(state(element)).toBeNull()
    })

    it('then the entry mode is the fallback', () => {
      vi.stubGlobal('CSS', { supports: () => false })
      const { element } = render({ mode: 'scroll' })

      expect(state(element)).toBe('hidden')
    })

    it('then the entry mode is the fallback without CSS.supports', () => {
      vi.stubGlobal('CSS', undefined)
      const { element } = render('scroll')

      expect(state(element)).toBe('hidden')
    })
  })

  describe('when the options change or the component is unmounted', () => {
    it('then the new options are applied', async () => {
      const { element, binding } = render({ stagger: 100 })

      binding.value = { stagger: 300 }
      await nextTick()

      expect(element.style.getPropertyValue('--maz-draw-stagger')).toBe('300ms')
    })

    it('then identical options change nothing', async () => {
      const { element, binding } = render({ stagger: 100 })

      binding.value = { stagger: 100 }
      await nextTick()

      expect(element.style.getPropertyValue('--maz-draw-stagger')).toBe('100ms')
    })

    it('then everything is cleaned on unmount', () => {
      const { wrapper, element } = render(true)
      const stroke = element.querySelector('path')!

      wrapper.unmount()

      expect(state(element)).toBeNull()
      expect(stroke.hasAttribute('data-maz-draw-stroke')).toBe(false)
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as draw', () => {
      const app = createApp({})

      app.use(vDrawInstall)

      expect(app.directive('draw')).toBe(vDraw)
    })
  })
})
