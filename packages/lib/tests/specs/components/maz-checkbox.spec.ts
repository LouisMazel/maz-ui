import { mount } from '@vue/test-utils'
import MazCheckbox from '@components/MazCheckbox.vue'

describe('components/MazCheckbox.vue', () => {
  expect(MazCheckbox).toBeTruthy()

  const wrapper = mount(MazCheckbox, {
    props: {
      modelValue: false,
    },
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazCheckbox-1')
  })
})
