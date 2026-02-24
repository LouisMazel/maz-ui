import MazDialog from '@components/MazDialog.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('MazDialog extended coverage', () => {
  function getWrapper(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    return mount(MazDialog, {
      props: {
        ...props,
      },
      slots: {
        default: '<p>Dialog body content</p>',
        ...slots,
      },
      global: {
        stubs: {
          Teleport: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  describe('when rendered with default props', () => {
    it('should render the dialog structure', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog').exists()).toBe(true)
      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
      expect(wrapper.find('[aria-modal="true"]').exists()).toBe(true)
    })

    it('should render the content', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Dialog body content')
    })

    it('should not render when modelValue is false', () => {
      const wrapper = getWrapper({ modelValue: false })
      expect(wrapper.find('.m-dialog').exists()).toBe(false)
    })
  })

  describe('when modelValue toggles', () => {
    it('should show dialog when modelValue becomes true', async () => {
      const wrapper = getWrapper({ modelValue: false })
      expect(wrapper.find('.m-dialog').exists()).toBe(false)

      await wrapper.setProps({ modelValue: true })
      expect(wrapper.find('.m-dialog').exists()).toBe(true)
    })

    it('should hide dialog when modelValue becomes false', async () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog').exists()).toBe(true)

      await wrapper.setProps({ modelValue: false })
      expect(wrapper.find('.m-dialog').exists()).toBe(false)
    })
  })

  describe('when title prop is provided', () => {
    it('should render the title text in the header', () => {
      const wrapper = getWrapper({ modelValue: true, title: 'My Dialog Title' })
      expect(wrapper.find('.m-dialog-title').exists()).toBe(true)
      expect(wrapper.find('.m-dialog-title').text()).toBe('My Dialog Title')
      expect(wrapper.find('#dialogTitle').exists()).toBe(true)
    })

    it('should apply --has-title class to header when title is set', () => {
      const wrapper = getWrapper({ modelValue: true, title: 'A Title' })
      expect(wrapper.find('.m-dialog-header.--has-title').exists()).toBe(true)
    })
  })

  describe('when title prop is not provided', () => {
    it('should not render the title element', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog-title').exists()).toBe(false)
    })

    it('should not apply --has-title class to header', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog-header.--has-title').exists()).toBe(false)
    })
  })

  describe('when title slot is provided', () => {
    it('should render the title slot content', () => {
      const wrapper = getWrapper(
        { modelValue: true },
        { title: '<span class="custom-title">Custom Title</span>' },
      )
      expect(wrapper.find('.custom-title').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Title')
    })
  })

  describe('when persistent prop is true', () => {
    it('should not render the close button', async () => {
      const wrapper = getWrapper({ modelValue: true, persistent: true })
      await vi.dynamicImportSettled()
      // In persistent mode, MazBtn close button should not exist
      const mazBtns = wrapper.findAllComponents({ name: 'MazBtn' })
      expect(mazBtns.length).toBe(0)
    })

    it('should pass persistent prop to MazBackdrop', () => {
      const wrapper = getWrapper({ modelValue: true, persistent: true })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('persistent')).toBe(true)
    })
  })

  describe('when hideCloseButton prop is true', () => {
    it('should not render the close button even when not persistent', async () => {
      const wrapper = getWrapper({ modelValue: true, hideCloseButton: true })
      await vi.dynamicImportSettled()
      const mazBtns = wrapper.findAllComponents({ name: 'MazBtn' })
      expect(mazBtns.length).toBe(0)
    })
  })

  describe('when hideCloseButton is false and not persistent', () => {
    it('should render the close button', async () => {
      const wrapper = getWrapper({ modelValue: true, hideCloseButton: false, persistent: false })
      await vi.dynamicImportSettled()
      const mazBtns = wrapper.findAllComponents({ name: 'MazBtn' })
      expect(mazBtns.length).toBe(1)
    })
  })

  describe('when scrollable prop is true', () => {
    it('should apply --scrollable class to dialog', () => {
      const wrapper = getWrapper({ modelValue: true, scrollable: true })
      expect(wrapper.find('.m-dialog.--scrollable').exists()).toBe(true)
    })
  })

  describe('when scrollable prop is false', () => {
    it('should not apply --scrollable class', () => {
      const wrapper = getWrapper({ modelValue: true, scrollable: false })
      expect(wrapper.find('.m-dialog.--scrollable').exists()).toBe(false)
    })
  })

  describe('when maxWidth and minWidth are provided', () => {
    it('should set --max-width and --min-width CSS variables', () => {
      const wrapper = getWrapper({ modelValue: true, maxWidth: '600px', minWidth: '400px' })
      const dialog = wrapper.find('.m-dialog')
      const style = dialog.attributes('style')
      expect(style).toContain('--max-width: 600px')
      expect(style).toContain('--min-width: 400px')
    })
  })

  describe('when using default maxWidth and minWidth', () => {
    it('should set default CSS variables', () => {
      const wrapper = getWrapper({ modelValue: true })
      const dialog = wrapper.find('.m-dialog')
      const style = dialog.attributes('style')
      expect(style).toContain('--max-width: 100%')
      expect(style).toContain('--min-width: 32rem')
    })
  })

  describe('when footer slot is provided', () => {
    it('should render the footer', () => {
      const wrapper = getWrapper(
        { modelValue: true },
        { footer: '<div class="custom-footer">Footer content</div>' },
      )
      expect(wrapper.find('.m-dialog-footer').exists()).toBe(true)
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
      expect(wrapper.text()).toContain('Footer content')
    })

    it('should not apply --bottom-padding class to content when footer exists', () => {
      const wrapper = getWrapper(
        { modelValue: true },
        { footer: '<div>Footer</div>' },
      )
      expect(wrapper.find('.m-dialog-content.--bottom-padding').exists()).toBe(false)
    })
  })

  describe('when footer slot is not provided', () => {
    it('should not render the footer section', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog-footer').exists()).toBe(false)
    })

    it('should apply --bottom-padding class to content', () => {
      const wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog-content.--bottom-padding').exists()).toBe(true)
    })
  })

  describe('when header slot is provided', () => {
    it('should render custom header content replacing default header', () => {
      const wrapper = getWrapper(
        { modelValue: true },
        { header: '<div class="custom-header">Custom Header</div>' },
      )
      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.m-dialog-header').exists()).toBe(false)
    })
  })

  describe('when closeOnEscape prop is configured', () => {
    it('should pass closeOnEscape true to MazBackdrop by default', () => {
      const wrapper = getWrapper({ modelValue: true })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('closeOnEscape')).toBe(true)
    })

    it('should pass closeOnEscape false to MazBackdrop when set', () => {
      const wrapper = getWrapper({ modelValue: true, closeOnEscape: false })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('closeOnEscape')).toBe(false)
    })
  })

  describe('when shallowMounted', () => {
    it('should render with shallowMount', () => {
      const wrapper = shallowMount(MazDialog, {
        props: { modelValue: true },
        slots: { default: 'Content' },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should render with no props', () => {
      const wrapper = shallowMount(MazDialog)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('emitted events', () => {
    it('should emit update:model-value when backdrop emits it', async () => {
      const wrapper = getWrapper({ modelValue: true })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      await backdrop.vm.$emit('update:model-value', false)
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([false])
    })

    it('should emit close when backdrop emits close', async () => {
      const wrapper = getWrapper({ modelValue: true })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      await backdrop.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit open when backdrop emits open', async () => {
      const wrapper = getWrapper({ modelValue: true })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      await backdrop.vm.$emit('open')
      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when teleportSelector is customized', () => {
    it('should pass teleportSelector to MazBackdrop', () => {
      const wrapper = mount(MazDialog, {
        props: { modelValue: true, teleportSelector: '#my-target' },
        slots: { default: 'Content' },
        global: {
          stubs: { Teleport: { template: '<div><slot /></div>' } },
        },
      })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('teleportSelector')).toBe('#my-target')
    })
  })

  describe('when combining multiple props', () => {
    it('should handle title + persistent + scrollable', () => {
      const wrapper = getWrapper({
        modelValue: true,
        title: 'Combined Title',
        persistent: true,
        scrollable: true,
      })
      expect(wrapper.find('.m-dialog.--scrollable').exists()).toBe(true)
      expect(wrapper.find('.m-dialog-title').text()).toBe('Combined Title')
    })

    it('should handle title + hideCloseButton + maxWidth', () => {
      const wrapper = getWrapper({
        modelValue: true,
        title: 'Another Title',
        hideCloseButton: true,
        maxWidth: '500px',
      })
      const style = wrapper.find('.m-dialog').attributes('style')
      expect(style).toContain('--max-width: 500px')
      expect(wrapper.find('.m-dialog-title').text()).toBe('Another Title')
    })

    it('should handle footer + title + scrollable', () => {
      const wrapper = getWrapper(
        { modelValue: true, title: 'Scrollable Dialog', scrollable: true },
        { footer: '<button>OK</button>' },
      )
      expect(wrapper.find('.m-dialog.--scrollable').exists()).toBe(true)
      expect(wrapper.find('.m-dialog-footer').exists()).toBe(true)
      expect(wrapper.find('.m-dialog-content.--bottom-padding').exists()).toBe(false)
    })
  })
})
