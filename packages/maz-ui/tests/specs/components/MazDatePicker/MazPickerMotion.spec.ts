import MazPickerCalendarGrid from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue'
import MazPickerCalendarSwitcher from '@components/MazDatePicker/MazPickerCalendarSwitcher.vue'
import MazPickerHeader from '@components/MazDatePicker/MazPickerHeader.vue'
import MazRollingText from '@components/MazRollingText.vue'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs/esm/index.js'
import isBetween from 'dayjs/esm/plugin/isBetween/index.js'
import { nextTick } from 'vue'

dayjs.extend(isBetween)

describe('given the motion of the date picker', () => {
  const gridProps = {
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

  describe('when the header displays a date', () => {
    it('then the year, the date and the time are rolling texts', () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          color: 'primary',
          locale: 'en-US',
          hideShortcuts: false,
          double: false,
          hasDate: true,
          hasTime: true,
          formatterOptions: {},
          modelValue: '2024-01-15T10:30:00',
        },
      })

      expect(wrapper.findAllComponents(MazRollingText)).toHaveLength(3)
    })

    it('then a later date rolls up and an earlier date rolls down', async () => {
      const wrapper = mount(MazPickerHeader, {
        props: {
          color: 'primary',
          locale: 'en-US',
          hideShortcuts: false,
          double: false,
          hasDate: true,
          hasTime: false,
          formatterOptions: {},
          modelValue: '2024-01-15',
        },
      })

      await wrapper.setProps({ modelValue: '2024-01-20' })
      expect(wrapper.findComponent(MazRollingText).props('direction')).toBe('up')

      await wrapper.setProps({ modelValue: '2024-01-10' })
      expect(wrapper.findComponent(MazRollingText).props('direction')).toBe('down')
    })
  })

  describe('when the calendar switcher changes month', () => {
    it('then the month and the year are rolling texts', () => {
      const wrapper = mount(MazPickerCalendarSwitcher, {
        props: { calendarDate: '2024-01-15', locale: 'en-US', double: false },
      })

      expect(wrapper.findAllComponents(MazRollingText)).toHaveLength(2)
    })

    it('then going back rolls down and going forward rolls up', async () => {
      const wrapper = mount(MazPickerCalendarSwitcher, {
        props: { calendarDate: '2024-03-15', locale: 'en-US', double: false },
      })

      await wrapper.setProps({ calendarDate: '2024-02-15' })
      expect(wrapper.findComponent(MazRollingText).props('direction')).toBe('down')

      await wrapper.setProps({ calendarDate: '2024-04-15' })
      expect(wrapper.findComponent(MazRollingText).props('direction')).toBe('up')
    })
  })

  describe('when the grid shows a single selected day', () => {
    it('then it renders the indicator of the selected day', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15' },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').exists()).toBe(true)
    })

    it('then the indicator is translated on both axes', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15' },
        attachTo: document.body,
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').attributes('style')).toMatch(/transform: translate\(/)

      wrapper.unmount()
    })

    it('then the indicator uses the color of the picker', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15', color: 'success' },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').attributes('style')).toContain('--maz-success')
    })

    it('then there is no indicator without a value', () => {
      const wrapper = mount(MazPickerCalendarGrid, { props: gridProps })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').exists()).toBe(false)
    })

    it('then there is no indicator when the selected day is in another month', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-03-15' },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').exists()).toBe(false)
    })

    it('then there is no indicator for a color without token', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15', color: 'transparent' },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').exists()).toBe(false)
    })

    it('then there is no indicator in range mode', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, range: true, modelValue: { start: '2024-01-15', end: undefined } },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').exists()).toBe(false)
    })
  })

  describe('when a day is selected', () => {
    it('then a keyboard activation makes the indicator instant', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15' },
      })

      await wrapper.find('[data-date="2024-01-20"]').trigger('click', { detail: 0 })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').attributes('style')).toContain('transition-duration: 0s')
    })

    it('then a pointer click keeps the transition', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, modelValue: '2024-01-15' },
      })

      await wrapper.find('[data-date="2024-01-20"]').trigger('click', { detail: 1 })

      expect(wrapper.find('.maz-picker-calendar-grid__indicator').attributes('style')).not.toContain('transition-duration: 0s')
    })
  })

  describe('when a range is being picked', () => {
    const rangeProps = {
      ...gridProps,
      range: true,
      modelValue: { start: '2024-01-10', end: undefined },
    }

    it('then the number of days between the start and the hovered day is a rolling number', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...rangeProps, hoverredDay: dayjs('2024-01-14') },
      })
      await nextTick()

      expect(wrapper.find('.maz-picker-calendar-grid__count').exists()).toBe(true)
      expect(wrapper.find('.maz-picker-calendar-grid__count').findComponent(MazRollingText).props('value')).toBe(5)
    })

    it('then the count is hidden without hovered day', () => {
      const wrapper = mount(MazPickerCalendarGrid, { props: rangeProps })

      expect(wrapper.find('.maz-picker-calendar-grid__count').exists()).toBe(false)
    })

    it('then the count is hidden once the range is complete', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: {
          ...rangeProps,
          modelValue: { start: '2024-01-10', end: '2024-01-14' },
          hoverredDay: dayjs('2024-01-16'),
        },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__count').exists()).toBe(false)
    })

    it('then the count follows a keyboard move without transition', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...rangeProps, hoverredDay: dayjs('2024-01-14') },
      })

      await wrapper.find('[data-date="2024-01-14"]').trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.find('.maz-picker-calendar-grid__count').attributes('style')).toContain('transition-duration: 0s')
    })
  })

  describe('when the month changes', () => {
    it('then the slide goes toward the end in LTR and the opposite way in RTL', async () => {
      const wrapper = mount(MazPickerCalendarGrid, { props: gridProps, attachTo: document.body })

      await wrapper.setProps({ calendarDate: '2024-02-15' })
      expect(wrapper.find('.maz-picker-calendar-grid').attributes('style')).toContain('--m-picker-slide: 1')

      wrapper.element.style.direction = 'rtl'
      await wrapper.setProps({ calendarDate: '2024-03-15' })
      expect(wrapper.find('.maz-picker-calendar-grid').attributes('style')).toContain('--m-picker-slide: -1')

      await wrapper.setProps({ calendarDate: '2024-02-15' })
      expect(wrapper.find('.maz-picker-calendar-grid').attributes('style')).toContain('--m-picker-slide: 1')

      wrapper.unmount()
    })

    it('then going back slides toward the start', async () => {
      const wrapper = mount(MazPickerCalendarGrid, { props: { ...gridProps, calendarDate: '2024-03-15' } })

      await wrapper.setProps({ calendarDate: '2024-02-15' })

      expect(wrapper.find('.maz-picker-calendar-grid').attributes('style')).toContain('--m-picker-slide: -1')
    })
  })
})
