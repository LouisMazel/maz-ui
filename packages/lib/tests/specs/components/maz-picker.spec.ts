import { mount } from '@vue/test-utils'
import MazPicker from '@components/MazPicker.vue'
import MazInput from '@components/MazInput.vue'

describe('components/MazPicker.vue', () => {
  test('Should exists', () => {
    expect(MazPicker).toBeTruthy()
  })

  const wrapper = mount(MazPicker, {})

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have 12 hour format on time mode', async () => {
    await wrapper.setProps({
      format: 'hh:mm a',
      onlyTime: true,
      modelValue: '02:20 pm',
    })

    expect(
      (wrapper.vm.formatterOptions as Record<string, any>).hour12,
    ).toBeTruthy()

    expect(wrapper.vm.modelValue).toBe('02:20 pm')

    const input = wrapper.findComponent(MazInput)
    expect(input).toBeDefined()
    expect(input.vm.modelValue).toBe('2:20 PM')
  })
})
