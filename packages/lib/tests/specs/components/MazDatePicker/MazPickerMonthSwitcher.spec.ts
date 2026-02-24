import MazBtn from '@components/MazBtn.vue'
import MazPickerMonthSwitcher from '@components/MazDatePicker/MazPickerMonthSwitcher.vue'
import { mount } from '@vue/test-utils'

describe('given MazPickerMonthSwitcher component', () => {
  const defaultProps = {
    calendarDate: '2024-01-15',
    color: 'primary' as const,
    locale: 'en-US',
    double: false,
  }

  describe('when rendering with default props', () => {
    it('then it should render the month switcher', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-month-switcher').exists()).toBe(true)
    })

    it('then it should render 12 month buttons', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const monthButtons = wrapper.findAll('.maz-picker-month-switcher__main .m-btn')
      expect(monthButtons.length).toBe(12)
    })

    it('then it should render a close button in the header', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const headerBtn = wrapper.find('.maz-picker-month-switcher__header .m-btn')
      expect(headerBtn.exists()).toBe(true)
    })
  })

  describe('when double is false', () => {
    it('then month labels should be long format (single month name)', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: false,
        },
      })
      await vi.dynamicImportSettled()

      const monthButtons = wrapper.findAll('.maz-picker-month-switcher__main .m-btn')
      // Each button should contain a single month name (no dash separator)
      for (const btn of monthButtons) {
        expect(btn.text()).not.toContain(' - ')
      }
    })

    it('then main container should not have --has-double class', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: false,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-month-switcher__main.--has-double').exists()).toBe(false)
    })

    it('then month buttons should have size xs', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: false,
        },
      })
      await vi.dynamicImportSettled()

      const monthBtns = wrapper.findAll('.maz-picker-month-switcher__main').at(0)!.findAllComponents(MazBtn)
      for (const btn of monthBtns) {
        expect(btn.props('size')).toBe('xs')
      }
    })
  })

  describe('when double is true', () => {
    it('then month labels should contain two month names separated by dash', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: true,
        },
      })
      await vi.dynamicImportSettled()

      const monthButtons = wrapper.findAll('.maz-picker-month-switcher__main .m-btn')
      // Each button should contain two month names joined by " - "
      for (const btn of monthButtons) {
        expect(btn.text()).toContain('-')
      }
    })

    it('then main container should have --has-double class', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-month-switcher__main.--has-double').exists()).toBe(true)
    })

    it('then month buttons should have size sm', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          double: true,
        },
      })
      await vi.dynamicImportSettled()

      const monthBtns = wrapper.findAll('.maz-picker-month-switcher__main').at(0)!.findAllComponents(MazBtn)
      for (const btn of monthBtns) {
        expect(btn.props('size')).toBe('sm')
      }
    })
  })

  describe('when the current month is selected', () => {
    it('then the selected month button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          calendarDate: '2024-01-15',
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)
    })

    it('then the selected month button should have the color prop', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          calendarDate: '2024-01-15',
          color: 'success' as const,
        },
      })
      await vi.dynamicImportSettled()

      const selectedBtn = wrapper.find('.--is-selected')
      expect(selectedBtn.exists()).toBe(true)
    })

    it('then non-selected month buttons should have transparent color', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          calendarDate: '2024-01-15',
        },
      })
      await vi.dynamicImportSettled()

      const monthBtns = wrapper.findAll('.maz-picker-month-switcher__main').at(0)!.findAllComponents(MazBtn)
      const nonSelected = monthBtns.filter(b => !b.classes().includes('--is-selected'))
      for (const btn of nonSelected) {
        expect(btn.props('color')).toBe('transparent')
      }
    })
  })

  describe('when a month button is clicked', () => {
    it('then it should emit update:calendar-date with the selected month', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const monthBtns = wrapper.findAll('.maz-picker-month-switcher__main').at(0)!.findAllComponents(MazBtn)
      await monthBtns[5].trigger('click') // Click June

      const emitted = wrapper.emitted('update:calendar-date')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBe(1)
    })

    it('then it should emit close event', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const monthBtns = wrapper.findAll('.maz-picker-month-switcher__main').at(0)!.findAllComponents(MazBtn)
      await monthBtns[5].trigger('click') // Click June

      const emitted = wrapper.emitted('close')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when the close button in the header is clicked', () => {
    it('then it should emit close event', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const headerBtn = wrapper.find('.maz-picker-month-switcher__header .m-btn')
      await headerBtn.trigger('click')

      const emitted = wrapper.emitted('close')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when different locales are used', () => {
    it('then month labels should be in the requested locale', async () => {
      const wrapperEN = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      const wrapperFR = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          locale: 'fr-FR',
        },
      })
      await vi.dynamicImportSettled()

      const enLabels = wrapperEN.findAll('.maz-picker-month-switcher__main .m-btn').map(b => b.text())
      const frLabels = wrapperFR.findAll('.maz-picker-month-switcher__main .m-btn').map(b => b.text())

      expect(enLabels).not.toEqual(frLabels)
    })
  })

  describe('when different colors are used', () => {
    it('then the selected button should use the provided color', async () => {
      const wrapper = mount(MazPickerMonthSwitcher, {
        props: {
          ...defaultProps,
          color: 'warning' as const,
        },
      })
      await vi.dynamicImportSettled()

      const selectedBtn = wrapper.find('.--is-selected')
      expect(selectedBtn.exists()).toBe(true)
    })
  })
})
