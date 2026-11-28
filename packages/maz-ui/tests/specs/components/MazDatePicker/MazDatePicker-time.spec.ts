import MazDatePicker from '@components/MazDatePicker.vue'
import MazTimePickerPanel from '@components/MazTimePicker/MazTimePickerPanel.vue'
import MazTimePickerWheel from '@components/MazTimePicker/MazTimePickerWheel.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

type Props = Record<string, unknown>

async function mountPicker(props: Props = {}, attachTo?: HTMLElement) {
  const wrapper = mount(MazDatePicker, {
    props: {
      inline: true,
      locale: 'en-US',
      time: true,
      format: 'YYYY-MM-DD HH:mm',
      modelValue: '2024-01-15 10:30',
      ...props,
    },
    attachTo,
  })

  await vi.dynamicImportSettled()
  await nextTick()

  return wrapper
}

function wheels(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents(MazTimePickerWheel)
}

function lastEmitted(wrapper: ReturnType<typeof mount>) {
  const events = wrapper.emitted('update:model-value') ?? []

  return events.at(-1)?.[0]
}

describe('given a MazDatePicker with a time', () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn() as never
  })

  describe('when it is rendered in 24 hours', () => {
    it('then the time part is the panel of MazTimePicker with two wheels', async () => {
      const wrapper = await mountPicker()

      expect(wrapper.findComponent(MazTimePickerPanel).exists()).toBe(true)
      expect(wheels(wrapper)).toHaveLength(2)
      expect(wheels(wrapper)[0]!.props('items')).toHaveLength(24)
      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(10)
      expect(wheels(wrapper)[1]!.props('modelValue')).toBe(30)

      wrapper.unmount()
    })

    it('then the calendar is still displayed next to the time', async () => {
      const wrapper = await mountPicker()

      expect(wrapper.find('.m-date-picker-container__calendar').exists()).toBe(true)
      expect(wrapper.find('.m-date-picker-container__time').exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when the time is not enabled', () => {
    it('then no time panel is rendered', async () => {
      const wrapper = await mountPicker({ time: false, format: 'YYYY-MM-DD', modelValue: '2024-01-15' })

      expect(wrapper.findComponent(MazTimePickerPanel).exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when an hour is chosen', () => {
    it('then it emits the date with the new hour in the format and keeps the minutes', async () => {
      const wrapper = await mountPicker()

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 9)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 09:30')

      wrapper.unmount()
    })
  })

  describe('when minutes are chosen', () => {
    it('then it emits the date with the new minutes and keeps the hour', async () => {
      const wrapper = await mountPicker()

      wheels(wrapper)[1]!.vm.$emit('update:model-value', 45)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 10:45')

      wrapper.unmount()
    })
  })

  describe('when a day is chosen after the time', () => {
    it('then the chosen time is kept on the new day', async () => {
      const wrapper = await mountPicker()

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 8)
      await nextTick()

      const day = wrapper.findAll('button').find(button => button.text() === '20' && !button.attributes('disabled'))
      await day?.trigger('click')
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-20 08:30')

      wrapper.unmount()
    })
  })

  describe('when the format is 12 hours', () => {
    const props = { format: 'YYYY-MM-DD hh:mm a', modelValue: '2024-01-15 02:30 pm' }

    it('then it renders the hours, the minutes and the period', async () => {
      const wrapper = await mountPicker(props)

      expect(wheels(wrapper)).toHaveLength(3)
      expect(wheels(wrapper)[0]!.props('items')).toHaveLength(12)
      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(2)
      expect(wheels(wrapper)[2]!.props('modelValue')).toBe('pm')

      wrapper.unmount()
    })

    it('then choosing am keeps the time in the morning', async () => {
      const wrapper = await mountPicker(props)

      wheels(wrapper)[2]!.vm.$emit('update:model-value', 'am')
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 02:30 am')

      wrapper.unmount()
    })

    it('then choosing an hour keeps the period', async () => {
      const wrapper = await mountPicker(props)

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 5)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 05:30 pm')

      wrapper.unmount()
    })
  })

  describe('when the minute interval is set', () => {
    it('then the minutes follow the interval', async () => {
      const wrapper = await mountPicker({ minuteInterval: 15 })

      expect(wheels(wrapper)[1]!.props('items').map((item: { key: number }) => item.key)).toEqual([0, 15, 30, 45])

      wrapper.unmount()
    })

    it('then the default interval is 5 minutes', async () => {
      const wrapper = await mountPicker()

      expect(wheels(wrapper)[1]!.props('items')).toHaveLength(12)

      wrapper.unmount()
    })
  })

  describe('when minDate and maxDate are on the day of the value', () => {
    it('then the hours and minutes out of the bounds are disabled', async () => {
      const wrapper = await mountPicker({
        modelValue: '2024-01-15 12:00',
        minDate: '2024-01-15T10:30:00',
        maxDate: '2024-01-15T18:00:00',
      })

      const hours = wheels(wrapper)[0]!.props('items') as { key: number, disabled?: boolean }[]
      const enabled = hours.filter(item => !item.disabled).map(item => item.key)

      expect(enabled[0]).toBe(10)
      expect(enabled.at(-1)).toBe(18)

      wrapper.unmount()
    })

    it('then the minutes before the minimum are disabled in the first hour', async () => {
      const wrapper = await mountPicker({
        modelValue: '2024-01-15 10:30',
        minDate: '2024-01-15T10:30:00',
        maxDate: '2024-01-15T18:00:00',
      })

      const minutes = wheels(wrapper)[1]!.props('items') as { key: number, disabled?: boolean }[]

      expect(minutes.find(item => item.key === 25)?.disabled).toBe(true)
      expect(minutes.find(item => item.key === 30)?.disabled).toBe(false)

      wrapper.unmount()
    })

    it('then the minutes after the maximum are disabled in the last hour', async () => {
      const wrapper = await mountPicker({
        modelValue: '2024-01-15 18:00',
        minDate: '2024-01-15T10:30:00',
        maxDate: '2024-01-15T18:15:00',
      })

      const minutes = wheels(wrapper)[1]!.props('items') as { key: number, disabled?: boolean }[]

      expect(minutes.find(item => item.key === 15)?.disabled).toBe(false)
      expect(minutes.find(item => item.key === 20)?.disabled).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when minDate is on another day', () => {
    it('then no time is disabled', async () => {
      const wrapper = await mountPicker({
        modelValue: '2024-01-16 12:00',
        minDate: '2024-01-15T10:30:00',
      })

      const hours = wheels(wrapper)[0]!.props('items') as { disabled?: boolean }[]

      expect(hours.some(item => item.disabled)).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when disabledHours is set', () => {
    it('then these hours are disabled', async () => {
      const wrapper = await mountPicker({ disabledHours: [0, 1, 22, 23] })

      const hours = wheels(wrapper)[0]!.props('items') as { key: number, disabled?: boolean }[]
      const disabled = hours.filter(item => item.disabled).map(item => item.key)

      expect(disabled).toEqual([0, 1, 22, 23])

      wrapper.unmount()
    })
  })

  describe('when the picker is disabled', () => {
    it('then the wheels are disabled', async () => {
      const wrapper = await mountPicker({ disabled: true })

      expect(wheels(wrapper).every(wheel => wheel.props('disabled'))).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when only the time is used', () => {
    const props = { onlyTime: true, time: false, format: 'HH:mm', modelValue: '14:30' }

    it('then it renders the panel without the calendar', async () => {
      const wrapper = await mountPicker(props)

      expect(wrapper.find('.m-date-picker-container__calendar').exists()).toBe(false)
      expect(wheels(wrapper)).toHaveLength(2)
      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(14)
      expect(wheels(wrapper)[1]!.props('modelValue')).toBe(30)

      wrapper.unmount()
    })

    it('then it emits the time in the format', async () => {
      const wrapper = await mountPicker(props)

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 7)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('07:30')

      wrapper.unmount()
    })

    it('then it emits a time when nothing was chosen', async () => {
      const wrapper = await mountPicker({ ...props, modelValue: undefined })

      expect(wheels(wrapper)[0]!.props('modelValue')).toBeUndefined()

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 9)
      await nextTick()

      expect(lastEmitted(wrapper)).toMatch(/^09:\d{2}$/)

      wrapper.unmount()
    })
  })

  describe('when it is a range with a time', () => {
    it('then it logs the error and renders no crash', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = await mountPicker({
        range: true,
        modelValue: { start: '2024-01-15 10:30', end: '2024-01-18 11:00' },
      })

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('can\'t use time picker with range picker'))
      expect(wheels(wrapper)[0]!.props('modelValue')).toBeUndefined()

      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when the keyboard is used on a wheel', () => {
    it('then ArrowDown chooses the next hour', async () => {
      const wrapper = await mountPicker()

      await wrapper.findAll('[role="listbox"]')[0]!.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 11:30')

      wrapper.unmount()
    })

    it('then ArrowUp chooses the previous minute step', async () => {
      const wrapper = await mountPicker({ minuteInterval: 15 })

      await wrapper.findAll('[role="listbox"]')[1]!.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 10:15')

      wrapper.unmount()
    })

    it('then the wheels are focusable listboxes with labels', async () => {
      const wrapper = await mountPicker()

      const listboxes = wrapper.findAll('[role="listbox"]')

      expect(listboxes).toHaveLength(2)
      expect(listboxes.every(listbox => listbox.attributes('tabindex') === '0')).toBe(true)
      expect(listboxes.every(listbox => !!listbox.attributes('aria-label'))).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when the page is right to left', () => {
    it('then the time still works and emits the same value', async () => {
      const container = document.createElement('div')
      container.setAttribute('dir', 'rtl')
      document.body.append(container)

      const wrapper = await mountPicker({ locale: 'ar' }, container)

      expect(wheels(wrapper)).toHaveLength(2)

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 9)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('2024-01-15 09:30')

      wrapper.unmount()
      container.remove()
    })
  })

  describe('when the value is emitted with another format', () => {
    it('then the format of the date picker is used', async () => {
      const wrapper = await mountPicker({ format: 'DD/MM/YYYY HH:mm', modelValue: '15/01/2024 10:30' })

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 21)
      await nextTick()

      expect(lastEmitted(wrapper)).toBe('15/01/2024 21:30')

      wrapper.unmount()
    })
  })
})
