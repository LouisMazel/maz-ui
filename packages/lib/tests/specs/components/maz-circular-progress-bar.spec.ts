import { type VueWrapper, mount } from '@vue/test-utils'
import MazCircularProgressBar from '@components/MazCircularProgressBar.vue'

describe('mazCircularProgressBar', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazCircularProgressBar>>

  beforeEach(() => {
    wrapper = mount(MazCircularProgressBar, {
      props: {
        percentage: 50,
      },
    })
  })

  it('renders progress bar with default values', async () => {
    // Vérifier que le pourcentage initial est correct
    expect(wrapper.text()).toContain('50')
  })

  it('updates percentage and triggers animation', async () => {
    await wrapper.setProps({ suffix: '%' })
    // Vérifier que le pourcentage initial est correct
    expect(wrapper.find('.maz-sr-only').text()).toContain('50 %')

    // Mettre à jour le pourcentage
    await wrapper.setProps({ percentage: 75 })

    // Attendre la fin de l'animation de mise à jour
    await new Promise(resolve => setTimeout(resolve, 100))

    // Vérifier que le texte mis à jour rendu contient le nouveau pourcentage
    expect(wrapper.text()).toContain('75 %')
  })

  it('renders with auto color', async () => {
    await wrapper.setProps({
      percentage: 25,
      autoColor: true,
    })

    // Vérifier que la classe de couleur est correcte pour le pourcentage initial
    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-danger')

    await wrapper.setProps({
      percentage: 50,
      autoColor: true,
    })

    // Vérifier que la classe de couleur est correcte pour le pourcentage initial
    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-warning')

    await wrapper.setProps({
      percentage: 100,
      autoColor: true,
    })

    // Vérifier que la classe de couleur est correcte pour le pourcentage initial
    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-color-success')
  })
})
