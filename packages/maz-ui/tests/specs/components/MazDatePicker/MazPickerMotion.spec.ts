import MazPickerCalendarGrid from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue'
import gridSource from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue?raw'
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

describe('given the range count and the range band of the date picker', () => {
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
    range: true,
    modelValue: { start: '2024-01-10', end: undefined },
  }

  describe('when the hovered day changes while the count is shown', () => {
    it('then the same count follows the day and rolls its number', async () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, hoverredDay: dayjs('2024-01-14') },
      })
      await nextTick()
      await nextTick()

      const count = wrapper.find('.maz-picker-calendar-grid__count').element

      await wrapper.setProps({ hoverredDay: dayjs('2024-01-16') })
      await nextTick()

      expect(wrapper.find('.maz-picker-calendar-grid__count').element).toBe(count)
      expect(wrapper.find('.maz-picker-calendar-grid__count').findComponent(MazRollingText).props('value')).toBe(7)
    })
  })

  describe('when the hovered day is lost then found again right away', () => {
    it('then the count stays and keeps its transition', async () => {
      vi.useFakeTimers()
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, hoverredDay: dayjs('2024-01-14') },
      })
      await nextTick()
      await nextTick()

      const count = wrapper.find('.maz-picker-calendar-grid__count').element

      await wrapper.setProps({ hoverredDay: undefined })
      await vi.advanceTimersByTimeAsync(20)
      await wrapper.setProps({ hoverredDay: dayjs('2024-01-17') })
      await vi.advanceTimersByTimeAsync(200)

      expect(wrapper.find('.maz-picker-calendar-grid__count').element).toBe(count)
      expect(wrapper.find('.maz-picker-calendar-grid__count').findComponent(MazRollingText).props('value')).toBe(8)

      vi.useRealTimers()
    })
  })

  describe('when the hovered day is lost for good', () => {
    it('then the count is removed after a short delay', async () => {
      vi.useFakeTimers()
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, hoverredDay: dayjs('2024-01-14') },
      })
      await nextTick()
      await nextTick()

      await wrapper.setProps({ hoverredDay: undefined })
      await vi.advanceTimersByTimeAsync(500)

      expect(wrapper.find('.maz-picker-calendar-grid__count').exists()).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('when the count appears again after being removed', () => {
    it('then it is placed without transition', async () => {
      vi.useFakeTimers()
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, hoverredDay: dayjs('2024-01-14') },
      })
      await nextTick()
      await nextTick()
      await wrapper.setProps({ hoverredDay: undefined })
      await vi.advanceTimersByTimeAsync(500)

      await wrapper.setProps({ hoverredDay: dayjs('2024-01-18') })
      await nextTick()
      await nextTick()

      expect(wrapper.find('.maz-picker-calendar-grid__count').attributes('style')).toContain('transition-duration: 0s')

      vi.useRealTimers()
    })
  })

  describe('when a range is displayed', () => {
    it('then the container gives the band colors derived from the color and the surface', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, color: 'success', modelValue: { start: '2024-01-10', end: '2024-01-14' } },
      })

      const style = wrapper.find('.maz-picker-calendar-grid__container').attributes('style') ?? ''

      expect(style).toContain('--m-range-band:')
      expect(style).toContain('--m-range-band-dark:')
      expect(style).toContain('var(--maz-success)')
      expect(style).toContain('var(--maz-surface)')
    })

    it('then a single date picker has no band colors', () => {
      const wrapper = mount(MazPickerCalendarGrid, {
        props: { ...gridProps, range: false, modelValue: '2024-01-10' },
      })

      expect(wrapper.find('.maz-picker-calendar-grid__container').attributes('style') ?? '').not.toContain('--m-range-band')
    })

    it('then the start and end caps use logical corners', () => {
      expect(gridSource).toContain('maz:rounded-e-none!')
      expect(gridSource).toContain('maz:rounded-s-none!')
      expect(gridSource).not.toContain('rounded-r-none')
      expect(gridSource).not.toContain('rounded-l-none')
    })

    it('then the hovered day of the band keeps the foreground color', () => {
      expect(gridSource).not.toContain('hoverTextColor')
      expect(gridSource).toContain('--m-range-band-hover')
    })
  })
})
