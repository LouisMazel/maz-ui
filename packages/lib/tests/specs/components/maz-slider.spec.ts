import { shallowMount } from '@vue/test-utils'
import MazSlider from '@components/MazSlider.vue'

describe('components/MazSlider.vue', () => {
  expect(MazSlider).toBeTruthy()

  const wrapper = shallowMount(MazSlider, {
    props: {
      modelValue: [25, 50, 75],
      labels: ['Small', 'Middle', 'Big'],
    },
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toStrictEqual([25, 50, 75])
  })
})
