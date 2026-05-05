import type { MazDropdownProps } from '@components/MazDropdown.vue'
import MazDropdown from '@components/MazDropdown.vue'
import { mount } from '@vue/test-utils'

describe('MazDropdown extended coverage', () => {
  const actionSpy = vi.fn()

  const baseItems: MazDropdownProps['items'] = [
    { label: 'Action Item', onClick: actionSpy },
    { label: 'Link Item', href: '/link' },
    { label: 'Router Item', to: '/router-page' },
  ]

  async function getWrapper(props: Partial<MazDropdownProps> = {}, slots: Record<string, string> = {}) {
    const wrapper = mount(MazDropdown, {
      props: {
        items: baseItems,
        trigger: 'click',
        position: 'bottom-start',
        ...props,
      },
      slots: {
        default: 'Open Menu',
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

  afterEach(() => {
    actionSpy.mockClear()
  })

  describe('when rendered with default props', () => {
    it('should render the dropdown container', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find('.m-dropdown').exists()).toBe(true)
    })

    it('should render the trigger text', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.text()).toContain('Open Menu')
    })

    it('should be closed by default', async () => {
      const wrapper = await getWrapper()
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when items is an empty array', () => {
    it('should render without items', async () => {
      const wrapper = await getWrapper({ items: [] })
      await wrapper.find('[role="button"]').trigger('click')
      expect(wrapper.find('.m-dropdown__menu').exists()).toBe(true)
      expect(wrapper.findAll('.menuitem').length).toBe(0)
    })
  })

  describe('when disabled prop is true', () => {
    it('should not open on click', async () => {
      const wrapper = await getWrapper({ disabled: true })
      await wrapper.find('[role="button"]').trigger('click')
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('should apply disabled class', async () => {
      const wrapper = await getWrapper({ disabled: true })
      expect(wrapper.find('.m-popover.--disabled').exists()).toBe(true)
    })
  })

  describe('when trigger is hover', () => {
    it('should open on mouseenter', async () => {
      const wrapper = await getWrapper({ trigger: 'hover' })
      const trigger = wrapper.find('[role="button"]')
      await trigger.trigger('mouseenter')
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should close on mouseleave', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({ trigger: 'hover' })
      const trigger = wrapper.find('[role="button"]')
      await trigger.trigger('mouseenter')
      await trigger.trigger('mouseleave')
      vi.advanceTimersByTime(200)
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
      vi.useRealTimers()
    })
  })

  describe('when trigger is click', () => {
    it('should toggle open on click', async () => {
      const wrapper = await getWrapper({ trigger: 'click' })
      const trigger = wrapper.find('[role="button"]')
      await trigger.trigger('click')
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should toggle close on second click', async () => {
      const wrapper = await getWrapper({ trigger: 'click' })
      const trigger = wrapper.find('[role="button"]')
      await trigger.trigger('click')
      await trigger.trigger('click')
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when closeOnClick is true', () => {
    it('should close after clicking an action item', async () => {
      const wrapper = await getWrapper({ closeOnClick: true })
      await wrapper.find('[role="button"]').trigger('click')

      const actionItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Action Item')
      await actionItem?.trigger('click')

      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })

    it('should close after clicking a link item', async () => {
      const wrapper = await getWrapper({ closeOnClick: true })
      await wrapper.find('[role="button"]').trigger('click')

      const linkItem = wrapper.findAll('.menuitem')[0]
      await linkItem?.trigger('click')

      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when closeOnClick is false', () => {
    it('should remain open after clicking an action item', async () => {
      const wrapper = await getWrapper({ closeOnClick: false })
      await wrapper.find('[role="button"]').trigger('click')

      const actionItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Action Item')
      await actionItem?.trigger('click')

      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(true)
    })
  })

  describe('when chevron prop is false', () => {
    it('should not render the chevron icon', async () => {
      const wrapper = await getWrapper({ chevron: false })
      expect(wrapper.find('.m-dropdown__icon').exists()).toBe(false)
    })
  })

  describe('when chevron prop is true (default)', () => {
    it('should render the chevron icon', async () => {
      const wrapper = await getWrapper({ chevron: true })
      expect(wrapper.find('.m-dropdown__icon').exists()).toBe(true)
    })
  })

  describe('when dropdownIconAnimation is false', () => {
    it('should not apply --open class to icon when open', async () => {
      const wrapper = await getWrapper({ dropdownIconAnimation: false })
      await wrapper.find('[role="button"]').trigger('click')
      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).not.toContain('--open')
    })
  })

  describe('when dropdownIconAnimation is true', () => {
    it('should apply --open class to icon when open', async () => {
      const wrapper = await getWrapper({ dropdownIconAnimation: true })
      await wrapper.find('[role="button"]').trigger('click')
      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).toContain('--open')
    })
  })

  describe('when position is configured', () => {
    it('should pass position to MazPopover', async () => {
      const wrapper = await getWrapper({ position: 'top' })
      const popover = wrapper.findComponent({ name: 'MazPopover' })
      expect(popover.props('position')).toBe('top')
    })

    it('should accept bottom-end position', async () => {
      const wrapper = await getWrapper({ position: 'bottom-end' })
      const popover = wrapper.findComponent({ name: 'MazPopover' })
      expect(popover.props('position')).toBe('bottom-end')
    })
  })

  describe('when size is configured', () => {
    it.each([
      { size: 'xl' as const, expected: 'maz:text-lg' },
      { size: 'lg' as const, expected: 'maz:text-base' },
      { size: 'md' as const, expected: 'maz:text-base' },
      { size: 'sm' as const, expected: 'maz:text-base' },
      { size: 'xs' as const, expected: 'maz:text-sm' },
      { size: 'mini' as const, expected: 'maz:text-sm' },
    ])('should apply $expected class when size is $size', async ({ size, expected }) => {
      const wrapper = await getWrapper({ size })
      const icon = wrapper.find('.m-dropdown__icon')
      expect(icon.classes()).toContain(expected)
    })
  })

  describe('when color is configured', () => {
    it('should pass color to MazBtn', async () => {
      const wrapper = await getWrapper({ color: 'primary' })
      const btn = wrapper.findComponent({ name: 'MazBtn' })
      expect(btn.props('color')).toBe('primary')
    })

    it('should default to transparent color', async () => {
      const wrapper = await getWrapper()
      const btn = wrapper.findComponent({ name: 'MazBtn' })
      expect(btn.props('color')).toBe('transparent')
    })
  })

  describe('when block prop is true', () => {
    it('should apply block class', async () => {
      const wrapper = await getWrapper({ block: true })
      expect(wrapper.find('.m-dropdown').classes()).toContain('--block')
    })

    it('should pass block to MazBtn', async () => {
      const wrapper = await getWrapper({ block: true })
      const btn = wrapper.findComponent({ name: 'MazBtn' })
      expect(btn.props('block')).toBe(true)
    })
  })

  describe('when items have colors', () => {
    it('should apply color class to action buttons', async () => {
      const wrapper = await getWrapper({
        items: [{ label: 'Delete', onClick: actionSpy, color: 'destructive' }],
      })
      await wrapper.find('[role="button"]').trigger('click')

      const btn = wrapper.find('.menuitem__button')
      expect(btn.classes()).toContain('--destructive')
    })
  })

  describe('when items have href with target', () => {
    it('should apply target to link items', async () => {
      const wrapper = await getWrapper({
        items: [{ label: 'External', href: 'https://example.com', target: '_blank' }],
      })
      await wrapper.find('[role="button"]').trigger('click')

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.attributes('target')).toBe('_blank')
    })
  })

  describe('when items have href without target', () => {
    it('should default target to _self for href items', async () => {
      const wrapper = await getWrapper({
        items: [{ label: 'Internal', href: '/page' }],
      })
      await wrapper.find('[role="button"]').trigger('click')

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.attributes('target')).toBe('_self')
    })
  })

  describe('when action item is clicked', () => {
    it('should call the onClick handler', async () => {
      const wrapper = await getWrapper()
      await wrapper.find('[role="button"]').trigger('click')

      const actionItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Action Item')
      await actionItem?.trigger('click')

      expect(actionSpy).toHaveBeenCalledTimes(1)
    })

    it('should emit menuitem-clicked', async () => {
      const wrapper = await getWrapper()
      await wrapper.find('[role="button"]').trigger('click')

      const actionItem = wrapper.findAll('.menuitem').find(item => item.text() === 'Action Item')
      await actionItem?.trigger('click')

      expect(wrapper.emitted('menuitem-clicked')).toBeTruthy()
    })
  })

  describe('when action item is activated via keypress enter', () => {
    it('should call the onClick handler', async () => {
      const wrapper = await getWrapper()
      await wrapper.find('[role="button"]').trigger('click')

      const actionItem = wrapper.findAll('.menuitem__button').find(item => item.text() === 'Action Item')
      await actionItem?.trigger('keypress.enter')

      expect(actionSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('when modelValue is controlled externally', () => {
    it('should open when modelValue is true', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should close when modelValue is false', async () => {
      const wrapper = await getWrapper({ modelValue: false })
      // @ts-expect-error - isOpen is private
      expect(wrapper.vm.isOpen).toBe(false)
    })
  })

  describe('when screenReaderDescription is provided', () => {
    it('should render the screen reader description', async () => {
      const wrapper = await getWrapper({ screenReaderDescription: 'Toggle navigation menu' })
      const srOnly = wrapper.find('.maz\\:sr-only')
      expect(srOnly.text()).toContain('Toggle navigation menu')
    })
  })

  describe('when menuPanelClass is provided', () => {
    it('should apply class to the menu panel', async () => {
      const wrapper = await getWrapper({ menuPanelClass: 'custom-menu-panel' })
      await wrapper.find('[role="button"]').trigger('click')
      expect(wrapper.find('.m-dropdown__menu').classes()).toContain('custom-menu-panel')
    })
  })

  describe('when menuPanelStyle is provided', () => {
    it('should apply style to the menu panel', async () => {
      const wrapper = await getWrapper({ menuPanelStyle: 'max-height: 200px' })
      await wrapper.find('[role="button"]').trigger('click')
      const menu = wrapper.find('.m-dropdown__menu')
      expect(menu.attributes('style')).toContain('max-height: 200px')
    })
  })

  describe('accessibility attributes', () => {
    it('should set role=menu on dropdown menu', async () => {
      const wrapper = await getWrapper()
      await wrapper.find('[role="button"]').trigger('click')
      expect(wrapper.find('.m-dropdown__menu').attributes('role')).toBe('menu')
    })

    it('should set aria-label on dropdown menu', async () => {
      const wrapper = await getWrapper()
      await wrapper.find('[role="button"]').trigger('click')
      expect(wrapper.find('.m-dropdown__menu').attributes('aria-label')).toBe('Menu')
    })

    it('should generate unique id for menu', async () => {
      const wrapper = await getWrapper({ id: 'my-dropdown' })
      await wrapper.find('[role="button"]').trigger('click')
      expect(wrapper.find('.m-dropdown__menu').attributes('id')).toContain('my-dropdown')
    })
  })

  describe('when id is provided', () => {
    it('should use the provided id as base', async () => {
      const wrapper = await getWrapper({ id: 'custom-dropdown-id' })
      expect(wrapper.find('#custom-dropdown-id').exists()).toBe(true)
    })
  })

  describe('when transition is configured', () => {
    it('should pass transition to MazPopover', async () => {
      const wrapper = await getWrapper({ transition: 'scale-fade' })
      const popover = wrapper.findComponent({ name: 'MazPopover' })
      expect(popover.props('transition')).toBe('scale-fade')
    })
  })
})
