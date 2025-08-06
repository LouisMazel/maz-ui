import type { MazDropdownProps } from '@components/MazDropdown.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazDropdown from '@components/MazDropdown.vue'
import { MazStar } from '@maz-ui/icons'
import { mount } from '@vue/test-utils'
import { markRaw } from 'vue'

let wrapper: VueWrapper<ComponentPublicInstance<typeof MazDropdown> & { [key: string]: any }>

const actionSpy = vi.fn()

const items: MazDropdownProps['items'] = [
  { label: 'Settings', onClick: actionSpy },
  { label: 'Profile', href: '/profile' },
  { label: 'External', href: 'https://example.com', target: '_blank' },
  { label: 'About', to: '/about' },
]

async function getWrapper({ props = {}, slots = {} }: { props?: Partial<MazDropdownProps>, slots?: Record<string, string> } = {}) {
  const wrapper = mount(MazDropdown, {
    props: {
      items,
      trigger: 'click',
      position: 'bottom-start',
      ...props,
    },
    slots: {
      default: 'Menu',
      ...slots,
    },
    global: {
      stubs: {
        teleport: true,
        MazLink: true,
      },
    },
  })

  await vi.dynamicImportSettled()

  return wrapper
}
describe('components/MazDropdown.vue', () => {
  expect(MazDropdown).toBeTruthy()

  beforeEach(async () => {
    wrapper = await getWrapper()
    actionSpy.mockClear()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders dropdown with trigger button', () => {
    expect(wrapper.find('.m-dropdown').exists()).toBe(true)
    const button = wrapper.findComponent({ name: 'MazBtn' })
    expect(button.text()).toContain('Menu')
  })

  it('generates unique component id', () => {
    const triggerId = wrapper.vm.instanceId
    expect(triggerId).toBe('MazDropdown-v-0')
  })

  it('closes dropdown by default', () => {
    expect(wrapper.vm.modelValue).toBe(false)
    expect(wrapper.find('[aria-label="Menu"]').exists()).toBe(false)
  })

  describe('given dropdown is closed', () => {
    describe('when trigger is clicked', () => {
      it('then dropdown opens', async () => {
        const trigger = wrapper.find('[role="button"]')

        await trigger.trigger('click')

        expect(wrapper.vm.modelValue).toBe(true)
        expect(wrapper.find('[aria-label="Menu"]').exists()).toBe(true)
      })
    })

    describe('when trigger is hovered', () => {
      it('then dropdown opens with hover trigger', async () => {
        await wrapper.setProps({ trigger: 'hover' })
        const trigger = wrapper.find('[role="button"]')

        await trigger.trigger('mouseenter')

        expect(wrapper.vm.modelValue).toBe(true)
      })
    })
  })

  describe('given dropdown is open', () => {
    beforeEach(async () => {
      await wrapper.find('[role="button"]').trigger('click')
    })

    describe('when trigger is clicked', () => {
      it('then dropdown closes', async () => {
        const trigger = wrapper.find('[role="button"]')

        await trigger.trigger('click')

        expect(wrapper.vm.modelValue).toBe(false)
      })
    })

    describe('when action menu item is clicked', () => {
      it('then action is executed', async () => {
        const menuItems = wrapper.findAll('.menuitem')
        const settingsItem = menuItems.find(item => item.text() === 'Settings')

        await settingsItem?.trigger('click')

        expect(actionSpy).toHaveBeenCalledTimes(1)
        expect(wrapper.emitted('menuitem-clicked')).toBeTruthy()
      })

      it('then dropdown stay open', async () => {
        const menuItems = wrapper.findAll('.menuitem')
        const settingsItem = menuItems.find(item => item.text() === 'Settings')

        await settingsItem?.trigger('click')

        expect(wrapper.vm.modelValue).toBe(true)
      })
    })

    describe('when link menu item is clicked', () => {
      it('then dropdown stay open', async () => {
        const menuItems = wrapper.findAll('.menuitem')
        const profileItem = menuItems[0]

        await profileItem?.trigger('click')

        expect(wrapper.vm.modelValue).toBe(true)
      })
    })
  })

  describe('given dropdown with different configurations', () => {
    describe('when closeOnClick is true', () => {
      it('then dropdown closes after menu item click', async () => {
        await wrapper.setProps({ closeOnClick: true })
        await wrapper.find('[role="button"]').trigger('click')

        const menuItems = wrapper.findAll('.menuitem')
        const settingsItem = menuItems.find(item => item.text() === 'Settings')
        await settingsItem?.trigger('click')

        expect(wrapper.vm.modelValue).toBe(false)
      })
    })

    describe('when disabled is true', () => {
      it('then dropdown cannot be opened', async () => {
        await wrapper.setProps({ disabled: true })

        await wrapper.find('[role="button"]').trigger('click')

        expect(wrapper.vm.modelValue).toBe(false)
      })
    })

    describe('when chevron is false', () => {
      it('then chevron icon is not rendered', async () => {
        await wrapper.setProps({ chevron: false })

        expect(wrapper.find('.m-dropdown__icon').exists()).toBe(false)
      })
    })

    describe('when custom dropdownIcon is provided', () => {
      it('then custom icon is rendered', async () => {
        await wrapper.setProps({ dropdownIcon: markRaw(MazStar) })

        expect(wrapper.findComponent(MazStar).exists()).toBe(true)
      })
    })

    describe('when dropdownIconAnimation is false', () => {
      it('then icon does not animate', async () => {
        await wrapper.setProps({ dropdownIconAnimation: false })
        await wrapper.find('[role="button"]').trigger('click')

        const icon = wrapper.find('.m-dropdown__icon')
        expect(icon.classes()).not.toContain('--open')
      })
    })

    describe('when block is true', () => {
      it('then dropdown takes full width', async () => {
        await wrapper.setProps({ block: true })

        expect(wrapper.find('.m-dropdown').classes()).toContain('--block')
      })
    })
  })

  describe('given dropdown emits events', () => {
    describe('when dropdown opens', () => {
      it('then update:modelValue event is emitted', async () => {
        await wrapper.find('[role="button"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
      })
    })

    describe('when dropdown closes', () => {
      it('then update:modelValue event is emitted', async () => {
        await wrapper.find('[role="button"]').trigger('click')
        await wrapper.find('[role="button"]').trigger('click')

        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
      })
    })

    describe('when menu item is clicked', () => {
      it('then menuitem-clicked event is emitted', async () => {
        await wrapper.find('[role="button"]').trigger('click')
        const menuItems = wrapper.findAll('.menuitem')
        const settingsItem = menuItems.find(item => item.text() === 'Settings')

        await settingsItem?.trigger('click')

        expect(wrapper.emitted('menuitem-clicked')).toBeTruthy()
        expect(wrapper.emitted('menuitem-clicked')?.[0][0]).toBeInstanceOf(Event)
      })
    })
  })

  describe('given dropdown with different item types', () => {
    describe('when item has href', () => {
      it('then MazLink is rendered', async () => {
        const wrapper = await getWrapper({ props: { items: [{ label: 'Profile', href: '/profile' }] } })

        await wrapper.find('[role="button"]').trigger('click')

        const profileItem = wrapper.findComponent({ name: 'MazLink' })
        expect(profileItem.attributes('href')).toBe('/profile')
      })
    })

    describe('when item has to property', () => {
      it('then router-link is rendered', async () => {
        const wrapper = await getWrapper({ props: { items: [{ label: 'About', to: '/about' }] } })

        await wrapper.find('[role="button"]').trigger('click')

        const aboutItem = wrapper.findComponent({ name: 'MazLink' })
        expect(aboutItem.attributes('to')).toBe('/about')
      })
    })

    describe('when item has onClick', () => {
      it('then button is rendered', async () => {
        await wrapper.find('[role="button"]').trigger('click')

        const settingsItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Settings')
        expect(settingsItem?.element.tagName).toBe('BUTTON')
      })
    })

    describe('when item has target', () => {
      it('then target attribute is set', async () => {
        const wrapper = await getWrapper({ props: { items: [{ label: 'External', href: 'https://example.com', target: '_blank' }] } })

        await wrapper.find('[role="button"]').trigger('click')

        const externalItem = wrapper.findComponent({ name: 'MazLink' })
        expect(externalItem.attributes('target')).toBe('_blank')
      })
    })
  })

  describe('given dropdown with different sizes', () => {
    describe('when size is xl', () => {
      it('then icon has large text class', async () => {
        await wrapper.setProps({ size: 'xl' })

        const icon = wrapper.find('.m-dropdown__icon')
        expect(icon.classes()).toContain('maz-text-lg')
      })
    })

    describe('when size is mini', () => {
      it('then icon has small text class', async () => {
        await wrapper.setProps({ size: 'mini' })

        const icon = wrapper.find('.m-dropdown__icon')
        expect(icon.classes()).toContain('maz-text-sm')
      })
    })
  })

  describe('given dropdown accessibility', () => {
    describe('when rendered', () => {
      it('then has proper ARIA attributes', async () => {
        const dropdownWrapper = wrapper.find('.m-dropdown__wrapper')
        expect(dropdownWrapper.attributes('aria-expanded')).toBe('false')
        expect(dropdownWrapper.attributes('aria-haspopup')).toBe('menu')

        await wrapper.find('[role="button"]').trigger('click')

        const dropdownMenu = wrapper.find('.m-dropdown__menu')
        expect(dropdownMenu.attributes('aria-label')).toBe('Menu')
      })

      it('then has screen reader description', () => {
        const srDescription = wrapper.find('.maz-sr-only')
        expect(srDescription.exists()).toBe(true)
      })
    })

    describe('when dropdown is open', () => {
      it('then aria-expanded is true', async () => {
        await wrapper.find('[role="button"]').trigger('click')

        const dropdownWrapper = wrapper.find('[aria-expanded]')
        expect(dropdownWrapper.attributes('aria-expanded')).toBe('true')
      })
    })
  })
})
