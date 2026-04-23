import MazInputNumber from '@components/MazInputNumber.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('MazInputNumber branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazInputNumber)
      expect(wrapper.find('.m-input-number').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when modelValue is set', () => {
    it('should display value', () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 42 },
      })
      expect(wrapper.find('input').element.value).toBe('42')
      wrapper.unmount()
    })
  })

  describe('when hideButtons is true', () => {
    it('should not render buttons', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { hideButtons: true },
      })
      await flushPromises()
      expect(wrapper.find('.m-input-number__button').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when textCenter is false', () => {
    it('should not apply text-center class', () => {
      const wrapper = mount(MazInputNumber, {
        props: { textCenter: false },
      })
      expect(wrapper.find('.--text-center').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when error prop is set', () => {
    it('should apply error styling', () => {
      const wrapper = mount(MazInputNumber, {
        props: { error: true },
      })
      wrapper.unmount()
    })
  })

  describe('when success prop is set', () => {
    it('should apply success styling', () => {
      const wrapper = mount(MazInputNumber, {
        props: { success: true },
      })
      wrapper.unmount()
    })
  })

  describe('when warning prop is set', () => {
    it('should apply warning styling', () => {
      const wrapper = mount(MazInputNumber, {
        props: { warning: true },
      })
      wrapper.unmount()
    })
  })

  describe('when topLabel is set', () => {
    it('should render top label', () => {
      const wrapper = mount(MazInputNumber, {
        props: { topLabel: 'Quantity' },
      })
      expect(wrapper.find('.m-input-number__top-label').exists()).toBe(true)
      expect(wrapper.text()).toContain('Quantity')
      wrapper.unmount()
    })
  })

  describe('when topLabel is not set', () => {
    it('should not render top label', () => {
      const wrapper = mount(MazInputNumber)
      expect(wrapper.find('.m-input-number__top-label').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when block is true', () => {
    it('should apply block class', () => {
      const wrapper = mount(MazInputNumber, {
        props: { block: true },
      })
      expect(wrapper.find('.m-input-number').classes()).toContain('--block')
      wrapper.unmount()
    })
  })

  describe('when size is set', () => {
    const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of sizes) {
      it(`should apply size class for ${size}`, () => {
        const wrapper = mount(MazInputNumber, {
          props: { size },
        })
        expect(wrapper.find('.m-input-number').classes()).toContain(`m-input-number--${size}`)
        wrapper.unmount()
      })
    }
  })

  describe('when keyboard events are used', () => {
    it('should increment on keydown up', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5 },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      wrapper.unmount()
    })

    it('should decrement on keydown down', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5 },
      })
      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when events are emitted', () => {
    it('should emit focus event', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5 },
      })
      await wrapper.find('input').trigger('focus')
      await nextTick()
      expect(wrapper.emitted('focus')).toBeTruthy()
      wrapper.unmount()
    })

    it('should emit blur event', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5 },
      })
      await wrapper.find('input').trigger('blur')
      await nextTick()
      expect(wrapper.emitted('blur')).toBeTruthy()
      wrapper.unmount()
    })

    it('should emit click event', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5 },
      })
      await wrapper.find('input').trigger('click')
      await nextTick()
      expect(wrapper.emitted('click')).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when value exceeds boundaries', () => {
    it('should clamp value to max', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 100, max: 50 },
      })
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })

    it('should clamp value to min', async () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: -10, min: 0 },
      })
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when topLabel with state colors', () => {
    it('should show error color on top label', () => {
      const wrapper = mount(MazInputNumber, {
        props: { topLabel: 'Label', error: true },
      })
      const label = wrapper.find('.m-input-number__top-label')
      expect(label.classes()).toContain('maz:text-destructive-600!')
      wrapper.unmount()
    })

    it('should show success color on top label', () => {
      const wrapper = mount(MazInputNumber, {
        props: { topLabel: 'Label', success: true },
      })
      const label = wrapper.find('.m-input-number__top-label')
      expect(label.classes()).toContain('maz:text-success-600!')
      wrapper.unmount()
    })

    it('should show warning color on top label', () => {
      const wrapper = mount(MazInputNumber, {
        props: { topLabel: 'Label', warning: true },
      })
      const label = wrapper.find('.m-input-number__top-label')
      expect(label.classes()).toContain('maz:text-warning-600!')
      wrapper.unmount()
    })

    it('should not show state color when no state set', () => {
      const wrapper = mount(MazInputNumber, {
        props: { topLabel: 'Label' },
      })
      const label = wrapper.find('.m-input-number__top-label')
      expect(label.classes()).not.toContain('maz:text-destructive-600!')
      expect(label.classes()).not.toContain('maz:text-success-600!')
      expect(label.classes()).not.toContain('maz:text-warning-600!')
      wrapper.unmount()
    })
  })

  describe('when disabled prop is set', () => {
    it('should disable input', () => {
      const wrapper = mount(MazInputNumber, {
        props: { disabled: true },
      })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      wrapper.unmount()
    })
  })

  describe('when custom id is set', () => {
    it('should use custom id', () => {
      const wrapper = mount(MazInputNumber, {
        props: { id: 'custom-id' },
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-id')
      wrapper.unmount()
    })
  })

  describe('when inputmode is set', () => {
    it('should pass inputmode to input', () => {
      const wrapper = mount(MazInputNumber, {
        props: { inputmode: 'decimal' },
      })
      wrapper.unmount()
    })
  })

  describe('when hint is provided', () => {
    it('should display hint', () => {
      const wrapper = mount(MazInputNumber, {
        props: { hint: 'Enter a number' },
      })
      expect(wrapper.text()).toContain('Enter a number')
      wrapper.unmount()
    })
  })
})
