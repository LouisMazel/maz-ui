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

  it('toggles the switch when the checkbox is clicked', async () => {
    const wrapper = mount(MazSwitch, {
      props: {
        modelValue: true,
      },
    })

    expect(wrapper.attributes('aria-checked')).toEqual('true')

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })
})
