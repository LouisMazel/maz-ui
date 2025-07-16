import MazInputNumber from '@components/MazInputNumber.vue'
import { mount } from '@vue/test-utils'

describe('given MazInputNumber component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with default configuration', () => {
      const wrapper = mount(MazInputNumber)

      expect(wrapper.find('.m-input-number__input').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MazInput' }).exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-input-number--md')
    })
  })

  describe('when rendered with hideButtons prop', () => {
    it('then it should hide increment and decrement buttons', () => {
      const wrapper = mount(MazInputNumber, {
        props: { hideButtons: true },
      })

      expect(wrapper.findAllComponents({ name: 'MazBtn' })).toHaveLength(0)
      expect(wrapper.find('.m-input-number__input').classes()).toContain('--no-buttons')
    })
  })

  describe('when rendered with textCenter prop', () => {
    it('then it should apply text center class', () => {
      const wrapper = mount(MazInputNumber, {
        props: { textCenter: true },
      })

      expect(wrapper.find('.m-input-number__input').classes()).toContain('--text-center')
    })
  })

  describe('when rendered with block prop', () => {
    it('then it should apply block class', () => {
      const wrapper = mount(MazInputNumber, {
        props: { block: true },
      })

      expect(wrapper.classes()).toContain('--block')
    })
  })

  describe('when rendered with different sizes', () => {
    it('then it should apply the correct size classes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

      sizes.forEach((size) => {
        const wrapper = mount(MazInputNumber, {
          props: { size },
        })
        expect(wrapper.classes()).toContain(`m-input-number--${size}`)
      })
    })
  })

  describe('when rendered with min and max values', () => {
    it('then it should pass constraints to the input', () => {
      const wrapper = mount(MazInputNumber, {
        props: {
          min: 0,
          max: 100,
        },
      })

      const input = wrapper.findComponent({ name: 'MazInput' })
      expect(input.props('min')).toBe(0)
      expect(input.props('max')).toBe(100)
    })
  })

  describe('when rendered with step value', () => {
    it('then it should pass step to the input', () => {
      const wrapper = mount(MazInputNumber, {
        props: { step: 5 },
      })

      const input = wrapper.findComponent({ name: 'MazInput' })
      expect(input.props('step')).toBe(5)
    })
  })

  describe('when rendered with disabled prop', () => {
    it('then it should disable the input and buttons', () => {
      const wrapper = mount(MazInputNumber, {
        props: { disabled: true },
      })

      const input = wrapper.findComponent({ name: 'MazInput' })
      expect(input.props('disabled')).toBe(true)

      const buttons = wrapper.findAllComponents({ name: 'MazBtn' })
      buttons.forEach((button) => {
        expect(button.props('disabled')).toBe(true)
      })
    })
  })

  describe('when rendered with model value', () => {
    it('then it should display the correct value', () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 42 },
      })

      const input = wrapper.findComponent({ name: 'MazInput' })
      expect(input.props('modelValue')).toBe(42)
    })
  })

  describe('when increment button is clicked', () => {
    it('then it should emit update with incremented value', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5, step: 1 },
      })

      const incrementButton = wrapper.findAllComponents({ name: 'MazBtn' })[0]
      await incrementButton.trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([6])
    })
  })

  describe('when decrement button is clicked', () => {
    it('then it should emit update with decremented value', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5, step: 1 },
      })

      const decrementButton = wrapper.findAllComponents({ name: 'MazBtn' })[1]
      await decrementButton.trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([4])
    })
  })

  describe('when value exceeds maximum', () => {
    it('then it should disable increment button', () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 10, max: 10 },
      })

      const incrementButton = wrapper.findAllComponents({ name: 'MazBtn' })[0]
      expect(incrementButton.props('disabled')).toBe(true)
    })
  })

  describe('when value is below minimum', () => {
    it('then it should disable decrement button', () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 0, min: 0 },
      })

      const decrementButton = wrapper.findAllComponents({ name: 'MazBtn' })[1]
      expect(decrementButton.props('disabled')).toBe(true)
    })
  })

  describe('when input emits focus event', () => {
    it('then it should re-emit focus event', async () => {
      const wrapper = mount(MazInputNumber)
      const input = wrapper.findComponent({ name: 'MazInput' })

      await input.vm.$emit('focus', new Event('focus'))

      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('when input emits blur event', () => {
    it('then it should re-emit blur event', async () => {
      const wrapper = mount(MazInputNumber)
      const input = wrapper.findComponent({ name: 'MazInput' })

      await input.vm.$emit('blur', new Event('blur'))

      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('when input emits change event', () => {
    it('then it should re-emit change event', async () => {
      const wrapper = mount(MazInputNumber)
      const input = wrapper.findComponent({ name: 'MazInput' })

      await input.vm.$emit('change', new Event('change'))

      expect(wrapper.emitted('change')).toBeTruthy()
    })
  })

  describe('when input emits click event', () => {
    it('then it should re-emit click event', async () => {
      const wrapper = mount(MazInputNumber)
      const input = wrapper.findComponent({ name: 'MazInput' })

      await input.vm.$emit('click', new Event('click'))

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('when rendered with validation props', () => {
    it('then it should pass validation props to input', () => {
      const wrapper = mount(MazInputNumber, {
        props: {
          error: true,
          success: true,
          warning: true,
          hint: 'Test hint',
        },
      })

      const input = wrapper.findComponent({ name: 'MazInput' })
      expect(input.props('error')).toBe(true)
      expect(input.props('success')).toBe(true)
      expect(input.props('warning')).toBe(true)
      expect(input.props('hint')).toBe('Test hint')
    })
  })
})
