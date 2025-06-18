import MazDatePicker from '@components/MazDatePicker.vue'
import MazInput from '@components/MazInput.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('given MazDatePicker component', () => {
  let wrapper: ReturnType<typeof mount<typeof MazDatePicker>>

  beforeEach(async () => {
    wrapper = mount(MazDatePicker)
    await vi.dynamicImportSettled()
  })

  describe('when initializing the component', () => {
    it('then it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('then it should have default props set', () => {
      expect(wrapper.props('format')).toBe('YYYY-MM-DD')
      expect(wrapper.props('open')).toBe(false)
      expect(wrapper.props('disabled')).toBe(false)
    })
  })

  describe('when setting a model value', () => {
    it('then it should display the formatted date in the input', async () => {
      const date = '2023-07-17'
      await wrapper.setProps({ modelValue: date })
      const input = wrapper.findComponent(MazInput)
      expect(input.exists()).toBe(true)
      expect(input.find('input').element.value).toBe('Jul 17, 2023, 12:00 AM')
    })
  })
})
