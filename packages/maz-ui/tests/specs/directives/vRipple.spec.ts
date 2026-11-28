import { vRipple, vRippleInstall } from '@directives/vRipple.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { pointer, rect, stubMedia } from '../../helpers/media.ts'

enableAutoUnmount(afterEach)

function render(value: any) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h('button', 'Ripple'), [[vRipple, binding.value]]),
  }), { attachTo: document.body })

  rect(wrapper.element, { width: 100, height: 40 })

  return { wrapper, binding, element: wrapper.element as HTMLElement }
}

const state = (element: HTMLElement) => element.getAttribute('data-maz-ripple-state')

describe('given the vRipple directive', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubMedia()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('when it is rendered on the server', () => {
    it('then nothing is added to the markup', async () => {
      const html = await renderToString(createApp({
        render: () => withDirectives(h('button', 'Ripple'), [[vRipple, undefined]]),
      }))

      expect(html).toBe('<button>Ripple</button>')
    })
  })

  describe('given the hover mode', () => {
    describe('when the pointer enters', () => {
      it('then the fill starts from the entry point and covers the farthest corner', () => {
        const { element } = render(undefined)

        element.dispatchEvent(pointer('pointerenter', { clientX: 20, clientY: 10 }))

        expect(element.getAttribute('data-maz-ripple')).toBe('hover')
        expect(state(element)).toBe('in')
        expect(element.style.getPropertyValue('--maz-ripple-x')).toBe('20px')
        expect(element.style.getPropertyValue('--maz-ripple-y')).toBe('10px')
        expect(Number.parseFloat(element.style.getPropertyValue('--maz-ripple-size'))).toBeCloseTo(Math.hypot(80, 30))
      })

      it('then a touch pointer does nothing', () => {
        const { element } = render(undefined)

        element.dispatchEvent(pointer('pointerenter', { pointerType: 'touch' }))

        expect(state(element)).toBeNull()
      })

      it('then nothing happens on a screen that cannot hover', () => {
        stubMedia({ hover: false })
        const { element } = render(undefined)

        element.dispatchEvent(pointer('pointerenter'))

        expect(state(element)).toBeNull()
      })

      it('then nothing happens with reduced motion', () => {
        stubMedia({ reduced: true })
        const { element } = render(undefined)

        element.dispatchEvent(pointer('pointerenter'))

        expect(state(element)).toBeNull()
      })
    })

    describe('when the pointer leaves', () => {
      it('then the fill empties toward the exit point, then the state is cleared', () => {
        const { element } = render('hover')

        element.dispatchEvent(pointer('pointerenter', { clientX: 0, clientY: 0 }))
        element.dispatchEvent(pointer('pointerleave', { clientX: 100, clientY: 40 }))

        expect(state(element)).toBe('out')
        expect(element.style.getPropertyValue('--maz-ripple-out-x')).toBe('100px')
        expect(element.style.getPropertyValue('--maz-ripple-out-y')).toBe('40px')

        vi.advanceTimersByTime(400)

        expect(state(element)).toBeNull()
      })

      it('then leaving without a fill does nothing', () => {
        const { element } = render(undefined)

        element.dispatchEvent(pointer('pointerleave'))

        expect(state(element)).toBeNull()
      })
    })
  })

  describe('given the click mode', () => {
    describe('when the pointer is pressed', () => {
      it('then a wave starts from the point, then is cleared', () => {
        const { element } = render('click')

        element.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 20 }))

        expect(state(element)).toBe('wave')
        expect(element.style.getPropertyValue('--maz-ripple-x')).toBe('50px')

        vi.advanceTimersByTime(400)

        expect(state(element)).toBeNull()
      })

      it('then nothing happens with reduced motion', () => {
        stubMedia({ reduced: true })
        const { element } = render({ mode: 'click' })

        element.dispatchEvent(pointer('pointerdown'))
        element.dispatchEvent(new MouseEvent('click', { detail: 0 }))

        expect(state(element)).toBeNull()
      })
    })

    describe('when the keyboard clicks', () => {
      it('then the wave starts from the center', () => {
        const { element } = render({ mode: 'click' })

        element.dispatchEvent(new MouseEvent('click', { detail: 0 }))

        expect(element.style.getPropertyValue('--maz-ripple-x')).toBe('50px')
        expect(element.style.getPropertyValue('--maz-ripple-y')).toBe('20px')
      })

      it('then a pointer click does not start a second wave', () => {
        const { element } = render({ mode: 'click' })

        element.dispatchEvent(new MouseEvent('click', { detail: 1 }))

        expect(state(element)).toBeNull()
      })
    })
  })

  describe('when options are given', () => {
    it('then the color, the opacity and the duration are set', () => {
      const { element } = render({ color: 'red', opacity: 0.3, duration: 500 })

      expect(element.style.getPropertyValue('--maz-ripple-color')).toBe('red')
      expect(element.style.getPropertyValue('--maz-ripple-opacity')).toBe('0.3')
      expect(element.style.getPropertyValue('--maz-ripple-duration')).toBe('500ms')
    })

    it('then false turns the effect off', () => {
      const { element } = render(false)

      expect(element.getAttribute('data-maz-ripple')).toBeNull()
    })
  })

  describe('when the options change', () => {
    it('then the mode is applied again', async () => {
      const { element, binding } = render('hover')

      binding.value = 'click'
      await nextTick()

      expect(element.getAttribute('data-maz-ripple')).toBe('click')
    })

    it('then identical options change nothing', async () => {
      const { element, binding } = render({ mode: 'click' })

      binding.value = { mode: 'click' }
      await nextTick()

      expect(element.getAttribute('data-maz-ripple')).toBe('click')
    })
  })

  describe('when the element is static and then unmounted', () => {
    it('then it is positioned meanwhile and everything is restored', () => {
      const { wrapper, element } = render(undefined)

      expect(element.style.position).toBe('relative')

      element.dispatchEvent(pointer('pointerenter'))
      wrapper.unmount()

      expect(element.style.position).toBe('')
      expect(element.getAttribute('data-maz-ripple')).toBeNull()
      expect(element.style.getPropertyValue('--maz-ripple-x')).toBe('')
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as ripple', () => {
      const app = createApp({})

      app.use(vRippleInstall)

      expect(app.directive('ripple')).toBe(vRipple)
    })
  })
})
