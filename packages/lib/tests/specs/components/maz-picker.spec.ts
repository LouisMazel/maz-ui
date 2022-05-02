import { mount } from '@vue/test-utils'
import MazPicker from '@components/MazPicker.vue'

test('components/MazPicker.vue', () => {
  expect(MazPicker).toBeTruthy()

  const wrapper = mount(MazPicker, {})

  expect(wrapper.html()).toMatchSnapshot()
})
