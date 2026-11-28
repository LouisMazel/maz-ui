import MazAccordion from '@components/MazAccordion.vue'
import MazCardSpotlight from '@components/MazCardSpotlight.vue'
import MazMorphIcon from '@components/MazMorphIcon.vue'
import { mount } from '@vue/test-utils'

const slots = {
  'title-1': 'First',
  'content-1': 'First content',
  'title-2': 'Second',
  'content-2': 'Second content',
}

describe('given MazAccordion motion', () => {
  describe('when an item is opened', () => {
    it('then the icon is a plus that morphs into a minus', () => {
      const wrapper = mount(MazAccordion, { props: { modelValue: 1 }, slots })
      const icons = wrapper.findAllComponents(MazMorphIcon)

      expect(icons).toHaveLength(2)
      expect(icons[0]!.props('name')).toBe('plus-minus')
      expect(icons[0]!.props('active')).toBe(true)
      expect(icons[1]!.props('active')).toBe(false)
    })

    it('then only the open content rises', () => {
      const wrapper = mount(MazAccordion, { props: { modelValue: 2 }, slots })
      const contents = wrapper.findAll('.m-accordion__content')

      expect(contents[0]!.classes()).not.toContain('--open')
      expect(contents[1]!.classes()).toContain('--open')
    })
  })

  describe('when the header is rendered', () => {
    it('then it has the focus ring of the theme', () => {
      const wrapper = mount(MazAccordion, { slots })

      expect(wrapper.find('.m-accordion__header').classes()).toContain('maz:focus-ring')
    })
  })

  describe('when spotlight is false', () => {
    it('then the items are plain bordered cards', () => {
      const wrapper = mount(MazAccordion, { props: { spotlight: false }, slots })
      const items = wrapper.findAll('.m-accordion__spotlight')

      expect(wrapper.findAllComponents(MazCardSpotlight)).toHaveLength(0)
      expect(items).toHaveLength(2)
      expect(items[0]!.classes()).toEqual(expect.arrayContaining(['maz:border', 'maz:rounded-md', 'maz:bg-container']))
    })

    it('then the items still toggle', async () => {
      const wrapper = mount(MazAccordion, { props: { spotlight: false }, slots })

      await wrapper.find('.m-accordion__header').trigger('click')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([1])
    })
  })
})
