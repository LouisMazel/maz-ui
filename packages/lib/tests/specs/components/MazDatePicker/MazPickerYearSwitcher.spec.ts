import MazBtn from '@components/MazBtn.vue'
import MazPickerYearSwitcher from '@components/MazDatePicker/MazPickerYearSwitcher.vue'
import { mount } from '@vue/test-utils'

describe('given MazPickerYearSwitcher component', () => {
  const defaultProps = {
    calendarDate: '2024-01-15',
    color: 'primary' as const,
    locale: 'en-US',
  }

  describe('when rendering with default props', () => {
    it('then it should render the year switcher', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-year-switcher').exists()).toBe(true)
    })

    it('then it should render 15 year buttons', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const yearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      expect(yearButtons.length).toBe(15)
    })

    it('then it should render the header with navigation and close buttons', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const headerBtns = wrapper.findAll('.maz-picker-year-switcher__header .m-btn')
      // Two navigation buttons (prev/next) and one close button
      expect(headerBtns.length).toBe(3)
    })

    it('then the years should be centered around the current calendar date year', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const yearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const yearLabels = yearButtons.map(b => b.text())

      // The range should be from 2024 - 7 = 2017 to 2024 + 7 = 2031
      expect(yearLabels).toContain('2024')
      expect(yearLabels).toContain('2017')
      expect(yearLabels).toContain('2031')
    })
  })

  describe('when the current year is selected', () => {
    it('then the selected year button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(1)
    })

    it('then the selected year button should have the color prop value', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: {
          ...defaultProps,
          color: 'success' as const,
        },
      })
      await vi.dynamicImportSettled()

      const yearBtns = wrapper.findAll('.maz-picker-year-switcher__main').at(0)!.findAllComponents(MazBtn)
      const selectedBtn = yearBtns.find(b => b.classes().includes('--is-selected'))
      expect(selectedBtn).toBeDefined()
      expect(selectedBtn!.props('color')).toBe('success')
    })

    it('then non-selected year buttons should have transparent color', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const yearBtns = wrapper.findAll('.maz-picker-year-switcher__main').at(0)!.findAllComponents(MazBtn)
      const nonSelected = yearBtns.filter(b => !b.classes().includes('--is-selected'))
      for (const btn of nonSelected) {
        expect(btn.props('color')).toBe('transparent')
      }
    })
  })

  describe('when a year button is clicked', () => {
    it('then it should emit update:calendar-date with the selected year', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const yearBtns = wrapper.findAll('.maz-picker-year-switcher__main').at(0)!.findAllComponents(MazBtn)
      await yearBtns[0].trigger('click') // Click first year

      const emitted = wrapper.emitted('update:calendar-date')
      expect(emitted).toBeTruthy()
      expect(emitted!.length).toBe(1)
    })

    it('then it should emit close event', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const yearBtns = wrapper.findAll('.maz-picker-year-switcher__main').at(0)!.findAllComponents(MazBtn)
      await yearBtns[0].trigger('click')

      const emitted = wrapper.emitted('close')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when the close button is clicked', () => {
    it('then it should emit close event', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      // The third button in the header is the close button
      const headerBtns = wrapper.findAll('.maz-picker-year-switcher__header .m-btn')
      await headerBtns[2].trigger('click')

      const emitted = wrapper.emitted('close')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when the previous years button is clicked', () => {
    it('then the year range should shift backwards by 7 years', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      // Get initial year labels
      const initialYearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const initialFirstYear = initialYearButtons[0].text()

      // Click previous button (first button in header)
      const headerBtns = wrapper.findAll('.maz-picker-year-switcher__header .m-btn')
      await headerBtns[0].trigger('click')

      // Year labels should shift
      const updatedYearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const updatedFirstYear = updatedYearButtons[0].text()

      expect(updatedFirstYear).not.toBe(initialFirstYear)
      // The shift should be 7 years back
      expect(Number(updatedFirstYear)).toBe(Number(initialFirstYear) - 7)
    })
  })

  describe('when the next years button is clicked', () => {
    it('then the year range should shift forward by 7 years', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      // Get initial year labels
      const initialYearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const initialFirstYear = initialYearButtons[0].text()

      // Click next button (second button in header)
      const headerBtns = wrapper.findAll('.maz-picker-year-switcher__header .m-btn')
      await headerBtns[1].trigger('click')

      // Year labels should shift
      const updatedYearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const updatedFirstYear = updatedYearButtons[0].text()

      expect(updatedFirstYear).not.toBe(initialFirstYear)
      expect(Number(updatedFirstYear)).toBe(Number(initialFirstYear) + 7)
    })
  })

  describe('when navigating back and forth multiple times', () => {
    it('then year range should update each time', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const headerBtns = wrapper.findAll('.maz-picker-year-switcher__header .m-btn')

      // Click next twice
      await headerBtns[1].trigger('click')
      await headerBtns[1].trigger('click')

      const yearButtonsAfterNext2 = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const firstYearAfterNext2 = yearButtonsAfterNext2[0].text()

      // Original first year was 2017, after +7 +7 should be 2031
      expect(Number(firstYearAfterNext2)).toBe(2017 + 14)

      // Click previous once
      await headerBtns[0].trigger('click')

      const yearButtonsAfterPrev = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const firstYearAfterPrev = yearButtonsAfterPrev[0].text()

      expect(Number(firstYearAfterPrev)).toBe(2017 + 14 - 7)
    })
  })

  describe('when different locales are used', () => {
    it('then year labels should be formatted according to the locale', async () => {
      const wrapperEN = mount(MazPickerYearSwitcher, {
        props: {
          ...defaultProps,
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      const enLabels = wrapperEN.findAll('.maz-picker-year-switcher__main .m-btn').map(b => b.text())

      // All labels should be valid year strings
      for (const label of enLabels) {
        expect(label.length).toBeGreaterThan(0)
      }
    })
  })

  describe('when different calendar dates are provided', () => {
    it('then years should center around that dates year', async () => {
      const wrapper = mount(MazPickerYearSwitcher, {
        props: {
          ...defaultProps,
          calendarDate: '2020-06-15',
        },
      })
      await vi.dynamicImportSettled()

      const yearButtons = wrapper.findAll('.maz-picker-year-switcher__main .m-btn')
      const yearLabels = yearButtons.map(b => b.text())

      expect(yearLabels).toContain('2020')
      expect(yearLabels).toContain('2013')
      expect(yearLabels).toContain('2027')
    })
  })
})
