import { mount } from '@vue/test-utils'
import MazPicker from '@components/MazPicker.vue'
import MazInput from '@components/MazInput.vue'

describe('components/MazPicker.vue', () => {
  it('should exists', () => {
    expect(MazPicker).toBeTruthy()
  })

  const wrapper = mount(MazPicker, {
    props: {
      modelValue: '2022-03-02',
    },
  })

  it('should have 12 hour format on time mode', async () => {
    await wrapper.setProps({
      format: 'hh:mm a',
      onlyTime: true,
      modelValue: '02:20 pm',
    })

    expect((wrapper.vm.formatterOptions as Record<string, any>).hour12).toBeTruthy()

    expect(wrapper.vm.modelValue).toBe('02:20 pm')

    const input = wrapper.findComponent(MazInput)
    expect(input).toBeDefined()
    expect(input.find('input').element.value.replaceAll(/\s+/g, ' ')).toBe('2:20 PM')
  })
})
