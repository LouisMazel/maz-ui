import MazExpandAnimation from '@components/MazExpandAnimation.vue'
import { shallowMount } from '@vue/test-utils'

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
})
