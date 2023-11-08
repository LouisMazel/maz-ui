import { mount } from '@vue/test-utils'
import MazRadio from '@components/MazRadio.vue'

describe('MazRadio', () => {
  test('renders a radio input with a label', () => {
    const wrapper = mount(MazRadio, {
      props: {
        value: 'option1',
        name: 'radioGroup',
      },
      slots: {
        default: 'radio Label',
      },
    })

    const radioInput = wrapper.find('input[type="radio"]')
    const radioLabel = wrapper.find('label')

    expect(radioInput.exists()).toBe(true)
    expect(radioLabel.text()).toBe('radio Label')
  })

  test('toggles the radio when the label is clicked', async () => {
    const wrapper = mount(MazRadio, {
      props: {
        value: 'option1',
        name: 'radioGroup',
        modelValue: 'option2',
      },
      slots: {
        default: 'radio Label',
      },
    })

    const radioInput = wrapper.find('input[type="radio"]')
    const radioLabel = wrapper.find('label')

    expect(radioInput.element.checked).toBe(false)

    await radioLabel.trigger('click')
    expect(radioInput.element.checked).toBe(true)
  })

  test('applies the "--selected" class when the radio is selected', () => {
    const wrapper = mount(MazRadio, {
      props: {
        value: 'option1',
        name: 'radioGroup',
        modelValue: 'option1',
      },
      slots: {
        default: 'radio Label',
      },
    })

    const radioLabel = wrapper.find('label')

    expect(radioLabel.classes()).toContain('--selected')
  })

  test('applies the "--disabled" class when the radio is disabled', () => {
    const wrapper = mount(MazRadio, {
      props: {
        value: 'option1',
        name: 'radioGroup',
        modelValue: 'option1',
        disabled: true,
      },
      slots: {
        default: 'radio Label',
      },
    })

    const radioLabel = wrapper.find('label')

    expect(radioLabel.classes()).toContain('--disabled')
  })
})
