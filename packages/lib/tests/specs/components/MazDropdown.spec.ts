import type { VueWrapper } from '@vue/test-utils'
import MazDropdown, { type MazDropdownProps } from '@components/MazDropdown.vue'
import { MazStar } from '@maz-ui/icons'
import { mount } from '@vue/test-utils'
import { type ComponentPublicInstance, markRaw } from 'vue'

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
    expect(triggerId).toBe('MazDropdown-v-1')
  })

  it('closes dropdown by default', () => {
    expect(wrapper.vm.modelValue).toBe(false)
    expect(wrapper.find('[aria-label="Menu"]').exists()).toBe(false)
  })

  describe('given dropdown is closed', () => {
    it('when trigger is clicked Then dropdown opens', async () => {
      const trigger = wrapper.find('[role="button"]')

      await trigger.trigger('click')

      expect(wrapper.vm.modelValue).toBe(true)
      expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBe(true)
    })

    it('when trigger is hovered Then dropdown opens with hover trigger', async () => {
      await wrapper.setProps({ trigger: 'hover' })
      const trigger = wrapper.find('[role="button"]')

      await trigger.trigger('mouseenter')

      expect(wrapper.vm.modelValue).toBe(true)
    })
  })

  describe('given dropdown is open', () => {
    beforeEach(async () => {
      await wrapper.find('[role="button"]').trigger('click')
    })

    it('when trigger is clicked Then dropdown closes', async () => {
      const trigger = wrapper.find('[role="button"]')

      await trigger.trigger('click')

      expect(wrapper.vm.modelValue).toBe(false)
    })

    it('when action menu item is clicked Then action is executed', async () => {
      const menuItems = wrapper.findAll('.menuitem')
      const settingsItem = menuItems.find(item => item.text() === 'Settings')

      await settingsItem?.trigger('click')

      expect(actionSpy).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('menuitem-clicked')).toBeTruthy()
    })

    it('when action menu item is clicked Then dropdown closes', async () => {
      const menuItems = wrapper.findAll('.menuitem')
      const settingsItem = menuItems.find(item => item.text() === 'Settings')

      await settingsItem?.trigger('click')

      expect(wrapper.vm.modelValue).toBe(false)
    })

    it('when link menu item is clicked Then dropdown closes', async () => {
      const menuItems = wrapper.findAll('.menuitem')
      const profileItem = menuItems[0]

      await profileItem?.trigger('click')

      expect(wrapper.vm.modelValue).toBe(false)
    })
  })

  describe('given dropdown with different configurations', () => {
    it('when closeOnClick is false Then dropdown stays open after menu item click', async () => {
      await wrapper.setProps({ closeOnClick: false })
      await wrapper.find('[role="button"]').trigger('click')

      const menuItems = wrapper.findAll('.menuitem')
      const settingsItem = menuItems.find(item => item.text() === 'Settings')
      await settingsItem?.trigger('click')

      expect(wrapper.vm.modelValue).toBe(true)
    })

    it('when disabled is true Then dropdown cannot be opened', async () => {
      await wrapper.setProps({ disabled: true })

      await wrapper.find('[role="button"]').trigger('click')

      expect(wrapper.vm.modelValue).toBe(false)
    })

    it('when chevron is false Then chevron icon is not rendered', async () => {
      await wrapper.setProps({ chevron: false })

      expect(wrapper.find('.m-dropdown__icon').exists()).toBe(false)
    })

    it('when custom dropdownIcon is provided Then custom icon is rendered', async () => {
      await wrapper.setProps({ dropdownIcon: markRaw(MazStar) })

      expect(wrapper.findComponent(MazStar).exists()).toBe(true)
    })

    it('when dropdownIconAnimation is false Then icon does not animate', async () => {
      await wrapper.setProps({ dropdownIconAnimation: false })
      await wrapper.find('[role="button"]').trigger('click')

      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).not.toContain('--open')
    })

    it('when block is true Then dropdown takes full width', async () => {
      await wrapper.setProps({ block: true })

      expect(wrapper.find('.m-dropdown').classes()).toContain('--block')
    })
  })

  describe('given dropdown emits events', () => {
    it('when dropdown opens Then update:modelValue event is emitted', async () => {
      await wrapper.find('[role="button"]').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('when dropdown closes Then update:modelValue event is emitted', async () => {
      await wrapper.find('[role="button"]').trigger('click')
      await wrapper.find('[role="button"]').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
    })

    it('when menu item is clicked Then menuitem-clicked event is emitted', async () => {
      await wrapper.find('[role="button"]').trigger('click')
      const menuItems = wrapper.findAll('.menuitem')
      const settingsItem = menuItems.find(item => item.text() === 'Settings')

      await settingsItem?.trigger('click')

      expect(wrapper.emitted('menuitem-clicked')).toBeTruthy()
      expect(wrapper.emitted('menuitem-clicked')?.[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('given dropdown with different item types', () => {
    it('when item has href Then MazLink is rendered', async () => {
      const wrapper = await getWrapper({ props: { items: [{ label: 'Profile', href: '/profile' }] } })

      await wrapper.find('[role="button"]').trigger('click')

      const profileItem = wrapper.findComponent({ name: 'MazLink' })
      expect(profileItem.attributes('href')).toBe('/profile')
    })

    it('when item has to property Then router-link is rendered', async () => {
      const wrapper = await getWrapper({ props: { items: [{ label: 'About', to: '/about' }] } })

      await wrapper.find('[role="button"]').trigger('click')

      const aboutItem = wrapper.findComponent({ name: 'MazLink' })
      expect(aboutItem.attributes('to')).toBe('/about')
    })

    it('when item has onClick Then button is rendered', async () => {
      await wrapper.find('[role="button"]').trigger('click')

      const settingsItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Settings')
      expect(settingsItem?.element.tagName).toBe('BUTTON')
    })

    it('when item has target Then target attribute is set', async () => {
      const wrapper = await getWrapper({ props: { items: [{ label: 'External', href: 'https://example.com', target: '_blank' }] } })

      await wrapper.find('[role="button"]').trigger('click')

      const externalItem = wrapper.findComponent({ name: 'MazLink' })
      expect(externalItem.attributes('target')).toBe('_blank')
    })
  })

  describe('given dropdown with different sizes', () => {
    it('when size is xl Then icon has large text class', async () => {
      await wrapper.setProps({ size: 'xl' })

      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).toContain('maz-text-lg')
    })

    it('when size is mini Then icon has small text class', async () => {
      await wrapper.setProps({ size: 'mini' })

      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).toContain('maz-text-sm')
    })
  })

  describe('given dropdown accessibility', () => {
    it('when rendered Then has proper ARIA attributes', async () => {
      const dropdownWrapper = wrapper.find('.m-dropdown__wrapper')
      expect(dropdownWrapper.attributes('aria-expanded')).toBe('false')
      expect(dropdownWrapper.attributes('aria-haspopup')).toBe('menu')

      await wrapper.find('[role="button"]').trigger('click')

      const dropdownMenu = wrapper.find('.m-dropdown__menu')
      expect(dropdownMenu.attributes('aria-label')).toBe('Menu')
    })

    it('when dropdown is open Then aria-expanded is true', async () => {
      await wrapper.find('[role="button"]').trigger('click')

      const dropdownWrapper = wrapper.find('[aria-expanded]')
      expect(dropdownWrapper.attributes('aria-expanded')).toBe('true')
    })

    it('when rendered Then has screen reader description', () => {
      const srDescription = wrapper.find('.maz-sr-only')
      expect(srDescription.exists()).toBe(true)
    })
  })
})
