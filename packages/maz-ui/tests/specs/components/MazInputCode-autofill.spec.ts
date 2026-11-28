import MazInputCode from '@components/MazInputCode.vue'
import { mount } from '@vue/test-utils'

describe('given an input code of 4 characters', () => {
  describe('when the first input receives the whole code from the SMS autofill', () => {
    it('then each character goes to its own input', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4 } })
      const first = wrapper.findAll('input')[0]

      first.element.value = '1234'
      await first.trigger('input')

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['1234'])
      expect(wrapper.emitted('completed')).toHaveLength(1)
      expect(first.element.value).toBe('1')
    })
  })

  describe('when a key is typed in a filled input', () => {
    it('then it replaces the character of this input only', async () => {
      const wrapper = mount(MazInputCode, { props: { codeLength: 4, modelValue: '12' } })
      const first = wrapper.findAll('input')[0]

      first.element.value = '19'
      first.element.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: '9' }))
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual(['92'])
      expect(first.element.value).toBe('9')
    })
  })

  describe('when a hint and an error are set', () => {
    it('then the inputs are invalid and described by the hint', () => {
      const wrapper = mount(MazInputCode, { props: { hint: 'Check your SMS', error: true, id: 'otp' } })
      const input = wrapper.find('input')

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('otp-hint')
      expect(wrapper.find('#otp-hint').text()).toBe('Check your SMS')
    })
  })
})
