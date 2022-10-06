import { mount, VueWrapper } from '@vue/test-utils'
import MazInputPrice from '@components/MazInputPrice.vue'
import { ComponentPublicInstance } from 'vue'

describe('components/MazInput.vue', () => {
  expect(MazInputPrice).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> =
    mount(MazInputPrice, {
      props: {
        modelValue: 12,
      },
    })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(12)
  })

  test('Should have the formatted price displayed', () => {
    expect(wrapper.vm.displayPrice).toBe('12,00 €')
  })

  test('Should have the formatted price displayed', async () => {
    wrapper.setProps({
      modelValue: 0,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modelValue).toBe(0)
    expect(wrapper.vm.displayPrice).toBe('0,00 €')
  })
})
