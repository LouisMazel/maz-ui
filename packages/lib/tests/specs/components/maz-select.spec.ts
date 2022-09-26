import { mount, VueWrapper } from '@vue/test-utils'
import MazSelect from '@components/MazSelect.vue'
import { ComponentPublicInstance } from 'vue'

describe('components/MazSelect.vue', () => {
  expect(MazSelect).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> =
    mount(MazSelect, {
      props: {
        modelValue: 1,
        options: [{ label: 'Test', value: 1 }],
      },
    })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(1)
  })

  test('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazSelect-1')
  })
})
