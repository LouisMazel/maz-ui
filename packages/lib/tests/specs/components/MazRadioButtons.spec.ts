import MazRadioButtons from '@components/MazRadioButtons.vue'
import { mount } from '@vue/test-utils'

describe('given MazRadioButtons component', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]

  describe('when rendered with default props', () => {
    it('then it should render all options', () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
      })

      expect(wrapper.findAll('.m-radio-buttons__items')).toHaveLength(3)
      expect(wrapper.text()).toContain('Option 1')
      expect(wrapper.text()).toContain('Option 2')
      expect(wrapper.text()).toContain('Option 3')
    })
  })

  describe('when rendered with modelValue', () => {
    it('then it should mark the selected option', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          modelValue: 'option2',
        },
      })

      const selectedOption = wrapper.find('.m-radio-buttons__items.--is-selected')
      expect(selectedOption.exists()).toBe(true)
      expect(selectedOption.text()).toContain('Option 2')
    })
  })

  describe('when rendered with different orientations', () => {
    it('then it should apply row orientation class', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          orientation: 'row',
        },
      })

      expect(wrapper.find('.m-radio-buttons__wrapper').classes()).toContain('--row')
    })

    it('then it should apply col orientation class', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          orientation: 'col',
        },
      })

      expect(wrapper.find('.m-radio-buttons__wrapper').classes()).toContain('--col')
    })
  })

  describe('when rendered with wrap disabled', () => {
    it('then it should not apply wrap class', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          wrap: false,
        },
      })

      expect(wrapper.find('.m-radio-buttons__wrapper').classes()).not.toContain('--wrap')
    })
  })

  describe('when rendered with block prop', () => {
    it('then it should apply block class', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          block: true,
        },
      })

      expect(wrapper.find('.m-radio-buttons__wrapper').classes()).toContain('--block')
    })
  })

  describe('when rendered with elevation prop', () => {
    it('then it should apply elevation class to all options', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          elevation: true,
        },
      })

      const optionElements = wrapper.findAll('.m-radio-buttons__items')
      optionElements.forEach((option) => {
        expect(option.classes()).toContain('--elevation')
      })
    })
  })

  describe('when rendered with equalSize prop', () => {
    it('then it should apply equal size class to all options', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          equalSize: true,
        },
      })

      const optionElements = wrapper.findAll('.m-radio-buttons__items')
      optionElements.forEach((option) => {
        expect(option.classes()).toContain('--equal-size')
      })
    })
  })

  describe('when rendered with selector prop', () => {
    it('then it should display checkboxes', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          selector: true,
        },
      })

      expect(wrapper.findAll('.m-radio-buttons__items__checkbox')).toHaveLength(3)
    })

    it('then it should show check icon for selected option', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          selector: true,
          modelValue: 'option1',
        },
      })

      const checkboxes = wrapper.findAll('.m-radio-buttons__items__checkbox span')
      expect(checkboxes[0].classes()).toContain('--is-selected')
    })
  })

  describe('when rendered with different colors', () => {
    it('then it should apply color styling to selected option', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          color: 'success',
          modelValue: 'option1',
        },
      })

      const selectedOption = wrapper.find('.m-radio-buttons__items.--is-selected')
      expect(selectedOption.attributes('style')).toContain('--maz-success')
    })
  })

  describe('when option is clicked', () => {
    it('then it should emit update:model-value', async () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
      })

      const firstOption = wrapper.find('.m-radio-buttons__items input')
      await firstOption.trigger('change')

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['option1'])
    })
  })

  describe('when option is focused', () => {
    it('then it should emit focus event', async () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
      })

      const firstOption = wrapper.find('.m-radio-buttons__items')
      await firstOption.trigger('focus')

      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('when option loses focus', () => {
    it('then it should emit blur event', async () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
      })

      const firstOption = wrapper.find('.m-radio-buttons__items')
      await firstOption.trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('when space key is pressed', () => {
    it('then it should select the option', async () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
      })

      const firstOption = wrapper.find('.m-radio-buttons__items')
      await firstOption.trigger('keydown', { code: 'Space' })

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['option1'])
    })
  })

  describe('when rendered with hint', () => {
    it('then it should display the hint text', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          hint: 'This is a hint',
        },
      })

      expect(wrapper.find('.m-radio-buttons__hint').text()).toBe('This is a hint')
    })
  })

  describe('when rendered with error state', () => {
    it('then it should apply error styling to hint', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          hint: 'Error message',
          error: true,
        },
      })

      expect(wrapper.find('.m-radio-buttons__hint').classes()).toContain('--error')
    })
  })

  describe('when rendered with success state', () => {
    it('then it should apply success styling to hint', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          hint: 'Success message',
          success: true,
        },
      })

      expect(wrapper.find('.m-radio-buttons__hint').classes()).toContain('--success')
    })
  })

  describe('when rendered with warning state', () => {
    it('then it should apply warning styling to hint', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          hint: 'Warning message',
          warning: true,
        },
      })

      expect(wrapper.find('.m-radio-buttons__hint').classes()).toContain('--warning')
    })
  })

  describe('when rendered with custom name', () => {
    it('then it should use custom name for radio group', () => {
      const wrapper = mount(MazRadioButtons, {
        props: {
          options,
          name: 'custom-radio-group',
        },
      })

      const radioInputs = wrapper.findAll('input[type="radio"]')
      radioInputs.forEach((input) => {
        expect(input.attributes('name')).toBe('custom-radio-group')
      })
    })
  })

  describe('when rendered with custom slot', () => {
    it('then it should render custom slot content', () => {
      const wrapper = mount(MazRadioButtons, {
        props: { options },
        slots: {
          default: '<span>Custom label</span>',
        },
      })

      expect(wrapper.html()).toContain('<span>Custom label</span>')
    })
  })

  describe('when options have custom classes', () => {
    it('then it should apply custom classes to options', () => {
      const customOptions = [
        { label: 'Option 1', value: 'option1', classes: 'custom-class' },
      ]

      const wrapper = mount(MazRadioButtons, {
        props: { options: customOptions },
      })

      expect(wrapper.find('.m-radio-buttons__items').classes()).toContain('custom-class')
    })
  })

  describe('when options have custom styles', () => {
    it('then it should apply custom styles to options', () => {
      const customOptions = [
        { label: 'Option 1', value: 'option1', style: { color: 'red' } },
      ]

      const wrapper = mount(MazRadioButtons, {
        props: { options: customOptions },
      })

      expect(wrapper.find('.m-radio-buttons__items').attributes('style')).toContain('color: red')
    })
  })
})
