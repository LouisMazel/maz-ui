import MazTimePickerPanel from '@components/MazTimePicker/MazTimePickerPanel.vue'
import MazTimePickerWheel from '@components/MazTimePicker/MazTimePickerWheel.vue'
import { mount } from '@vue/test-utils'

function mountPanel(props: Record<string, unknown> = {}) {
  return mount(MazTimePickerPanel, { props: { variant: 'wheel', hour12: false, step: 1, locale: 'en-US', ...props } })
}

function wheels(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAllComponents(MazTimePickerWheel)
}

describe('given a MazTimePickerPanel', () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn() as never
  })

  describe('when disabledHours is set', () => {
    it('then these hours are disabled in the hour wheel', () => {
      const wrapper = mountPanel({ modelValue: '14:30', disabledHours: [0, 1, 23] })

      const disabled = wheels(wrapper)[0]!.props('items')
        .filter((item: { disabled?: boolean }) => item.disabled)
        .map((item: { key: number }) => item.key)

      expect(disabled).toEqual([0, 1, 23])
    })
  })

  describe('when the variant is wheel in 24 hours', () => {
    it('then it renders the hours and the minutes', () => {
      const wrapper = mountPanel({ modelValue: '14:30' })

      expect(wheels(wrapper)).toHaveLength(2)
      expect(wheels(wrapper)[0]!.props('items')).toHaveLength(24)
      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(14)
      expect(wheels(wrapper)[1]!.props('modelValue')).toBe(30)
    })

    it('then the minutes follow the step', () => {
      const wrapper = mountPanel({ modelValue: '14:32', step: 15 })

      expect(wheels(wrapper)[1]!.props('items').map((item: { key: number }) => item.key)).toEqual([0, 15, 30, 45])
      expect(wheels(wrapper)[1]!.props('modelValue')).toBe(30)
    })

    it('then nothing is selected without a value', () => {
      const wrapper = mountPanel()

      expect(wheels(wrapper)[0]!.props('modelValue')).toBeUndefined()
    })

    it('then choosing an hour keeps the minutes', () => {
      const wrapper = mountPanel({ modelValue: '14:30' })

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 9)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['09:30'])
    })

    it('then choosing an hour without a value starts at 00 minutes', () => {
      const wrapper = mountPanel()

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 9)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['09:00'])
    })

    it('then choosing minutes without a value starts at midnight', () => {
      const wrapper = mountPanel()

      wheels(wrapper)[1]!.vm.$emit('update:model-value', 20)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['00:20'])
    })

    it('then choosing minutes keeps the hour', () => {
      const wrapper = mountPanel({ modelValue: '14:30' })

      wheels(wrapper)[1]!.vm.$emit('update:model-value', 45)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['14:45'])
    })

    it('then commit emits select with the time', () => {
      const wrapper = mountPanel({ modelValue: '14:30' })

      wheels(wrapper)[0]!.vm.$emit('commit')

      expect(wrapper.emitted('select')?.[0]).toEqual(['14:30'])
    })

    it('then commit without a value emits nothing', () => {
      const wrapper = mountPanel()

      wheels(wrapper)[0]!.vm.$emit('commit')

      expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('then the hours without an allowed time are disabled', () => {
      const wrapper = mountPanel({ modelValue: '10:00', min: '09:00', max: '11:59' })
      const items = wheels(wrapper)[0]!.props('items') as { key: number, disabled: boolean }[]

      expect(items.find(item => item.key === 8)!.disabled).toBe(true)
      expect(items.find(item => item.key === 10)!.disabled).toBe(false)
      expect(items.find(item => item.key === 12)!.disabled).toBe(true)
    })

    it('then the disabled times disable minutes', () => {
      const wrapper = mountPanel({ modelValue: '10:00', disabledTimes: ['10:15'] })
      const items = wheels(wrapper)[1]!.props('items') as { key: number, disabled: boolean }[]

      expect(items.find(item => item.key === 15)!.disabled).toBe(true)
    })

    it('then an hour whose minute is not allowed picks the first allowed minute', () => {
      const wrapper = mountPanel({ modelValue: '09:15', min: '10:30', step: 15 })

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 10)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['10:30'])
    })
  })

  describe('when the variant is wheel in 12 hours', () => {
    it('then it renders the period and the hours from 12', () => {
      const wrapper = mountPanel({ modelValue: '15:10', hour12: true })

      expect(wheels(wrapper)).toHaveLength(3)
      expect((wheels(wrapper)[0]!.props('items') as { key: number }[]).map(item => item.key)).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(3)
      expect(wheels(wrapper)[2]!.props('modelValue')).toBe('pm')
    })

    it('then midnight is 12 AM', () => {
      const wrapper = mountPanel({ modelValue: '00:10', hour12: true })

      expect(wheels(wrapper)[0]!.props('modelValue')).toBe(12)
      expect(wheels(wrapper)[2]!.props('modelValue')).toBe('am')
    })

    it('then choosing an hour keeps the period', () => {
      const wrapper = mountPanel({ modelValue: '15:10', hour12: true })

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 5)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['17:10'])
    })

    it('then choosing 12 AM gives 00', () => {
      const wrapper = mountPanel({ modelValue: '09:10', hour12: true })

      wheels(wrapper)[0]!.vm.$emit('update:model-value', 12)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['00:10'])
    })

    it('then choosing the period shifts by 12 hours', () => {
      const wrapper = mountPanel({ modelValue: '09:10', hour12: true })

      wheels(wrapper)[2]!.vm.$emit('update:model-value', 'pm')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['21:10'])
    })

    it('then choosing the period without a value starts at 12', () => {
      const wrapper = mountPanel({ hour12: true })

      wheels(wrapper)[2]!.vm.$emit('update:model-value', 'pm')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['12:00'])
    })

    it('then choosing minutes without a value uses 12 AM', () => {
      const wrapper = mountPanel({ hour12: true })

      wheels(wrapper)[1]!.vm.$emit('update:model-value', 10)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['00:10'])
    })
  })

  describe('when the variant is slots', () => {
    it('then it renders the times between min and max as radios', () => {
      const wrapper = mountPanel({ variant: 'slots', min: '09:00', max: '10:30', step: 30 })

      expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
      expect(wrapper.findAll('input[type="radio"]')).toHaveLength(4)
    })

    it('then the current slot is checked and selected', () => {
      const wrapper = mountPanel({ variant: 'slots', min: '09:00', max: '10:30', step: 30, modelValue: '09:30' })

      expect((wrapper.findAll('input')[1]!.element as HTMLInputElement).checked).toBe(true)
      expect(wrapper.findAll('.m-time-picker-panel__slot.--selected')).toHaveLength(1)
    })

    it('then it uses the slots prop and ignores invalid entries', () => {
      const wrapper = mountPanel({ variant: 'slots', slots: ['09:00', '9:45', 'x'] })

      expect(wrapper.findAll('input')).toHaveLength(2)
    })

    it('then it disables the disabled times and the times out of range', () => {
      const wrapper = mountPanel({ variant: 'slots', slots: ['08:00', '09:00', '10:00'], min: '08:30', disabledTimes: ['10:00'] })

      expect(wrapper.findAll('input').map(input => input.attributes('disabled') !== undefined)).toEqual([true, false, true])
    })

    it('then choosing a slot emits the value and select', async () => {
      const wrapper = mountPanel({ variant: 'slots', min: '09:00', max: '10:00', step: 30 })

      await wrapper.findAll('input')[2]!.trigger('change')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['10:00'])
      expect(wrapper.emitted('select')?.[0]).toEqual(['10:00'])
    })

    it('then it disables everything when disabled', () => {
      const wrapper = mountPanel({ variant: 'slots', slots: ['09:00'], disabled: true })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })

    it('then the radios share the given name', () => {
      const wrapper = mountPanel({ variant: 'slots', slots: ['09:00', '10:00'], name: 'meeting' })

      expect(wrapper.findAll('input').every(input => input.attributes('name') === 'meeting')).toBe(true)
    })
  })
})
