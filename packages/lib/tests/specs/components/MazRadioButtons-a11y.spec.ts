import MazRadioButtons from '@components/MazRadioButtons.vue'
import { mount } from '@vue/test-utils'

const options = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
]

describe('given a MazRadioButtons', () => {
  describe('when it is rendered', () => {
    it('then its root is a radiogroup of native radios', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, modelValue: 1 } })

      expect(wrapper.attributes('role')).toBe('radiogroup')
      expect(wrapper.findAll('[role="radiogroup"] input[type="radio"]')).toHaveLength(2)
      expect(wrapper.attributes('aria-describedby')).toBeUndefined()
      expect(wrapper.attributes('aria-invalid')).toBeUndefined()
    })
  })

  describe('when an aria-label is passed', () => {
    it('then it labels the radiogroup', () => {
      const wrapper = mount(MazRadioButtons, { props: { options }, attrs: { 'aria-label': 'Quantity' } })

      expect(wrapper.attributes('aria-label')).toBe('Quantity')
    })
  })

  describe('when it has a hint and an error', () => {
    it('then the radiogroup is invalid and described by the hint', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, hint: 'Pick one', error: true } })
      const hint = wrapper.find('.m-radio-buttons__hint')

      expect(wrapper.attributes('aria-describedby')).toBe(hint.attributes('id'))
      expect(wrapper.attributes('aria-invalid')).toBe('true')
    })
  })

  describe('when two instances have no name', () => {
    it('then their radios are in distinct groups with distinct ids', () => {
      const wrapper = mount({
        components: { MazRadioButtons },
        setup: () => ({ options }),
        template: '<div><MazRadioButtons class="first" :options="options" /><MazRadioButtons class="second" :options="options" /></div>',
      })

      const firstRadio = wrapper.find('.first input[type="radio"]')
      const secondRadio = wrapper.find('.second input[type="radio"]')

      expect(firstRadio.attributes('name')).toBeTruthy()
      expect(firstRadio.attributes('name')).not.toBe(secondRadio.attributes('name'))
      expect(firstRadio.attributes('id')).not.toBe(secondRadio.attributes('id'))
    })
  })

  describe('when a name is passed', () => {
    it('then the radios use it', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, name: 'quantity' } })

      expect(wrapper.findAll('input[type="radio"]').map(radio => radio.attributes('name'))).toEqual(['quantity', 'quantity'])
      expect(wrapper.find('input[type="radio"]').attributes('id')).toBe('option-0-1-quantity')
    })
  })
})
