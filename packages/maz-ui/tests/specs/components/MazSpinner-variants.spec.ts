import MazSpinner from '@components/MazSpinner.vue'
import { mount } from '@vue/test-utils'

describe('given MazSpinner variants', () => {
  describe('when the variant is ring or missing', () => {
    it('then the spinner keeps its path and its spin class', () => {
      const wrapper = mount(MazSpinner)

      expect(wrapper.find('path').exists()).toBe(true)
      expect(wrapper.classes()).toContain('maz:animate-spin')
      expect(wrapper.classes().some(name => name.startsWith('m-spinner--') && ['dots', 'bars', 'pulse'].includes(name.slice(10)))).toBe(false)
    })
  })

  describe('when the variant is dots', () => {
    it('then three dots are drawn without the spin class', () => {
      const wrapper = mount(MazSpinner, { props: { variant: 'dots' } })

      expect(wrapper.classes()).toContain('m-spinner--dots')
      expect(wrapper.classes()).not.toContain('maz:animate-spin')
      expect(wrapper.findAll('circle.m-spinner__shape')).toHaveLength(3)
    })
  })

  describe('when the variant is bars', () => {
    it('then four bars are drawn', () => {
      const wrapper = mount(MazSpinner, { props: { variant: 'bars' } })

      expect(wrapper.classes()).toContain('m-spinner--bars')
      expect(wrapper.findAll('rect.m-spinner__shape')).toHaveLength(4)
    })
  })

  describe('when the variant is pulse', () => {
    it('then one disc is drawn', () => {
      const wrapper = mount(MazSpinner, { props: { variant: 'pulse', color: 'success', size: '3em' } })

      expect(wrapper.classes()).toContain('m-spinner--pulse')
      expect(wrapper.classes()).toContain('m-spinner--success')
      expect(wrapper.findAll('circle.m-spinner__shape')).toHaveLength(1)
      expect(wrapper.attributes('width')).toBe('3em')
    })
  })

  describe('when done', () => {
    it('then a check circle draws itself in place of the spinner', async () => {
      const wrapper = mount(MazSpinner, { props: { done: true, color: 'success', size: '3em' } })
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()

      const icon = wrapper.findComponent({ name: 'MazDrawnIcon' })

      expect(icon.props('name')).toBe('check-circle')
      expect(icon.props('size')).toBe('3em')
      expect(icon.classes()).toContain('m-spinner--done')
      expect(icon.classes()).toContain('m-spinner--success')
    })

    it('then the spinner comes back when done is false again', async () => {
      const wrapper = mount(MazSpinner, { props: { done: true } })
      await vi.dynamicImportSettled()

      await wrapper.setProps({ done: false })

      expect(wrapper.find('svg.m-spinner path').exists()).toBe(true)
    })
  })
})
