import MazInputPrice from '@components/MazInputPrice.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazInput.vue', () => {
  expect(MazInputPrice).toBeTruthy()

  const wrapper = shallowMount(MazInputPrice, {
    props: {
      modelValue: 12,
    },
  })

  it('should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(12)
  })

  it('should have the formatted price displayed', () => {
    // @ts-expect-error - test case
    expect(wrapper.vm.displayPrice).toBe('12,00 €')
  })

  it('should have the formatted price displayed with zero value', async () => {
    wrapper.setProps({
      modelValue: 0,
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.modelValue).toBe(0)
    // @ts-expect-error - test case
    expect(wrapper.vm.displayPrice).toBe('0,00 €')
  })
})
