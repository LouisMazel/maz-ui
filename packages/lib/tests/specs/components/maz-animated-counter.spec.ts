import { shallowMount, type VueWrapper } from '@vue/test-utils'
import MazAnimatedCounter from '@components/MazAnimatedCounter.vue'

describe('MazAnimatedCounter', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazAnimatedCounter>>

  beforeEach(() => {
    wrapper = shallowMount(MazAnimatedCounter, {
      props: {
        count: 0,
      },
    })
  })

  test('renders initial count with prefix and suffix', async () => {
    await wrapper.setProps({ count: 10, prefix: '$' })

    // Vérifier que le texte initial rendu contient le préfixe, le compteur et le suffixe
    expect(wrapper.text()).toContain('$10')

    // Attendre la fin de l'animation initiale
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Vérifier que l'animation a eu lieu
    expect(wrapper.find('.m-animated-counter.--animated').exists()).toBe(true)
  })

  test('updates count and triggers animation', async () => {
    await wrapper.setProps({ count: 10, suffix: '%' })

    // Vérifier que le texte initial rendu contient le préfixe, le compteur et le suffixe
    expect(wrapper.text()).toContain('10%')

    // Mettre à jour le compteur
    await wrapper.setProps({ count: 20 })

    // Attendre la fin de l'animation de mise à jour
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Vérifier que le texte mis à jour rendu contient le préfixe, le nouveau compteur et le suffixe
    expect(wrapper.text()).toContain('20')

    // Vérifier que l'animation de mise à jour a eu lieu
    expect(wrapper.find('.m-animated-counter.--animated').exists()).toBe(true)
  })
})
