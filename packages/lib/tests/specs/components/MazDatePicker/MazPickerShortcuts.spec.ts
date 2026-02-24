import MazBtn from '@components/MazBtn.vue'
import MazPickerShortcuts from '@components/MazDatePicker/MazPickerShortcuts.vue'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'

describe('given MazPickerShortcuts component', () => {
  const defaultShortcuts = [
    {
      identifier: 'last7Days',
      label: 'Last 7 days',
      value: {
        start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      identifier: 'last30Days',
      label: 'Last 30 days',
      value: {
        start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      identifier: 'thisWeek',
      label: 'This week',
      value: {
        start: dayjs().startOf('week').format('YYYY-MM-DD'),
        end: dayjs().endOf('week').format('YYYY-MM-DD'),
      },
    },
  ]

  const defaultProps = {
    color: 'primary' as const,
    modelValue: { start: undefined, end: undefined } as { start?: string, end?: string },
    shortcuts: defaultShortcuts,
    double: false,
    shortcut: undefined as string | undefined,
    disabled: false,
  }

  describe('when rendering with default props', () => {
    it('then it should render the shortcuts container', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-shortcuts').exists()).toBe(true)
    })

    it('then it should render a button for each shortcut', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons.length).toBe(3)
    })

    it('then each button should display the shortcut label', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons[0].text()).toBe('Last 7 days')
      expect(buttons[1].text()).toBe('Last 30 days')
      expect(buttons[2].text()).toBe('This week')
    })
  })

  describe('when no shortcut is selected', () => {
    it('then all buttons should have transparent color', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('color')).toBe('transparent')
      }
    })

    it('then no button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(0)
    })
  })

  describe('when a shortcut is pre-selected via prop', () => {
    it('then the matching button should have the color prop', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
          color: 'success' as const,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      const selectedBtn = buttons.find(b => b.classes().includes('--is-selected'))
      expect(selectedBtn).toBeDefined()
      expect(selectedBtn!.props('color')).toBe('success')
    })

    it('then the matching button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)
    })

    it('then it should emit update:model-value with the shortcut value on mount', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
        },
      })
      await vi.dynamicImportSettled()

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBeGreaterThanOrEqual(1)
      const emittedValue = emitted![0][0] as { start: string, end: string }
      expect(emittedValue.start).toBe(defaultShortcuts[0].value.start)
      expect(emittedValue.end).toBe(defaultShortcuts[0].value.end)
    })
  })

  describe('when a shortcut button is clicked', () => {
    it('then it should emit update:model-value with the shortcut value', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[0].trigger('click')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const emittedValue = emitted![0][0] as { start: string, end: string }
      expect(emittedValue.start).toBe(defaultShortcuts[0].value.start)
      expect(emittedValue.end).toBe(defaultShortcuts[0].value.end)
    })

    it('then the clicked button should become selected', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[1].trigger('click') // Click "Last 30 days"

      // After click, the selectedShortcut ref should update
      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)
    })

    it('then clicking a different shortcut should change selection', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[0].trigger('click') // Click "Last 7 days"

      let selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)

      await buttons[2].trigger('click') // Click "This week"

      selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)
    })
  })

  describe('when disabled is true', () => {
    it('then all buttons should be disabled', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('disabled')).toBe(true)
      }
    })
  })

  describe('when disabled is false', () => {
    it('then buttons should not be disabled', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          disabled: false,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('disabled')).toBe(false)
      }
    })
  })

  describe('when modelValue changes and end becomes undefined (watcher)', () => {
    it('then selectedShortcut should be cleared', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
          modelValue: { start: '2024-01-10', end: '2024-01-17' },
        },
      })
      await vi.dynamicImportSettled()

      // Initially should have selected shortcut
      expect(wrapper.findAll('.--is-selected').length).toBe(1)

      // Update modelValue to have no end
      await wrapper.setProps({
        modelValue: { start: '2024-01-10', end: undefined },
      })

      // After the watcher triggers, selectedShortcut should be undefined
      expect(wrapper.findAll('.--is-selected').length).toBe(0)
    })
  })

  describe('when modelValue has an end value', () => {
    it('then selectedShortcut should not be cleared', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
          modelValue: { start: '2024-01-10', end: '2024-01-17' },
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.findAll('.--is-selected').length).toBe(1)

      // Update modelValue but keep end
      await wrapper.setProps({
        modelValue: { start: '2024-01-05', end: '2024-01-12' },
      })

      // Selected shortcut should still be present
      expect(wrapper.findAll('.--is-selected').length).toBe(1)
    })
  })

  describe('when shortcut prop changes', () => {
    it('then it should select the new shortcut and emit its value', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: undefined,
        },
      })
      await vi.dynamicImportSettled()

      // Initially no shortcut selected
      expect(wrapper.findAll('.--is-selected').length).toBe(0)

      await wrapper.setProps({ shortcut: 'last30Days' })

      // Should now have a selected shortcut
      expect(wrapper.findAll('.--is-selected').length).toBe(1)

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
    })

    it('then it should not emit if shortcut identifier does not match any shortcut', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const emitsBefore = wrapper.emitted('update:model-value')?.length ?? 0

      await wrapper.setProps({ shortcut: 'nonExistentShortcut' })

      const emitsAfter = wrapper.emitted('update:model-value')?.length ?? 0
      // No new emit should happen
      expect(emitsAfter).toBe(emitsBefore)
    })
  })

  describe('when different colors are used', () => {
    it('then the selected button should use the provided color', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          color: 'destructive' as const,
          shortcut: 'last7Days',
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      const selectedBtn = buttons.find(b => b.classes().includes('--is-selected'))
      expect(selectedBtn).toBeDefined()
      expect(selectedBtn!.props('color')).toBe('destructive')
    })
  })

  describe('when all buttons have size sm', () => {
    it('then each button should have size sm', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('size')).toBe('sm')
      }
    })
  })

  describe('when modelValue is falsy for watcher', () => {
    it('then selectedShortcut should be cleared when modelValue has no end', async () => {
      const wrapper = mount(MazPickerShortcuts, {
        props: {
          ...defaultProps,
          shortcut: 'last7Days',
          modelValue: { start: '2024-01-10', end: '2024-01-17' },
        },
      })
      await vi.dynamicImportSettled()

      // Set modelValue to have empty object with neither start nor end
      await wrapper.setProps({
        modelValue: { start: undefined, end: undefined },
      })

      // selectedShortcut should be cleared since end is undefined
      expect(wrapper.findAll('.--is-selected').length).toBe(0)
    })
  })
})
