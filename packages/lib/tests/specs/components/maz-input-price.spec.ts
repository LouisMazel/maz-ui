import { shallowMount } from '@vue/test-utils'
import MazInputPrice from '@components/MazInputPrice.vue'

describe('components/MazInput.vue', () => {
  expect(MazInputPrice).toBeTruthy()

  const wrapper = shallowMount(MazInputPrice, {
    props: {
      modelValue: 12,
    },
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(12)
  })

  test('Should have the formatted price displayed', () => {
    // @ts-expect-error
    expect(wrapper.vm.displayPrice).toBe('12,00 €')
  })

  test('Should have the formatted price displayed', async () => {
    wrapper.setProps({
      modelValue: 0,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modelValue).toBe(0)
    // @ts-expect-error
    expect(wrapper.vm.displayPrice).toBe('0,00 €')
  })
})
