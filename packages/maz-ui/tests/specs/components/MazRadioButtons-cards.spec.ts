import MazRadioButtons from '@components/MazRadioButtons.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const options = [
  { label: 'Monthly', value: 'month', description: 'Cancel any time', price: '$9' },
  { label: 'Yearly', value: 'year', description: 'Two months free', price: '$90' },
]

describe('given a MazRadioButtons with the cards variant', () => {
  describe('when it is rendered', () => {
    it('then each option is a card on a native radio', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, variant: 'cards', modelValue: 'year' } })
      const cards = wrapper.findAll('.m-radio-buttons__items')

      expect(cards).toHaveLength(2)
      expect(cards[0].classes()).toContain('m-radio-buttons__items--card')
      expect(cards[0].classes()).toContain('maz:border-draw')
      expect(cards[0].find('.m-radio-buttons__label').text()).toBe('Monthly')
      expect(cards[0].find('.m-radio-buttons__description').text()).toBe('Cancel any time')
      expect(cards[0].find('.m-radio-buttons__price').text()).toBe('$9')
      expect(cards[0].find('input').attributes('type')).toBe('radio')
      expect(cards[1].classes()).toContain('--is-selected')
    })

    it('then no sliding frame is rendered', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, variant: 'cards' } })

      expect(wrapper.find('.m-radio-buttons__indicator').exists()).toBe(false)
    })

    it('then the extra slot is rendered under the description', () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options, variant: 'cards' },
        slots: { extra: '<em class="extra">Popular</em>' },
      })

      expect(wrapper.findAll('.extra')).toHaveLength(2)
    })
  })

  describe('when a card is chosen', () => {
    it('then it emits the value', async () => {
      const wrapper = mount(MazRadioButtons, { props: { options, variant: 'cards' } })

      await wrapper.findAll('input')[1].setValue(true)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['year'])
    })
  })
})

describe('given a MazRadioButtons with the default variant', () => {
  describe('when it is animated', () => {
    it('then a frame follows the selected option', async () => {
      const wrapper = mount(MazRadioButtons, { props: { options, modelValue: 'month' }, attachTo: document.body })

      await nextTick()

      expect(wrapper.find('.m-radio-buttons__indicator').exists()).toBe(true)
      expect(wrapper.find('.m-radio-buttons__indicator').attributes('aria-hidden')).toBe('true')

      wrapper.unmount()
    })
  })

  describe('when animated is false', () => {
    it('then there is no frame', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, modelValue: 'month', animated: false } })

      expect(wrapper.find('.m-radio-buttons__indicator').exists()).toBe(false)
    })
  })

  describe('when the option is selected with a selector', () => {
    it('then the check is drawn', () => {
      const wrapper = mount(MazRadioButtons, { props: { options, modelValue: 'month', selector: true } })

      expect(wrapper.findAll('.m-radio-buttons__items__checkbox svg')).toHaveLength(2)
    })
  })
})
