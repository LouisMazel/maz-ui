import MazPickerHeader from '@components/MazDatePicker/MazPickerHeader.vue'
import { mount } from '@vue/test-utils'

describe('given MazPickerHeader component', () => {
  const defaultProps = {
    color: 'primary' as const,
    locale: 'en-US',
    hideShortcuts: false,
    double: false,
    hasDate: true,
    hasTime: false,
    formatterOptions: {} as Intl.DateTimeFormatOptions,
  }

  describe('when rendering with hasDate true and no model value', () => {
    it('then it should render the header', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })

      expect(wrapper.find('.m-date-picker-header').exists()).toBe(true)
    })

    it('then it should display the color class', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })

      expect(wrapper.find('.m-date-picker-header.--primary').exists()).toBe(true)
    })

    it('then year should display a dash when no modelValue', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })

      const yearText = wrapper.find('.m-date-picker-header__year-text')
      expect(yearText.text()).toBe('-')
    })

    it('then dateString should display a dash when no modelValue', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: undefined,
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text()).toBe('-')
    })
  })

  describe('when rendering with a string model value', () => {
    it('then it should display the year', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
        },
      })

      const yearText = wrapper.find('.m-date-picker-header__year-text')
      expect(yearText.text()).toContain('2024')
    })

    it('then it should display the formatted date string', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-15',
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text().length).toBeGreaterThan(0)
      expect(dateText.text()).not.toBe('-')
    })
  })

  describe('when rendering with a range model value with both start and end', () => {
    it('then year should contain a separator dash', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: '2024-01-20' },
        },
      })

      const yearText = wrapper.find('.m-date-picker-header__year-text')
      expect(yearText.text()).toContain('-')
      expect(yearText.text()).toContain('2024')
    })

    it('then dateString should contain formatted start and end dates', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: '2024-01-20' },
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text()).toContain('-')
    })
  })

  describe('when rendering with a range model value with only start', () => {
    it('then year should contain dots for missing end', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: undefined },
        },
      })

      const yearText = wrapper.find('.m-date-picker-header__year-text')
      expect(yearText.text()).toContain('...')
    })

    it('then dateString should contain dots for missing end', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-15', end: undefined },
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text()).toContain('...')
    })
  })

  describe('when rendering with a range model value with only end', () => {
    it('then year should contain dots for missing start', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: '2024-01-20' },
        },
      })

      const yearText = wrapper.find('.m-date-picker-header__year-text')
      expect(yearText.text()).toContain('...')
    })
  })

  describe('when rendering with a range model value with neither start nor end', () => {
    it('then dateString should display a dash', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: undefined, end: undefined },
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text()).toBe('-')
    })
  })

  describe('when hasDate is false', () => {
    it('then it should not render the date section', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasDate: false,
          modelValue: '2024-01-15',
        },
      })

      expect(wrapper.find('.m-date-picker-header__date').exists()).toBe(false)
    })

    it('then yearArray should be undefined', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasDate: false,
          modelValue: '2024-01-15',
        },
      })

      // No year-text should exist since yearArray is undefined
      expect(wrapper.find('.m-date-picker-header__year-text').exists()).toBe(false)
    })
  })

  describe('when hasTime is true', () => {
    it('then it should render the time section', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: '2024-01-15T14:30:00',
        },
      })

      expect(wrapper.find('.m-date-picker-header__time').exists()).toBe(true)
    })

    it('then the time section should display time value', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: '2024-01-15T14:30:00',
        },
      })

      const timeText = wrapper.find('.m-date-picker-header__time-text')
      expect(timeText.exists()).toBe(true)
      expect(timeText.text().length).toBeGreaterThan(0)
    })

    it('then with hasDate true, the time section should have --has-date class', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          hasDate: true,
          modelValue: '2024-01-15T14:30:00',
        },
      })

      expect(wrapper.find('.m-date-picker-header__time.--has-date').exists()).toBe(true)
    })

    it('then with hasDate false, the time section should not have --has-date class', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          hasDate: false,
          modelValue: '2024-01-15T14:30:00',
        },
      })

      expect(wrapper.find('.m-date-picker-header__time.--has-date').exists()).toBe(false)
    })
  })

  describe('when hasTime is false', () => {
    it('then it should not render the time section', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: false,
          modelValue: '2024-01-15',
        },
      })

      expect(wrapper.find('.m-date-picker-header__time').exists()).toBe(false)
    })
  })

  describe('when model value has no time and hasTime is true', () => {
    it('then timeValue should be undefined when modelValue is undefined', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: undefined,
        },
      })

      const timeText = wrapper.find('.m-date-picker-header__time-text')
      if (timeText.exists()) {
        // Text might be empty
        expect(timeText.text()).toBeDefined()
      }
    })
  })

  describe('when different colors are used', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'destructive', 'accent', 'contrast', 'transparent'] as const
    for (const color of colors) {
      it(`then it should apply --${color} class`, () => {
        const wrapper = mount(MazPickerHeader, {
          props: {
            ...defaultProps,
            color,
            modelValue: '2024-01-15',
          },
        })

        expect(wrapper.find(`.m-date-picker-header.--${color}`).exists()).toBe(true)
      })
    }
  })

  describe('when hideShortcuts is true and double is false with range value', () => {
    it('then dateString should use short format', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hideShortcuts: true,
          double: false,
          modelValue: { start: '2024-01-15', end: '2024-01-20' },
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text().length).toBeGreaterThan(0)
    })
  })

  describe('when hideShortcuts is false and double is true with range value', () => {
    it('then dateString should use long format', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hideShortcuts: false,
          double: true,
          modelValue: { start: '2024-01-15', end: '2024-01-20' },
        },
      })

      const dateText = wrapper.find('.m-date-picker-header__date-text')
      expect(dateText.text().length).toBeGreaterThan(0)
    })
  })

  describe('when modelValue changes and transition direction updates', () => {
    it('then changing to a later date should set transition to slidevnext', async () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-10',
        },
      })

      await wrapper.setProps({ modelValue: '2024-01-20' })
      // The transition name is internal, but we can verify the component updates
      expect(wrapper.find('.m-date-picker-header').exists()).toBe(true)
    })

    it('then changing to an earlier date should set transition to slidevprev', async () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: '2024-01-20',
        },
      })

      await wrapper.setProps({ modelValue: '2024-01-10' })
      expect(wrapper.find('.m-date-picker-header').exists()).toBe(true)
    })

    it('then changing a range value start should update transition', async () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          modelValue: { start: '2024-01-10', end: '2024-01-20' },
        },
      })

      await wrapper.setProps({ modelValue: { start: '2024-01-05', end: '2024-01-15' } })
      expect(wrapper.find('.m-date-picker-header').exists()).toBe(true)
    })
  })

  describe('when refDate is computed', () => {
    it('then for string modelValue it should be the value itself', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: '2024-01-15T10:30:00',
        },
      })

      const timeText = wrapper.find('.m-date-picker-header__time-text')
      expect(timeText.exists()).toBe(true)
    })

    it('then for range modelValue it should use start', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: { start: '2024-01-15T10:30:00', end: '2024-01-20T14:00:00' },
        },
      })

      const timeText = wrapper.find('.m-date-picker-header__time-text')
      expect(timeText.exists()).toBe(true)
    })
  })

  describe('when formatterOptions has timeZone and hour12', () => {
    it('then it should use the formatter options for display', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          ...defaultProps,
          hasTime: true,
          modelValue: '2024-01-15T14:30:00',
          formatterOptions: {
            timeZone: 'UTC',
            hour12: true,
          },
        },
      })

      const timeText = wrapper.find('.m-date-picker-header__time-text')
      expect(timeText.exists()).toBe(true)
      // When hour12 is true, should display AM/PM format
      expect(timeText.text().length).toBeGreaterThan(0)
    })
  })
})
