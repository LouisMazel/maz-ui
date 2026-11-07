import MazPickerCalendarDays from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarDays.vue'
import { mount } from '@vue/test-utils'

describe('given MazPickerCalendarDays component', () => {
  describe('when rendering with locale en-US and firstDayOfWeek 0 (Sunday)', () => {
    it('then it should render 7 day labels', () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const spans = wrapper.findAll('span')
      expect(spans).toHaveLength(7)
    })

    it('then the root element should have the correct class', () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      expect(wrapper.find('.maz-picker-calendar-days').exists()).toBe(true)
    })

    it('then day labels should be short weekday names', () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const spans = wrapper.findAll('span')
      // Each should have a text content with a short day name
      for (const span of spans) {
        expect(span.text().length).toBeGreaterThan(0)
      }
    })
  })

  describe('when rendering with firstDayOfWeek 1 (Monday)', () => {
    it('then it should still render 7 day labels', () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 1,
        },
      })

      const spans = wrapper.findAll('span')
      expect(spans).toHaveLength(7)
    })

    it('then the first day should differ from firstDayOfWeek 0', () => {
      const wrapperSunday = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const wrapperMonday = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 1,
        },
      })

      const sundayLabels = wrapperSunday.findAll('span').map(s => s.text())
      const mondayLabels = wrapperMonday.findAll('span').map(s => s.text())

      // The order should be different since week starts on different days
      expect(sundayLabels[0]).not.toBe(mondayLabels[0])
    })
  })

  describe('when rendering with different locales', () => {
    it('then it should render day names in the requested locale', () => {
      const wrapperEN = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const wrapperFR = mount(MazPickerCalendarDays, {
        props: {
          locale: 'fr-FR',
          firstDayOfWeek: 0,
        },
      })

      const enLabels = wrapperEN.findAll('span').map(s => s.text())
      const frLabels = wrapperFR.findAll('span').map(s => s.text())

      // Different locales should produce different labels (at least some)
      expect(enLabels).not.toEqual(frLabels)
    })
  })

  describe('when changing props reactively', () => {
    it('then it should update the days when locale changes', async () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const initialLabels = wrapper.findAll('span').map(s => s.text())

      await wrapper.setProps({ locale: 'fr-FR' })

      const updatedLabels = wrapper.findAll('span').map(s => s.text())
      expect(initialLabels).not.toEqual(updatedLabels)
    })

    it('then it should update the days when firstDayOfWeek changes', async () => {
      const wrapper = mount(MazPickerCalendarDays, {
        props: {
          locale: 'en-US',
          firstDayOfWeek: 0,
        },
      })

      const initialLabels = wrapper.findAll('span').map(s => s.text())

      await wrapper.setProps({ firstDayOfWeek: 1 })

      const updatedLabels = wrapper.findAll('span').map(s => s.text())
      expect(initialLabels).not.toEqual(updatedLabels)
    })
  })
})
