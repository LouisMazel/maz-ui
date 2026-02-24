import MazBtn from '@components/MazBtn.vue'
import MazPickerTime from '@components/MazDatePicker/MazPickerTime.vue'
import { mount } from '@vue/test-utils'

describe('given MazPickerTime component', () => {
  const defaultProps = {
    color: 'primary' as const,
    hasDate: true,
    minuteInterval: 5,
    format: 'YYYY-MM-DD HH:mm',
    isHour12: false,
    disabled: false,
    formatterOptions: {} as Intl.DateTimeFormatOptions,
  }

  describe('when rendering with 24-hour format', () => {
    it('then it should render the time picker', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-date-picker-time').exists()).toBe(true)
    })

    it('then it should have 2 columns (hour and minute)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const columns = wrapper.findAll('.m-date-picker-time__column')
      expect(columns.length).toBe(2) // hour and minute
    })

    it('then the hour column should have 24 hour buttons', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(hourButtons.length).toBe(24)
    })

    it('then the minute column should have correct number of minute buttons', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 5,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAll('.m-date-picker-time__column__items .m-btn')
      // 60 / 5 = 12 intervals
      expect(minuteButtons.length).toBe(12)
    })
  })

  describe('when rendering with 12-hour format', () => {
    it('then it should have 3 columns (hour, minute, ampm)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const columns = wrapper.findAll('.m-date-picker-time__column')
      expect(columns.length).toBe(3) // hour, minute, ampm
    })

    it('then the hour column should have 12 hour buttons', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(hourButtons.length).toBe(12)
    })

    it('then the ampm column should have 2 buttons (AM and PM)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const ampmButtons = ampmColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(ampmButtons.length).toBe(2)
    })

    it('then the ampm buttons should display AM and PM', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const ampmButtons = ampmColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(ampmButtons[0].text()).toBe('AM')
      expect(ampmButtons[1].text()).toBe('PM')
    })

    it('then AM should be selected for morning hours', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T08:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const selectedAmpm = ampmColumn.findAll('.--is-selected')
      expect(selectedAmpm.length).toBe(1)
      expect(selectedAmpm[0].text()).toBe('AM')
    })

    it('then PM should be selected for afternoon hours', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T14:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const selectedAmpm = ampmColumn.findAll('.--is-selected')
      expect(selectedAmpm.length).toBe(1)
      expect(selectedAmpm[0].text()).toBe('PM')
    })
  })

  describe('when hasDate is true', () => {
    it('then the time picker should have --has-date class', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          hasDate: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-date-picker-time.--has-date').exists()).toBe(true)
    })
  })

  describe('when hasDate is false', () => {
    it('then the time picker should not have --has-date class', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          hasDate: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-date-picker-time.--has-date').exists()).toBe(false)
    })
  })

  describe('when the selected hour is shown', () => {
    it('then the current hour button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const selectedHours = hourColumn.findAll('.--is-selected')
      expect(selectedHours.length).toBe(1)
    })
  })

  describe('when the selected minute is shown', () => {
    it('then the current minute button should have --is-selected class', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 5,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const selectedMinutes = minuteColumn.findAll('.--is-selected')
      expect(selectedMinutes.length).toBe(1)
    })
  })

  describe('when an hour button is clicked', () => {
    it('then it should emit update:model-value', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAll('.m-date-picker-time__column__items .m-btn')
      await hourButtons[14].trigger('click') // Click hour 14

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when a minute button is clicked', () => {
    it('then it should emit update:model-value', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 5,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAll('.m-date-picker-time__column__items .m-btn')
      await minuteButtons[3].trigger('click') // Click minute 15

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when an ampm button is clicked in 12-hour mode', () => {
    it('then clicking AM when PM is selected should emit updated value', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T14:30:00', // 2:30 PM
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const ampmButtons = ampmColumn.findAll('.m-date-picker-time__column__items .m-btn')
      await ampmButtons[0].trigger('click') // Click AM

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
    })

    it('then clicking PM when AM is selected should emit updated value', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T08:30:00', // 8:30 AM
        },
      })
      await vi.dynamicImportSettled()

      const ampmColumn = wrapper.find('.m-date-picker-time__column__ampm')
      const ampmButtons = ampmColumn.findAll('.m-date-picker-time__column__items .m-btn')
      await ampmButtons[1].trigger('click') // Click PM

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
    })
  })

  describe('when disabled is true', () => {
    it('then all buttons should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          disabled: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const allButtons = wrapper.findAllComponents(MazBtn)
      for (const btn of allButtons) {
        expect(btn.props('disabled')).toBe(true)
      }
    })
  })

  describe('when disabledHours are set', () => {
    it('then matching hour buttons should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          disabledHours: [8, 9, 10],
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAllComponents(MazBtn)
      // Hours 8, 9, 10 should be disabled
      expect(hourButtons[8].props('disabled')).toBe(true)
      expect(hourButtons[9].props('disabled')).toBe(true)
      expect(hourButtons[10].props('disabled')).toBe(true)
    })

    it('then non-matching hour buttons should not be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          disabledHours: [8, 9, 10],
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAllComponents(MazBtn)
      // Hour 7 should not be disabled
      expect(hourButtons[7].props('disabled')).toBe(false)
    })
  })

  describe('when minDate is set', () => {
    it('then hours before minDate should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minDate: '2024-01-15T12:00:00',
          modelValue: '2024-01-15T14:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAllComponents(MazBtn)
      // Hours before 12 should be disabled
      expect(hourButtons[0].props('disabled')).toBe(true)
      expect(hourButtons[11].props('disabled')).toBe(true)
    })
  })

  describe('when maxDate is set', () => {
    it('then hours after maxDate should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          maxDate: '2024-01-15T16:00:00',
          modelValue: '2024-01-15T14:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAllComponents(MazBtn)
      // Hours after 16 should be disabled
      expect(hourButtons[17].props('disabled')).toBe(true)
      expect(hourButtons[23].props('disabled')).toBe(true)
    })
  })

  describe('when minuteInterval is 15', () => {
    it('then minute column should have 4 buttons (0, 15, 30, 45)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          minuteInterval: 15,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(minuteButtons.length).toBe(4)
      expect(minuteButtons[0].text()).toBe('00')
      expect(minuteButtons[1].text()).toBe('15')
      expect(minuteButtons[2].text()).toBe('30')
      expect(minuteButtons[3].text()).toBe('45')
    })
  })

  describe('when minuteInterval is 1', () => {
    it('then minute column should have 60 buttons', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          minuteInterval: 1,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(minuteButtons.length).toBe(60)
    })
  })

  describe('when model value is undefined', () => {
    it('then no hour or minute should be selected', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })
      await vi.dynamicImportSettled()

      const selectedButtons = wrapper.findAll('.--is-selected')
      expect(selectedButtons.length).toBe(0)
    })

    it('then currentHour should be undefined', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })
      await vi.dynamicImportSettled()

      // No selected hour buttons
      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const selectedHours = hourColumn.findAll('.--is-selected')
      expect(selectedHours.length).toBe(0)
    })
  })

  describe('when model value changes', () => {
    it('then the selected time should update', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      await wrapper.setProps({ modelValue: '2024-01-15T14:45:00' })
      await vi.dynamicImportSettled()

      // The selected hour should now be 14
      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const selectedHours = hourColumn.findAll('.--is-selected')
      expect(selectedHours.length).toBe(1)
    })
  })

  describe('when hour labels are formatted', () => {
    it('then hours under 10 should be zero-padded (24h format)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(hourButtons[0].text()).toBe('00')
      expect(hourButtons[1].text()).toBe('01')
      expect(hourButtons[9].text()).toBe('09')
      expect(hourButtons[10].text()).toBe('10')
    })

    it('then hours under 10 should be zero-padded (12h format)', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const hourButtons = hourColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(hourButtons[0].text()).toBe('01')
      expect(hourButtons[8].text()).toBe('09')
      expect(hourButtons[9].text()).toBe('10')
    })
  })

  describe('when minute labels are formatted', () => {
    it('then minutes under 10 should be zero-padded', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          minuteInterval: 5,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAll('.m-date-picker-time__column__items .m-btn')
      expect(minuteButtons[0].text()).toBe('00')
      expect(minuteButtons[1].text()).toBe('05')
    })
  })

  describe('when spacer divs are rendered', () => {
    it('then each column should have two spacer divs', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const spacers = wrapper.findAll('.m-date-picker-time__column__spacer')
      // 2 columns (hour + minute) * 2 spacers each = 4
      expect(spacers.length).toBe(4)
    })
  })

  describe('when isSelected is called for different identifiers', () => {
    it('then it should correctly identify selected hour', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const selectedHours = hourColumn.findAll('.--is-selected')
      expect(selectedHours.length).toBe(1)
      expect(selectedHours[0].text()).toBe('10')
    })

    it('then it should correctly identify selected minute', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 5,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const selectedMinutes = minuteColumn.findAll('.--is-selected')
      expect(selectedMinutes.length).toBe(1)
      expect(selectedMinutes[0].text()).toBe('30')
    })
  })

  describe('when no disabledHours are provided', () => {
    it('then findNearestHour should return the same hour', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          disabledHours: undefined,
          modelValue: '2024-01-15T10:30:00',
        },
      })
      await vi.dynamicImportSettled()

      const hourColumn = wrapper.find('.m-date-picker-time__column__hour')
      const selectedHours = hourColumn.findAll('.--is-selected')
      expect(selectedHours.length).toBe(1)
      expect(selectedHours[0].text()).toBe('10')
    })
  })

  describe('when minDate is set for minutes', () => {
    it('then minutes before minDate time should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 15,
          minDate: '2024-01-15T10:30:00',
          modelValue: '2024-01-15T10:45:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAllComponents(MazBtn)
      // Minutes 0 and 15 should be disabled (before 10:30)
      expect(minuteButtons[0].props('disabled')).toBe(true) // 00
      expect(minuteButtons[1].props('disabled')).toBe(true) // 15
    })
  })

  describe('when maxDate is set for minutes', () => {
    it('then minutes after maxDate time should be disabled', async () => {
      const wrapper = mount(MazPickerTime, {
        props: {
          ...defaultProps,
          isHour12: false,
          minuteInterval: 15,
          maxDate: '2024-01-15T10:30:00',
          modelValue: '2024-01-15T10:15:00',
        },
      })
      await vi.dynamicImportSettled()

      const minuteColumn = wrapper.find('.m-date-picker-time__column__minute')
      const minuteButtons = minuteColumn.findAllComponents(MazBtn)
      // Minutes 45 should be disabled (after 10:30)
      expect(minuteButtons[3].props('disabled')).toBe(true) // 45
    })
  })
})
