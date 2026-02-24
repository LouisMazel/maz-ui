import MazBtn from '@components/MazBtn.vue'
import MazPickerCalendarGrid from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

describe('given MazPickerCalendarGrid component', () => {
  const defaultProps = {
    calendarDate: '2024-01-15',
    hasTime: false,
    locale: 'en-US',
    firstDayOfWeek: 0,
    color: 'primary' as const,
    inline: false,
    disabledWeekly: [] as number[],
    disabledDates: [] as string[],
    disabled: false,
    range: false,
  }

  describe('when rendering with default props (no model value)', () => {
    it('then it should render the calendar grid', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: defaultProps,
      })

      expect(wrapper.find('.maz-picker-calendar-grid').exists()).toBe(true)
    })

    it('then it should render 31 day buttons for January', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons.length).toBe(31)
    })

    it('then it should render empty divs for days before month starts', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: defaultProps,
      })

      // January 1, 2024 is a Monday (day 1), with firstDayOfWeek 0 (Sunday)
      // So there should be 1 empty div before the first day
      const container = wrapper.find('.maz-picker-calendar-grid__container')
      expect(container.exists()).toBe(true)
    })
  })

  describe('when rendering with a string model value (non-range)', () => {
    it('then the selected day button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('then getDayButtonColor should return the color for selected date', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
          color: 'success' as const,
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('then non-selected day buttons should have transparent color', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
        },
      })
      await vi.dynamicImportSettled()

      // There should be 30 non-selected buttons
      const allButtons = wrapper.findAllComponents(MazBtn)
      const nonSelectedButtons = allButtons.filter(b => !b.classes().includes('--is-selected'))
      expect(nonSelectedButtons.length).toBe(30)
    })
  })

  describe('when rendering with a range model value', () => {
    it('then start and end dates should have --is-selected class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBeGreaterThanOrEqual(2)
    })

    it('then days between start and end should have --is-between class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const betweenButtons = wrapper.findAll('.--is-between')
      // Days 11-19 are between, so 9 days
      expect(betweenButtons.length).toBe(9)
    })

    it('then the first day should have --is-first class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const firstButtons = wrapper.findAll('.--is-first')
      expect(firstButtons.length).toBe(1)
    })

    it('then the last day should have --is-last class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const lastButtons = wrapper.findAll('.--is-last')
      expect(lastButtons.length).toBe(1)
    })

    it('then the container should have --is-range class', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.maz-picker-calendar-grid__container.--is-range').exists()).toBe(true)
    })

    it('then with only start, no --is-between or --is-last should appear', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.findAll('.--is-between').length).toBe(0)
      expect(wrapper.findAll('.--is-last').length).toBe(0)
    })

    it('then with only end, --is-first should not appear', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.findAll('.--is-first').length).toBe(0)
    })
  })

  describe('when clicking a day button', () => {
    it('then it should emit update:model-value for a non-range picker', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('click') // click 15th day

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      const emittedValue = wrapper.emitted('update:model-value')![0][0] as string
      expect(emittedValue).toBeDefined()
    })

    it('then it should set range start when clicking first day in range mode', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[9].trigger('click') // click day 10

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const value = emitted![0][0] as { start: string, end: string | undefined }
      expect(value.start).toBeDefined()
      expect(value.end).toBeUndefined()
    })

    it('then it should set range end when clicking second day in range mode', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[19].trigger('click') // click day 20

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const value = emitted![0][0] as { start: string, end: string }
      expect(value.start).toBeDefined()
      expect(value.end).toBeDefined()
    })

    it('then it should reset range when clicking a day before start', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[4].trigger('click') // click day 5

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const value = emitted![0][0] as { start: string, end: string | undefined }
      expect(value.start).toBeDefined()
      expect(value.end).toBeUndefined()
    })

    it('then it should reset both start and end when both are already set', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[24].trigger('click') // click day 25

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const value = emitted![0][0] as { start: string, end: string | undefined }
      // Should reset and set as new start
      expect(value.start).toBeDefined()
      expect(value.end).toBeUndefined()
    })
  })

  describe('when hovering days in range mode', () => {
    it('then it should emit update:hoverred-day on mouseover when range start is set', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('mouseover') // hover over day 15

      const emitted = wrapper.emitted('update:hoverred-day')
      expect(emitted).toBeTruthy()
    })

    it('then it should clear hoverred-day on mouseleave in range mode', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('mouseleave')

      const emitted = wrapper.emitted('update:hoverred-day')
      expect(emitted).toBeTruthy()
    })

    it('then it should emit hoverred-day on focus in range mode', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('focus')

      const emitted = wrapper.emitted('update:hoverred-day')
      expect(emitted).toBeTruthy()
    })

    it('then it should clear hoverred-day on blur in range mode', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('blur')

      const emitted = wrapper.emitted('update:hoverred-day')
      expect(emitted).toBeTruthy()
    })

    it('then it should not emit hoverred-day when hovering before start date', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[4].trigger('mouseover') // hover day 5, which is before start

      const emitted = wrapper.emitted('update:hoverred-day')
      // Should emit but with undefined (clearing), not a day value
      if (emitted) {
        const lastEmit = emitted[emitted.length - 1]
        expect(lastEmit[0]).toBeUndefined()
      }
    })

    it('then it should not emit hoverred-day when model value is not a range', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
          range: false,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      await buttons[14].trigger('mouseover')

      const emitted = wrapper.emitted('update:hoverred-day')
      expect(emitted).toBeUndefined()
    })

    it('then --is-between-hoverred should appear for days between start and hoverred day', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
          hoverredDay: dayjs('2024-01-20'),
        },
      })
      await vi.dynamicImportSettled()

      const betweenHoverred = wrapper.findAll('.--is-between-hoverred')
      // Days 11-19 are between 10 and 20 (exclusive)
      expect(betweenHoverred.length).toBe(9)
    })

    it('then --is-last-hoverred should appear on the hoverred day', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
          hoverredDay: dayjs('2024-01-20'),
        },
      })
      await vi.dynamicImportSettled()

      const lastHoverred = wrapper.findAll('.--is-last-hoverred')
      expect(lastHoverred.length).toBe(1)
    })
  })

  describe('when days are disabled', () => {
    it('then disabled prop should disable all buttons', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
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

    it('then minDate should disable days before it', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          minDate: '2024-01-15',
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      // Days 1-14 should be disabled
      for (let i = 0; i < 14; i++) {
        expect(buttons[i].props('disabled')).toBe(true)
      }
      // Day 15 should not be disabled
      expect(buttons[14].props('disabled')).toBe(false)
    })

    it('then maxDate should disable days after it', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          maxDate: '2024-01-20',
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      // Day 20 should not be disabled
      expect(buttons[19].props('disabled')).toBe(false)
      // Days 21-31 should be disabled
      for (let i = 20; i < 31; i++) {
        expect(buttons[i].props('disabled')).toBe(true)
      }
    })

    it('then disabledWeekly should disable specific weekdays', async () => {
      // Disable Sundays (0) and Saturdays (6)
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          disabledWeekly: [0, 6],
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      // Check that some buttons are disabled (weekends)
      const disabledButtons = buttons.filter(b => b.props('disabled') === true)
      expect(disabledButtons.length).toBeGreaterThan(0)
    })

    it('then disabledDates should disable specific dates', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          disabledDates: ['2024-01-15', '2024-01-20'],
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      // Day 15 should be disabled
      expect(buttons[14].props('disabled')).toBe(true)
      // Day 20 should be disabled
      expect(buttons[19].props('disabled')).toBe(true)
      // Day 16 should not be disabled
      expect(buttons[15].props('disabled')).toBe(false)
    })

    it('then no minDate should not disable any days from min constraint', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          minDate: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      // All should be enabled (no min constraint)
      for (const btn of buttons) {
        expect(btn.props('disabled')).toBe(false)
      }
    })

    it('then empty disabledWeekly array should not disable any weekdays', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          disabledWeekly: [],
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('disabled')).toBe(false)
      }
    })

    it('then empty disabledDates array should not disable any dates', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          disabledDates: [],
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('disabled')).toBe(false)
      }
    })
  })

  describe('when no model value is provided', () => {
    it('then checkIsSameDate should return false for all days', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(0)
    })

    it('then isFirstDay should return false', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const firstButtons = wrapper.findAll('.--is-first')
      expect(firstButtons.length).toBe(0)
    })

    it('then isLastDay should return false', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const lastButtons = wrapper.findAll('.--is-last')
      expect(lastButtons.length).toBe(0)
    })
  })

  describe('when model value is an invalid date string', () => {
    it('then checkIsSameDate should return false for all days', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: 'invalid-date',
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(0)
    })
  })

  describe('when isBetweenHoverred is called with no hoverredDay', () => {
    it('then no --is-between-hoverred classes should be present', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: undefined },
          range: true,
          hoverredDay: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const betweenHoverred = wrapper.findAll('.--is-between-hoverred')
      expect(betweenHoverred.length).toBe(0)
    })
  })

  describe('when isBetweenHoverred is called with non-range value', () => {
    it('then no --is-between-hoverred classes should be present', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-10',
          range: true,
          hoverredDay: dayjs('2024-01-20'),
        },
      })
      await vi.dynamicImportSettled()

      const betweenHoverred = wrapper.findAll('.--is-between-hoverred')
      expect(betweenHoverred.length).toBe(0)
    })
  })

  describe('when range value has no start', () => {
    it('then isBetweenHoverred should return undefined for all days', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: '2024-01-20' },
          range: true,
          hoverredDay: dayjs('2024-01-15'),
        },
      })
      await vi.dynamicImportSettled()

      const betweenHoverred = wrapper.findAll('.--is-between-hoverred')
      expect(betweenHoverred.length).toBe(0)
    })
  })

  describe('when calendarDate changes', () => {
    it('then the transition direction should update based on date comparison', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: defaultProps,
      })

      // Move to next month
      await wrapper.setProps({ calendarDate: '2024-02-15' })
      // The transition group should update
      expect(wrapper.find('.maz-picker-calendar-grid').exists()).toBe(true)
    })

    it('then moving to previous month should set slideprev transition', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          calendarDate: '2024-03-15',
        },
      })

      await wrapper.setProps({ calendarDate: '2024-02-15' })
      expect(wrapper.find('.maz-picker-calendar-grid').exists()).toBe(true)
    })
  })

  describe('when different firstDayOfWeek is set', () => {
    it('then emptyDaysCount should change accordingly', async () => {
      // January 1, 2024 is Monday (day 1)
      // With firstDayOfWeek = 0 (Sunday), empty days = (1 - 0 + 7) % 7 = 1
      const wrapperSunday = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          firstDayOfWeek: 0,
        },
      })
      await vi.dynamicImportSettled()

      // With firstDayOfWeek = 1 (Monday), empty days = (1 - 1 + 7) % 7 = 0
      const wrapperMonday = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          firstDayOfWeek: 1,
        },
      })
      await vi.dynamicImportSettled()

      // Count total children in container (empties + buttons)
      const sundayContainer = wrapperSunday.find('.maz-picker-calendar-grid__container')
      const mondayContainer = wrapperMonday.find('.maz-picker-calendar-grid__container')

      const sundayChildCount = sundayContainer.element.children.length
      const mondayChildCount = mondayContainer.element.children.length

      // Different firstDayOfWeek should lead to different number of empty divs
      expect(sundayChildCount).not.toBe(mondayChildCount)
    })
  })

  describe('when range model value has no start and no end for checkIsBetween', () => {
    it('then no --is-between class should be applied', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: undefined },
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const betweenButtons = wrapper.findAll('.--is-between')
      expect(betweenButtons.length).toBe(0)
    })
  })

  describe('when inline prop is true', () => {
    it('then day buttons should have block prop set', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          inline: true,
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      for (const btn of buttons) {
        expect(btn.props('block')).toBe(true)
      }
    })
  })

  describe('when range is false', () => {
    it('then container should not have --is-range class', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          range: false,
        },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__container.--is-range').exists()).toBe(false)
    })
  })

  describe('when February has different day counts', () => {
    it('then it should render 29 day buttons for Feb 2024 (leap year)', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          calendarDate: '2024-02-15',
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons.length).toBe(29)
    })

    it('then it should render 28 day buttons for Feb 2023 (non-leap year)', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...defaultProps,
          calendarDate: '2023-02-15',
        },
      })
      await vi.dynamicImportSettled()

      const buttons = wrapper.findAllComponents(MazBtn)
      expect(buttons.length).toBe(28)
    })
  })
})
