import MazFullscreenLoader from '@components/MazFullscreenLoader.vue'
import MazSpinner from '@components/MazSpinner.vue'
import { mount } from '@vue/test-utils' // Assurez-vous d'importer correctement le composant MazSpinner

describe('given MazFullscreenLoader.vue component', () => {
  let teleportTarget: HTMLElement
  beforeEach(() => {
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)
  })

  afterEach(() => {
    const teleportTarget = document.getElementById('teleport-target')
    if (teleportTarget) {
      document.body.removeChild(teleportTarget)
    }
  })

  it('display the spinner with good properties', async () => {
    const color = 'secondary'
    const size = '2em'

    const wrapper = mount(MazFullscreenLoader, {
      props: { color, size, teleportSelector: '#teleport-target' },
      slots: {
        default: 'Contenu personnalisé',
      },
      global: {
        stubs: {
          Teleport: false,
        },
      },
    })

    await vi.dynamicImportSettled()

    const teleportedContent = teleportTarget.querySelector('.m-fullscreen-loader')
    expect(teleportedContent).toBeTruthy()

    const spinner = wrapper.findComponent(MazSpinner)

    expect(spinner.props('color')).toBe(color)
    expect(spinner.props('size')).toBe(size)

    expect(teleportedContent?.innerHTML).toMatchInlineSnapshot(`"<svg data-v-668667c8="" data-v-01fc091d="" width="2em" height="2em" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" class="m-spinner m-reset-css m-spinner--secondary"><path data-v-668667c8="" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path></svg><span data-v-01fc091d="">Contenu personnalisé</span>"`)

    const content = teleportTarget.querySelector('span')
    expect(content?.innerHTML).toBe('Contenu personnalisé')
  })

  it('display the spinner wuth default properties', async () => {
    const wrapper = mount(MazFullscreenLoader, {
      props: { teleportSelector: '#teleport-target' },
    })

    await vi.dynamicImportSettled()

    const spinner = wrapper.findComponent(MazSpinner)

    expect(spinner.props('color')).toBe('primary')
    expect(spinner.props('size')).toBe('3em')

    const content = teleportTarget.querySelector('span')
    expect(content).toBe(null)
  })
})
