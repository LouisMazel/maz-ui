import MazChecklist from '@components/MazChecklist.vue'
import { flushPromises, mount } from '@vue/test-utils'

const items = [
  { label: 'Standard', value: 'standard', description: 'Delivered in 5 days', price: 'Free' },
  { label: 'Express', value: 'express', description: 'Delivered in 24 hours', price: '$9' },
  { label: 'Pickup', value: 'pickup' },
]

describe('given a MazChecklist with the cards variant', () => {
  describe('when it is rendered', () => {
    it('then each item is a card with its title, its description and its price', () => {
      const wrapper = mount(MazChecklist, { props: { items, variant: 'cards', modelValue: ['express'] } })
      const cards = wrapper.findAll('label.m-checklist-item')

      expect(cards).toHaveLength(3)
      expect(cards[0].classes()).toContain('m-checklist-item--card')
      expect(cards[0].classes()).toContain('maz:border-draw')
      expect(cards[0].find('.item-label').text()).toBe('Standard')
      expect(cards[0].find('.item-description').text()).toBe('Delivered in 5 days')
      expect(cards[0].find('.item-price').text()).toBe('Free')
      expect(cards[2].find('.item-description').exists()).toBe(false)
      expect(cards[2].find('.item-price').exists()).toBe(false)
    })

    it('then the cards keep real checkboxes', () => {
      const wrapper = mount(MazChecklist, { props: { items, variant: 'cards', modelValue: ['express'] } })
      const inputs = wrapper.findAll('input[type="checkbox"]')

      expect(inputs).toHaveLength(3)
      expect((inputs[1].element as HTMLInputElement).checked).toBe(true)
    })

    it('then the border is drawn with the color of the checklist', () => {
      const wrapper = mount(MazChecklist, { props: { items, variant: 'cards', color: 'success' } })

      expect(wrapper.find('label.m-checklist-item').attributes('style')).toContain('--maz-border-draw-color: var(--maz-success)')
    })
  })

  describe('when a card is toggled', () => {
    it('then it emits the new selection', async () => {
      const wrapper = mount(MazChecklist, { props: { items, variant: 'cards', modelValue: [] } })

      await wrapper.findAll('input[type="checkbox"]')[0].setValue(true)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([['standard']])
    })
  })

  describe('when the variant is default', () => {
    it('then the items are not cards', () => {
      const wrapper = mount(MazChecklist, { props: { items } })

      expect(wrapper.find('.m-checklist-item--card').exists()).toBe(false)
      expect(wrapper.find('.item-description').exists()).toBe(false)
    })
  })

  describe('when the list is filtered by the search', () => {
    it('then the removed items leave at once', async () => {
      const wrapper = mount(MazChecklist, { props: { items, search: true, query: 'express' } })

      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.findAll('label.m-checklist-item')).toHaveLength(1)
    })
  })
})
