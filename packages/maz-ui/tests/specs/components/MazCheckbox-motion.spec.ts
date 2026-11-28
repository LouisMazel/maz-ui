import MazCheckbox from '@components/MazCheckbox.vue'
import MazDrawnIcon from '@components/MazDrawnIcon.vue'
import { mount } from '@vue/test-utils'

describe('given a MazCheckbox with a drawn check', () => {
  describe('when it is unchecked', () => {
    it('then the check is not drawn', () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false } })
      const icon = wrapper.findComponent(MazDrawnIcon)

      expect(icon.props('name')).toBe('check')
      expect(icon.props('drawn')).toBe(false)
    })
  })

  describe('when it is checked', () => {
    it('then the check is drawn', () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: true } })
      const icon = wrapper.findComponent(MazDrawnIcon)

      expect(icon.props('name')).toBe('check')
      expect(icon.props('drawn')).toBe(true)
    })
  })

  describe('when it is indeterminate', () => {
    it('then a dash is drawn instead of the check', () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false, indeterminate: true } })
      const icon = wrapper.findComponent(MazDrawnIcon)

      expect(icon.props('name')).toBe('minus')
      expect(icon.props('drawn')).toBe(true)
    })
  })

  describe('when the model value changes', () => {
    it('then the check is drawn again', async () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false } })

      await wrapper.setProps({ modelValue: true })

      expect(wrapper.findComponent(MazDrawnIcon).props('drawn')).toBe(true)
    })
  })
})
