import { mount } from '@vue/test-utils'
import MazInput from '@components/MazInput.vue'

describe('components/MazInput.vue', () => {
  expect(MazInput).toBeTruthy()

  const wrapper = mount(MazInput, {
    props: {
      modelValue: 'test value',
    },
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe('test value')
  })

  test('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazInput-1')
  })
})
