import { mount, VueWrapper } from '@vue/test-utils'
import MazCheckbox from '@components/MazCheckbox.vue'
import { ComponentPublicInstance } from 'vue'

test('components/MazCheckbox.vue', () => {
  expect(MazCheckbox).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> =
    mount(MazCheckbox, {
      props: {
        modelValue: false,
      },
    })

  describe('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazCheckbox-1')
  })
})
