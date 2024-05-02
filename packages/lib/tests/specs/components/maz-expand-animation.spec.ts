import { shallowMount } from '@vue/test-utils'
import MazExpandAnimation from '@components/MazExpandAnimation.vue'

describe('MazExpandAnimation', () => {
  it('renders with default props', async () => {
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

  it('expands when isOpen model is true', async () => {
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

  it('collapses when isOpen model is false', async () => {
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

  it('renders content in slot', async () => {
    const wrapper = shallowMount(MazExpandAnimation, {
      slots: {
        default: '<div>Content in slot</div>',
      },
    })

    // Vérifier que le contenu rendu dans la fente est présent
    expect(wrapper.text()).toContain('Content in slot')
  })
})
