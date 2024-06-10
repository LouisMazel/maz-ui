import { mount } from '@vue/test-utils'
import MazFullscreenLoader from '@components/MazFullscreenLoader.vue'
import MazSpinner from '@components/MazSpinner.vue' // Assurez-vous d'importer correctement le composant MazSpinner

describe('mazFullscreenLoader.vue', () => {
  it('display the spinner with good properties', async () => {
    const color = 'secondary'
    const size = '2em'

    const wrapper = mount(MazFullscreenLoader, {
      props: { color, size },
      slots: {
        default: 'Contenu personnalisé',
      },
    })

    await vi.dynamicImportSettled()

    const spinner = wrapper.findComponent(MazSpinner)

    expect(spinner.props('color')).toBe(color)
    expect(spinner.props('size')).toBe(size)

    const content = wrapper.find('span')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Contenu personnalisé')
  })

  it('display the spinner wuth default propertiesa', async () => {
    const wrapper = mount(MazFullscreenLoader)

    await vi.dynamicImportSettled()

    const spinner = wrapper.findComponent(MazSpinner)

    expect(spinner.props('color')).toBe('primary')
    expect(spinner.props('size')).toBe('3em')

    const content = wrapper.find('span')
    expect(content.exists()).toBe(false)
  })
})
