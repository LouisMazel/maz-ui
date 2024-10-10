import MazCheckbox from '@components/MazCheckbox.vue'
import { mount } from '@vue/test-utils'

describe('components/MazCheckbox.vue', () => {
  expect(MazCheckbox).toBeTruthy()

  it('renders correctly', () => {
    const wrapper = mount(MazCheckbox, {
      props: {
        modelValue: true, // You can provide props here
        // Add other props as needed
      },
    })

    // Add your assertions based on your component's rendering and behavior
    // For example, you can assert the existence of specific elements or classes:
    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('checkbox')
    // Add more assertions as needed.

    // Don't forget to clean up the wrapper
    wrapper.unmount()
  })

  it('should have an uniq id', () => {
    const wrapper = mount(MazCheckbox, {
      props: {
        modelValue: false,
      },
    })

    // @ts-expect-error instanceId is a private property
    expect(wrapper.vm.instanceId).toBe('MazCheckbox-v-0')

    wrapper.unmount()
  })
})
