import MazSwitch from '@components/MazSwitch.vue'
import { mount } from '@vue/test-utils'

describe('mazSwitch', () => {
  it('renders a checkbox input', () => {
    const wrapper = mount(MazSwitch, {
      props: {
        modelValue: false,
      },
    })

    const checkboxInput = wrapper.find('input[type="checkbox"]')
    expect(checkboxInput.exists()).toBe(true)
  })

  it('emits the "update:model-value" event when the checkbox is clicked', async () => {
    const wrapper = mount(MazSwitch, {
      props: {
        modelValue: false,
      },
    })

    const checkboxInput = wrapper.find('input[type="checkbox"]')
    await checkboxInput.setValue(true)

    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0]).toEqual([true])
  })

  it('applies the "disabled" class when the "disabled" prop is set to true', () => {
    const wrapper = mount(MazSwitch, {
      props: {
        modelValue: false,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('--is-disabled')
  })

  it('reflects the checked state on the native switch input', async () => {
    const wrapper = mount(MazSwitch, {
      props: {
        modelValue: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('role')).toBe('switch')
    expect(input.element.checked).toBe(true)
    expect(wrapper.find('label').attributes('role')).toBeUndefined()

    await wrapper.setProps({ modelValue: false })
    expect(input.element.checked).toBe(false)
  })
})
