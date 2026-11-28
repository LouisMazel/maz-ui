import { vReveal, vRevealInstall } from '@directives/vReveal.ts'
import { IntersectionObserverMock } from '@tests/vitest-global.setup.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'

enableAutoUnmount(afterEach)

function render(value: any) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h('p', 'Hello'), [[vReveal, binding.value]]),
  }))

  return { wrapper, binding }
}

describe('given the vReveal directive', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
  })

  describe('when it is rendered on the server', () => {
    it('then nothing is hidden nor marked', async () => {
      const html = await renderToString(createApp({
        render: () => withDirectives(h('p', 'Hello'), [[vReveal, 'slide-up']]),
      }))

      expect(html).toBe('<p>Hello</p>')
    })
  })

  describe('when it gets an effect name', () => {
    it('then the element is revealed with the effect and hidden until it is visible', () => {
      const { wrapper } = render('curtain-start')

      expect(wrapper.attributes('data-maz-reveal')).toBe('curtain-start')
      expect(wrapper.attributes('data-maz-reveal-state')).toBe('hidden')
      expect(IntersectionObserverMock.observe).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when it gets options', () => {
    it('then they are applied', () => {
      const { wrapper } = render({ effect: 'fade', delay: 300, stagger: 50 })

      expect(wrapper.attributes('data-maz-reveal')).toBe('fade')
      expect(wrapper.attributes('style')).toContain('--maz-reveal-delay: 300ms')
    })

    it('then no value gives the default effect', () => {
      const { wrapper } = render(undefined)

      expect(wrapper.attributes('data-maz-reveal')).toBe('slide-up')
    })
  })

  describe('when the options change', () => {
    it('then the effect is updated', async () => {
      const { wrapper, binding } = render('fade')
      binding.value = 'scale'
      await nextTick()

      expect(wrapper.attributes('data-maz-reveal')).toBe('scale')
    })

    it('then false turns the reveal off', async () => {
      const { wrapper, binding } = render('fade')
      binding.value = false
      await nextTick()

      expect(wrapper.attributes('data-maz-reveal')).toBeUndefined()
      expect(wrapper.attributes('data-maz-reveal-state')).toBeUndefined()
    })
  })

  describe('when the element is unmounted', () => {
    it('then it is no longer observed', () => {
      const { wrapper } = render('fade')
      wrapper.unmount()

      expect(IntersectionObserverMock.unobserve).toHaveBeenCalled()
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as reveal', () => {
      const app = createApp({})
      const spy = vi.spyOn(app, 'directive')
      app.use(vRevealInstall)

      expect(spy).toHaveBeenCalledWith('reveal', vReveal)
    })
  })
})
