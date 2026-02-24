import MazPickerCalendarDays from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarDays.vue'
import MazPickerCalendarGrid from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue'
import MazPickerCalendarMonth from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarMonth.vue'
import { mount, shallowMount } from '@vue/test-utils'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

describe('given MazPickerCalendarMonth component', () => {
  const defaultProps = {
    calendarDate: '2024-01-15',
    locale: 'en-US',
    hasTime: false,
    firstDayOfWeek: 0,
    color: 'primary' as const,
    inline: false,
    disabledWeekly: [] as number[],
    disabledDates: [] as string[],
    disabled: false,
    range: false,
  }

  describe('when rendering with default props', () => {
    it('then it should render the month container', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: defaultProps,
      })

      expect(wrapper.find('.maz-picker-calendar-month').exists()).toBe(true)
    })

    it('then it should render MazPickerCalendarDays', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: defaultProps,
      })

      expect(wrapper.findComponent(MazPickerCalendarDays).exists()).toBe(true)
    })

    it('then it should render MazPickerCalendarGrid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: defaultProps,
      })

      expect(wrapper.findComponent(MazPickerCalendarGrid).exists()).toBe(true)
    })
  })

  describe('when range is false', () => {
    it('then it should have --has-padding class', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          range: false,
        },
      })

      expect(wrapper.find('.maz-picker-calendar-month.--has-padding').exists()).toBe(true)
    })
  })

  describe('when range is true', () => {
    it('then it should not have --has-padding class', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          range: true,
        },
      })

      expect(wrapper.find('.maz-picker-calendar-month.--has-padding').exists()).toBe(false)
    })
  })

  describe('when offsetMonth is 0 (default)', () => {
    it('then the grid should receive the same calendarDate', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          offsetMonth: 0,
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      // The calendarDate should be the same month (offset 0)
      const gridCalendarDate = grid.props('calendarDate')
      expect(dayjs(gridCalendarDate).month()).toBe(dayjs('2024-01-15').month())
    })
  })

  describe('when offsetMonth is 1', () => {
    it('then the grid should receive the next months calendarDate', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          offsetMonth: 1,
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      const gridCalendarDate = grid.props('calendarDate')
      // Should be February (month index 1)
      expect(dayjs(gridCalendarDate).month()).toBe(1)
    })
  })

  describe('when model value is provided', () => {
    it('then it should pass modelValue to the grid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('modelValue')).toBe('2024-01-15')
    })
  })

  describe('when model value is a range', () => {
    it('then it should pass the range value to the grid', () => {
      const rangeValue = { start: '2024-01-10', end: '2024-01-20' }
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          modelValue: rangeValue,
          range: true,
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('modelValue')).toEqual(rangeValue)
    })
  })

  describe('when grid emits update:model-value', () => {
    it('then it should re-emit update:model-value', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: defaultProps,
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      grid.vm.$emit('update:model-value', '2024-01-20')

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0][0]).toBe('2024-01-20')
    })
  })

  describe('when grid emits update:hoverred-day', () => {
    it('then it should re-emit update:hoverred-day', () => {
      const hoverDay = dayjs('2024-01-20')
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: defaultProps,
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      grid.vm.$emit('update:hoverred-day', hoverDay)

      expect(wrapper.emitted('update:hoverred-day')).toBeTruthy()
    })
  })

  describe('when hoverredDay prop is provided', () => {
    it('then it should pass hoverredDay to the grid', () => {
      const hoverDay = dayjs('2024-01-20')
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          hoverredDay: hoverDay,
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('hoverredDay')).toBeDefined()
    })
  })

  describe('when locale is passed', () => {
    it('then it should pass locale to MazPickerCalendarDays', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          locale: 'fr-FR',
        },
      })

      const days = wrapper.findComponent(MazPickerCalendarDays)
      expect(days.props('locale')).toBe('fr-FR')
    })

    it('then it should pass locale to MazPickerCalendarGrid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          locale: 'fr-FR',
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('locale')).toBe('fr-FR')
    })
  })

  describe('when firstDayOfWeek is passed', () => {
    it('then it should pass firstDayOfWeek to MazPickerCalendarDays', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          firstDayOfWeek: 1,
        },
      })

      const days = wrapper.findComponent(MazPickerCalendarDays)
      expect(days.props('firstDayOfWeek')).toBe(1)
    })
  })

  describe('when minDate and maxDate are passed', () => {
    it('then it should pass minDate to the grid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          minDate: '2024-01-05',
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('minDate')).toBe('2024-01-05')
    })

    it('then it should pass maxDate to the grid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          maxDate: '2024-01-25',
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('maxDate')).toBe('2024-01-25')
    })
  })

  describe('when disabled is true', () => {
    it('then it should pass disabled to the grid', () => {
      const wrapper = shallowMount(MazPickerCalendarMonth, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      })

      const grid = wrapper.findComponent(MazPickerCalendarGrid)
      expect(grid.props('disabled')).toBe(true)
    })
  })

  describe('when using full mount with all sub-components', () => {
    it('then it should render day labels and day buttons', async () => {
      const wrapper = mount(MazPickerCalendarMonth, {
        props: defaultProps,
      })
      await vi.dynamicImportSettled()

      // Should have 7 day labels
      const dayLabels = wrapper.findAll('.maz-picker-calendar-days span')
      expect(dayLabels).toHaveLength(7)
    })
  })
})
