import MazFullscreenLoader from '@components/MazFullscreenLoader.vue'
import { mount } from '@vue/test-utils'

describe('given MazFullscreenLoader fade', () => {
  beforeEach(() => {
    const target = document.createElement('div')
    target.id = 'fade-target'
    document.body.appendChild(target)
  })

  afterEach(() => {
    document.getElementById('fade-target')?.remove()
  })

  describe('when rendered', () => {
    it('then the root is a busy status', async () => {
      const wrapper = mount(MazFullscreenLoader, {
        props: { teleportSelector: '#fade-target' },
        global: { stubs: { Teleport: false, Transition: false } },
      })
      await vi.dynamicImportSettled()

      const loader = document.querySelector('#fade-target .m-fullscreen-loader')

      expect(loader?.getAttribute('role')).toBe('status')
      expect(loader?.getAttribute('aria-busy')).toBe('true')

      wrapper.unmount()
    })

    it('then an attribute of the parent can replace the role', async () => {
      const wrapper = mount(MazFullscreenLoader, {
        props: { teleportSelector: '#fade-target' },
        attrs: { role: 'alert' },
        global: { stubs: { Teleport: false, Transition: false } },
      })
      await vi.dynamicImportSettled()

      expect(document.querySelector('#fade-target .m-fullscreen-loader')?.getAttribute('role')).toBe('alert')

      wrapper.unmount()
    })
  })
})
