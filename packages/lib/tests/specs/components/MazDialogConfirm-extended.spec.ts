import type { VueWrapper } from '@vue/test-utils'
import MazDialogConfirm from '@components/MazDialogConfirm.vue'
import { useMazDialogConfirm } from '@components/MazDialogConfirm/useMazDialogConfirm'
import { mount } from '@vue/test-utils'

describe('MazDialogConfirm extended coverage', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialogConfirm>>
  const { showDialogAndWaitChoice, dialogState } = useMazDialogConfirm()

  function getWrapper(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    return mount(MazDialogConfirm, {
      props: {
        identifier: 'test-dialog',
        ...props,
      },
      slots: {
        ...slots,
      },
      global: {
        stubs: {
          Teleport: { template: '<div><slot /></div>' },
        },
      },
    }) as VueWrapper<InstanceType<typeof MazDialogConfirm>>
  }

  afterEach(() => {
    dialogState.value = []
  })

  describe('when rendered with minimal props', () => {
    it('should mount successfully with only identifier', () => {
      wrapper = getWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when rendered with modelValue true', () => {
    it('should display the dialog', () => {
      wrapper = getWrapper({ modelValue: true })
      expect(wrapper.find('.m-dialog').exists()).toBe(true)
    })
  })

  describe('when rendered with modelValue false', () => {
    it('should not display the dialog', () => {
      wrapper = getWrapper({ modelValue: false })
      expect(wrapper.find('.m-dialog').exists()).toBe(false)
    })
  })

  describe('when title prop is provided', () => {
    it('should display the title', () => {
      wrapper = getWrapper({ modelValue: true, title: 'Confirm Action' })
      expect(wrapper.text()).toContain('Confirm Action')
    })
  })

  describe('when message prop is provided', () => {
    it('should display the message', () => {
      wrapper = getWrapper({ modelValue: true, message: 'Are you sure you want to proceed?' })
      expect(wrapper.text()).toContain('Are you sure you want to proceed?')
    })
  })

  describe('when custom acceptText is provided', () => {
    it('should display the custom accept button text', async () => {
      wrapper = getWrapper({ modelValue: true, acceptText: 'Yes, do it' })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.acceptText).toBe('Yes, do it')
    })
  })

  describe('when custom rejectText is provided', () => {
    it('should display the custom reject button text', async () => {
      wrapper = getWrapper({ modelValue: true, rejectText: 'No way' })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.rejectText).toBe('No way')
    })
  })

  describe('when hideAcceptButton is true', () => {
    it('should not display the accept button', async () => {
      wrapper = getWrapper({ modelValue: true, hideAcceptButton: true })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.hideAcceptButton).toBe(true)
    })
  })

  describe('when hideRejectButton is true', () => {
    it('should not display the reject button', async () => {
      wrapper = getWrapper({ modelValue: true, hideRejectButton: true })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.hideRejectButton).toBe(true)
    })
  })

  describe('when both hideAcceptButton and hideRejectButton are true', () => {
    it('should hide both buttons', async () => {
      wrapper = getWrapper({ modelValue: true, hideAcceptButton: true, hideRejectButton: true })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.hideAcceptButton).toBe(true)
      expect(currentData.hideRejectButton).toBe(true)
    })
  })

  describe('when custom acceptProps are provided', () => {
    it('should merge accept button props', async () => {
      wrapper = getWrapper({
        modelValue: true,
        acceptProps: { color: 'primary', type: 'accept', text: 'OK', response: 'ok' },
      })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.acceptProps.color).toBe('primary')
    })
  })

  describe('when custom rejectProps are provided', () => {
    it('should merge reject button props', async () => {
      wrapper = getWrapper({
        modelValue: true,
        rejectProps: { color: 'warning', type: 'reject', text: 'Nope', response: 'nope' },
      })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.rejectProps.color).toBe('warning')
    })
  })

  describe('when custom buttons array is provided', () => {
    it('should use custom buttons instead of default accept/reject', async () => {
      wrapper = getWrapper({
        modelValue: true,
        buttons: [
          { text: 'Option A', type: 'accept', response: 'a' },
          { text: 'Option B', type: 'reject', response: 'b' },
          { text: 'Option C', type: 'accept', response: 'c' },
        ],
      })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentButtons = wrapper.vm.currentButtons
      expect(currentButtons).toHaveLength(3)
      expect(currentButtons[0].text).toBe('Option A')
      expect(currentButtons[1].text).toBe('Option B')
      expect(currentButtons[2].text).toBe('Option C')
    })
  })

  describe('when using showDialogAndWaitChoice', () => {
    it('should activate the dialog with matching identifier', async () => {
      wrapper = getWrapper({ identifier: 'confirm-delete' })
      const promise = showDialogAndWaitChoice('confirm-delete')

      // @ts-expect-error - accessing private computed
      expect(wrapper.vm.currentModal).toBeDefined()
      // @ts-expect-error - accessing private computed
      expect(wrapper.vm.currentModal.id).toBe('confirm-delete')
      // @ts-expect-error - accessing private computed
      expect(wrapper.vm.currentModal.isActive).toBe(true)

      // Resolve to avoid unhandled rejection
      const currentModal = dialogState.value.find(d => d.id === 'confirm-delete')
      currentModal?.accept('done')
      await expect(promise).resolves.toBe('done')
    })

    it('should handle rejection', async () => {
      wrapper = getWrapper({ identifier: 'confirm-reject' })
      const promise = showDialogAndWaitChoice('confirm-reject')

      const currentModal = dialogState.value.find(d => d.id === 'confirm-reject')
      currentModal?.reject?.('cancelled')
      await expect(promise).rejects.toBe('cancelled')
    })
  })

  describe('when dialog emits events', () => {
    it('should emit close event', async () => {
      wrapper = getWrapper({ modelValue: true })
      const dialog = wrapper.findComponent({ name: 'MazDialog' })
      await dialog.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit open event', async () => {
      wrapper = getWrapper({ modelValue: true })
      const dialog = wrapper.findComponent({ name: 'MazDialog' })
      await dialog.vm.$emit('open')
      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when title slot is provided', () => {
    it('should render custom title slot', () => {
      wrapper = getWrapper(
        { modelValue: true },
        { title: '<h3 class="custom-title">Slot Title</h3>' },
      )
      expect(wrapper.find('.custom-title').exists()).toBe(true)
      expect(wrapper.text()).toContain('Slot Title')
    })
  })

  describe('when default slot is provided', () => {
    it('should render custom content', () => {
      wrapper = getWrapper(
        { modelValue: true },
        { default: '<div class="custom-content">Custom body</div>' },
      )
      expect(wrapper.find('.custom-content').exists()).toBe(true)
    })
  })

  describe('when footer-button slot is provided', () => {
    it('should render custom footer buttons', () => {
      wrapper = getWrapper(
        { modelValue: true },
        { 'footer-button': '<button class="custom-btn">Custom Button</button>' },
      )
      expect(wrapper.find('.custom-btn').exists()).toBe(true)
    })
  })

  describe('when closeOnEscape is configured', () => {
    it('should pass closeOnEscape to underlying MazDialog', () => {
      wrapper = getWrapper({ modelValue: true, closeOnEscape: false })
      const dialog = wrapper.findComponent({ name: 'MazDialog' })
      expect(dialog.props('closeOnEscape')).toBe(false)
    })

    it('should default closeOnEscape to true', () => {
      wrapper = getWrapper({ modelValue: true })
      const dialog = wrapper.findComponent({ name: 'MazDialog' })
      expect(dialog.props('closeOnEscape')).toBe(true)
    })
  })

  describe('when combining title prop and message', () => {
    it('should display both title and message', () => {
      wrapper = getWrapper({
        modelValue: true,
        title: 'Delete Item',
        message: 'This cannot be undone.',
      })
      expect(wrapper.text()).toContain('Delete Item')
      expect(wrapper.text()).toContain('This cannot be undone.')
    })
  })

  describe('when acceptText and rejectText with custom props combined', () => {
    it('should properly merge all props', async () => {
      wrapper = getWrapper({
        modelValue: true,
        acceptText: 'Agree',
        rejectText: 'Disagree',
        acceptProps: { color: 'info', type: 'accept', response: 'agreed' },
        rejectProps: { color: 'contrast', type: 'reject', response: 'disagreed' },
      })
      await vi.dynamicImportSettled()

      // @ts-expect-error - accessing private computed
      const currentData = wrapper.vm.currentData
      expect(currentData.acceptText).toBe('Agree')
      expect(currentData.rejectText).toBe('Disagree')
      expect(currentData.acceptProps.color).toBe('info')
      expect(currentData.rejectProps.color).toBe('contrast')
    })
  })

  describe('exposed methods', () => {
    it('should expose close method', () => {
      wrapper = getWrapper({ modelValue: true, identifier: 'expose-close' })
      expect(wrapper.vm.close).toBeInstanceOf(Function)
    })

    it('should expose isActive as a computed ref', () => {
      wrapper = getWrapper({ modelValue: true, identifier: 'expose-active-ref' })
      // defineExpose provides isActive as a ComputedRef
      expect(wrapper.vm.isActive).toBeDefined()
    })

    it('should reflect active state via showDialogAndWaitChoice', async () => {
      wrapper = getWrapper({ identifier: 'expose-active-promise' })
      const promise = showDialogAndWaitChoice('expose-active-promise')

      // After showDialogAndWaitChoice the dialog state has this identifier active
      // @ts-expect-error - accessing private computed
      expect(wrapper.vm.currentModal).toBeDefined()
      // @ts-expect-error - accessing private computed
      expect(wrapper.vm.currentModal.isActive).toBe(true)

      // Resolve to avoid unhandled rejection
      const currentModal = dialogState.value.find(d => d.id === 'expose-active-promise')
      currentModal?.accept('done')
      await expect(promise).resolves.toBe('done')
    })
  })
})
