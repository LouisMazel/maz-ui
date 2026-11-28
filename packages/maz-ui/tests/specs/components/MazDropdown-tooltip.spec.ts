import MazDropdown from '@components/MazDropdown.vue'
import { mount } from '@vue/test-utils'

async function mountDropdown() {
  const wrapper = mount(MazDropdown, {
    props: {
      trigger: 'click',
      modelValue: true,
      items: [
        { label: 'Settings', onClick: vi.fn(), tooltip: 'Open the settings' },
        { label: 'Profile', onClick: vi.fn() },
      ],
    },
    slots: { default: 'Menu' },
    global: { stubs: { teleport: true } },
  })

  await vi.dynamicImportSettled()

  return wrapper
}

describe('given MazDropdown wrapper', () => {
  describe('when rendered', () => {
    it('then the wrapper of the trigger is positioned so the screen reader label does not scroll the page', async () => {
      const wrapper = await mountDropdown()

      expect(wrapper.find('.m-dropdown__wrapper').classes()).toContain('maz:relative')
      wrapper.unmount()
    })
  })
})

describe('given MazDropdown items with a tooltip', () => {
  describe('when rendered', () => {
    it('then the tooltip option is not leaked as an attribute of the entry', async () => {
      const wrapper = await mountDropdown()
      const entries = wrapper.findAll('.menuitem')

      expect(entries).toHaveLength(2)
      expect(entries[0]?.attributes('tooltip')).toBeUndefined()
      expect(entries[0]?.text()).toBe('Settings')
      wrapper.unmount()
    })
  })
})
