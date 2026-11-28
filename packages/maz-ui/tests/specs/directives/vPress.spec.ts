import { vPress, vPressInstall } from '@directives/vPress.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createApp, defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import { renderToString } from 'vue/server-renderer'

enableAutoUnmount(afterEach)

function render(value: any, tag = 'button', props: Record<string, unknown> = {}) {
  const binding = ref(value)
  const wrapper = mount(defineComponent({
    render: () => withDirectives(h(tag, props, 'Press'), [[vPress, binding.value]]),
  }))

  return { wrapper, binding }
}

describe('given the vPress directive', () => {
  describe('when it is rendered on the server', () => {
    it('then nothing is added to the markup', async () => {
      const html = await renderToString(createApp({
        render: () => withDirectives(h('button', 'Press'), [[vPress, true]]),
      }))

      expect(html).toBe('<button>Press</button>')
    })
  })

  describe('when it is mounted', () => {
    it('then the element is marked with the default scale', () => {
      const { wrapper } = render(undefined)

      expect(wrapper.attributes('data-maz-press')).toBe('')
      expect(wrapper.element.style.getPropertyValue('--maz-press-scale')).toBe('0.97')
    })

    it('then the scale option is used', () => {
      const { wrapper } = render({ scale: 0.9 })

      expect(wrapper.element.style.getPropertyValue('--maz-press-scale')).toBe('0.9')
    })

    it('then false turns the feedback off', () => {
      const { wrapper } = render(false)

      expect(wrapper.attributes('data-maz-press')).toBeUndefined()
    })
  })

  describe('when the pointer presses and releases', () => {
    it('then the element is pressed, then released', async () => {
      const { wrapper } = render(true)

      await wrapper.trigger('pointerdown')

      expect(wrapper.attributes('data-maz-pressed')).toBe('')

      await wrapper.trigger('pointerup')

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
    })

    it('then leaving, cancelling or blurring releases it', async () => {
      const { wrapper } = render(true)

      for (const type of ['pointerleave', 'pointercancel', 'blur']) {
        await wrapper.trigger('pointerdown')
        await wrapper.trigger(type)

        expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
      }
    })
  })

  describe('when the keyboard presses', () => {
    it('then Enter and Space press and their release lifts, other keys do nothing', async () => {
      const { wrapper } = render(true)

      await wrapper.trigger('keydown', { key: 'a' })

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()

      await wrapper.trigger('keydown', { key: ' ' })

      expect(wrapper.attributes('data-maz-pressed')).toBe('')

      await wrapper.trigger('keyup', { key: 'a' })

      expect(wrapper.attributes('data-maz-pressed')).toBe('')

      await wrapper.trigger('keyup', { key: ' ' })

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
    })

    it('then a repeated key does not press again', async () => {
      const { wrapper } = render(true)

      await wrapper.trigger('keydown', { key: 'Enter', repeat: true })

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
    })
  })

  describe('when the element is disabled', () => {
    it('then a disabled button does not press', async () => {
      const { wrapper } = render(true, 'button', { disabled: true })

      await wrapper.trigger('pointerdown')

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
    })

    it('then an aria-disabled element does not press', async () => {
      const { wrapper } = render(true, 'div', { 'aria-disabled': 'true' })

      await wrapper.trigger('pointerdown')

      expect(wrapper.attributes('data-maz-pressed')).toBeUndefined()
    })
  })

  describe('when the options change', () => {
    it('then the new scale is applied', async () => {
      const { wrapper, binding } = render({ scale: 0.9 })

      binding.value = { scale: 0.8 }
      await nextTick()

      expect(wrapper.element.style.getPropertyValue('--maz-press-scale')).toBe('0.8')
    })

    it('then the same options keep the listeners', async () => {
      const { wrapper, binding } = render({ scale: 0.9 })

      binding.value = { scale: 0.9 }
      await nextTick()

      expect(wrapper.element.style.getPropertyValue('--maz-press-scale')).toBe('0.9')
    })

    it('then the feedback is removed when it is set to false', async () => {
      const { wrapper, binding } = render(true)

      binding.value = false
      await nextTick()

      expect(wrapper.attributes('data-maz-press')).toBeUndefined()
    })
  })

  describe('when the component is unmounted', () => {
    it('then the listeners are removed', () => {
      const { wrapper } = render(true)
      const element = wrapper.element

      wrapper.unmount()
      element.dispatchEvent(new Event('pointerdown'))

      expect(element.getAttribute('data-maz-pressed')).toBeNull()
      expect(element.getAttribute('data-maz-press')).toBeNull()
    })
  })

  describe('when the plugin is installed', () => {
    it('then the directive is registered as press', () => {
      const app = createApp({})

      app.use(vPressInstall)

      expect(app.directive('press')).toBe(vPress)
    })
  })
})
