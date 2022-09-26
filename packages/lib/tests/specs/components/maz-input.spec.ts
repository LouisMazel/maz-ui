import { mount, VueWrapper } from '@vue/test-utils'
import MazInput from '@components/MazInput.vue'
import { ComponentPublicInstance } from 'vue'

describe('components/MazInput.vue', () => {
  expect(MazInput).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> =
    mount(MazInput, {
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
