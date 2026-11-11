import MazExpandAnimation from '@components/MazExpandAnimation.vue'
import { mount, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('mazExpandAnimation', () => {
  it('renders with default props', () => {
    const wrapper = shallowMount(MazExpandAnimation)

    // Vérifier que le composant est rendu avec la classe par défaut
    expect(wrapper.classes()).toContain('m-expand-animation')
    // Vérifier que le composant n'est pas étendu initialement
    expect(wrapper.classes()).not.toContain('m-expand-animation--expanded')
    // Vérifier que le composant a le rôle "region"
    expect(wrapper.attributes('role')).toBe('region')
    // Vérifier que le composant est accessible
    expect(wrapper.attributes('aria-hidden')).toBe('true')

    // Vérifier que le contenu par défaut est rendu
    expect(wrapper.text()).toBe('')
  })

  it('expands when isOpen model is true', () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      props: {
        modelValue: true,
      },
    })

    // Vérifier que le composant est étendu lorsque isOpen est vrai
    expect(wrapper.classes()).toContain('m-expand-animation--expanded')
    // Vérifier que le composant est visible pour les lecteurs d'écran
    expect(wrapper.attributes('aria-hidden')).toBe('false')
  })

  it('collapses when isOpen model is false', () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      props: {
        modelValue: false,
      },
    })

    // Vérifier que le composant n'est pas étendu lorsque isOpen est faux
    expect(wrapper.classes()).not.toContain('m-expand-animation--expanded')
    // Vérifier que le composant est masqué pour les lecteurs d'écran
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('renders content in slot', () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      slots: {
        default: '<div>Content in slot</div>',
      },
    })

    // Vérifier que le contenu rendu dans la fente est présent
    expect(wrapper.text()).toContain('Content in slot')
  })

  it('content has overflow hidden only if closed', () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      props: {
        modelValue: true,
      },
      slots: {
        default: '<div>Content in slot</div>',
      },
    })

    expect(wrapper.find('.m-expand-animation__inner').classes('--overflow-hidden')).toBe(false)

    const wrapper2 = shallowMount(MazExpandAnimation, {
      props: {
        modelValue: false,
      },
      slots: {
        default: '<div>Content in slot</div>',
      },
    })

    expect(wrapper2.find('.m-expand-animation__inner').classes('--overflow-hidden')).toBe(true)
  })

  it('applies the duration and timing-function CSS variables from props', () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      props: {
        duration: '500ms',
        timingFunction: 'ease-out',
      },
    })

    const style = wrapper.attributes('style')
    expect(style).toContain('--expand-animation-duration: 500ms')
    expect(style).toContain('--expand-animation-timing-function: ease-out')
  })

  it('toggles overflow on transitionstart and transitionend events', async () => {
    const wrapper = mount(MazExpandAnimation, {
      attachTo: document.body,
      props: { modelValue: true },
      slots: { default: '<div>x</div>' },
    })
    await nextTick()

    const root = wrapper.find('.m-expand-animation').element
    const inner = wrapper.find('.m-expand-animation__inner')

    expect(inner.classes('--overflow-hidden')).toBe(false)

    await wrapper.setProps({ modelValue: false })
    root.dispatchEvent(new Event('transitionstart'))
    await nextTick()
    expect(inner.classes('--overflow-hidden')).toBe(true)

    await wrapper.setProps({ modelValue: true })
    root.dispatchEvent(new Event('transitionend'))
    await nextTick()
    expect(inner.classes('--overflow-hidden')).toBe(false)

    wrapper.unmount()
  })

  it('unmounts cleanly after transition listeners were attached', () => {
    const wrapper = mount(MazExpandAnimation, {
      attachTo: document.body,
      props: { modelValue: false },
    })
    expect(() => wrapper.unmount()).not.toThrow()
  })
})

describe('given MazExpandAnimation with the lazy prop', () => {
  describe('when it is closed at mount', () => {
    it('then the content is not rendered', () => {
      const wrapper = mount(MazExpandAnimation, {
        props: { modelValue: false, lazy: true },
        slots: { default: '<p class="content">x</p>' },
      })

      expect(wrapper.find('.content').exists()).toBe(false)
      expect(wrapper.find('.m-expand-animation__inner').exists()).toBe(true)
    })
  })

  describe('when it is open at mount', () => {
    it('then the content is rendered', () => {
      const wrapper = mount(MazExpandAnimation, {
        props: { modelValue: true, lazy: true },
        slots: { default: '<p class="content">x</p>' },
      })

      expect(wrapper.find('.content').exists()).toBe(true)
    })
  })

  describe('when it is opened then closed', () => {
    it('then the content is rendered at the opening and kept after the closing', async () => {
      const wrapper = mount(MazExpandAnimation, {
        props: { modelValue: false, lazy: true },
        slots: { default: '<p class="content">x</p>' },
      })

      await wrapper.setProps({ modelValue: true })
      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-expand-animation--expanded')

      await wrapper.setProps({ modelValue: false })
      expect(wrapper.find('.content').exists()).toBe(true)
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when lazy is not set and it is closed', () => {
    it('then the content is rendered', () => {
      const wrapper = mount(MazExpandAnimation, {
        props: { modelValue: false },
        slots: { default: '<p class="content">x</p>' },
      })

      expect(wrapper.find('.content').exists()).toBe(true)
    })
  })
})
