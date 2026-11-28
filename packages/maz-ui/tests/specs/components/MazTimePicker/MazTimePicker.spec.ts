import MazTimePicker from '@components/MazTimePicker.vue'
import MazTimePickerPanel from '@components/MazTimePicker/MazTimePickerPanel.vue'
import { flushPromises, mount } from '@vue/test-utils'

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(MazTimePicker, {
    props: { locale: 'en-US', ...props },
    global: { stubs: { MazPopover: { template: '<div class="popover"><slot name="trigger" /><slot :close="() => {}" /></div>' } } },
  })
}

describe('given a MazTimePicker', () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn() as never
  })

  describe('when it is in a field', () => {
    it('then it shows the formatted time in a readonly input', () => {
      const wrapper = mountPicker({ modelValue: '14:30', format: '12h' })
      const input = wrapper.find('input')

      expect(input.attributes('readonly')).toBeDefined()
      expect(input.element.value).toMatch(/2:30\s?PM/)
    })

    it('then it follows the locale for the 24 hours format', () => {
      const wrapper = mountPicker({ modelValue: '14:30', locale: 'fr-FR' })

      expect(wrapper.find('input').element.value).toBe('14:30')
      expect(wrapper.findComponent(MazTimePickerPanel).props('hour12')).toBe(false)
    })

    it('then the field is empty without a value', () => {
      const wrapper = mountPicker({ modelValue: null })

      expect(wrapper.find('input').element.value).toBe('')
    })

    it('then an invalid value is ignored', () => {
      const wrapper = mountPicker({ modelValue: 'oops' })

      expect(wrapper.find('input').element.value).toBe('')
    })
  })

  describe('when the panel updates', () => {
    it('then it emits the value', () => {
      const wrapper = mountPicker({ modelValue: '14:30' })

      wrapper.findComponent(MazTimePickerPanel).vm.$emit('update:model-value', '15:00')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['15:00'])
    })

    it('then it emits select', () => {
      const wrapper = mountPicker({ modelValue: '14:30', variant: 'slots' })

      wrapper.findComponent(MazTimePickerPanel).vm.$emit('select', '15:00')

      expect(wrapper.emitted('select')?.[0]).toEqual(['15:00'])
    })

    it('then the wheel variant stays open after select', () => {
      const wrapper = mountPicker({ modelValue: '14:30', variant: 'wheel' })

      wrapper.findComponent(MazTimePickerPanel).vm.$emit('select', '14:30')

      expect(wrapper.emitted('select')).toHaveLength(1)
    })
  })

  describe('when the variant changes the default step', () => {
    it('then the wheel steps by 1 minute and the slots by 30', () => {
      expect(mountPicker().findComponent(MazTimePickerPanel).props('step')).toBe(1)
      expect(mountPicker({ variant: 'slots' }).findComponent(MazTimePickerPanel).props('step')).toBe(30)
      expect(mountPicker({ step: 10 }).findComponent(MazTimePickerPanel).props('step')).toBe(10)
    })
  })

  describe('when it is inline', () => {
    it('then it renders the panel without a field', async () => {
      const wrapper = mount(MazTimePicker, { props: { inline: true, modelValue: '10:00', variant: 'slots', min: '09:00', max: '11:00', step: 60 } })
      await flushPromises()

      expect(wrapper.find('input[type="text"]').exists()).toBe(false)
      expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3)
    })

    it('then it forwards the events', () => {
      const wrapper = mount(MazTimePicker, { props: { inline: true } })

      wrapper.findComponent(MazTimePickerPanel).vm.$emit('update:model-value', '10:00')
      wrapper.findComponent(MazTimePickerPanel).vm.$emit('select', '10:00')

      expect(wrapper.emitted('update:model-value')).toEqual([['10:00']])
      expect(wrapper.emitted('select')).toEqual([['10:00']])
    })
  })
})
