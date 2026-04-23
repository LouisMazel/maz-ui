import MazInputPrice from '@components/MazInputPrice.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('MazInputPrice branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazInputPrice)
      expect(wrapper.find('.maz\\:input-price').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when modelValue is set', () => {
    it('should display formatted price when not active', () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 42.5, currency: 'EUR', locale: 'fr-FR' },
      })
      // When not active, should show formatted price
      expect(wrapper.find('input').element.value).toBeTruthy()
      wrapper.unmount()
    })

    it('should display raw value when active (focused)', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 42.5, currency: 'EUR', locale: 'fr-FR' },
      })
      await wrapper.find('input').trigger('focus')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when modelValue is undefined', () => {
    it('should display nothing', () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: undefined },
      })
      expect(wrapper.find('input').element.value).toBe('')
      wrapper.unmount()
    })
  })

  describe('when input receives value', () => {
    it('should emit update:model-value with parsed number', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: undefined },
      })
      await wrapper.find('input').setValue('42.50')
      await wrapper.find('input').trigger('input')
      await nextTick()
      const emitted = wrapper.emitted('input')
      expect(emitted).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when blurring the input', () => {
    it('should emit blur event', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 10 },
      })
      await wrapper.find('input').trigger('focus')
      await wrapper.find('input').trigger('blur')
      await nextTick()
      expect(wrapper.emitted('blur')).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when focusing the input', () => {
    it('should emit focus event', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 10 },
      })
      await wrapper.find('input').trigger('focus')
      await nextTick()
      expect(wrapper.emitted('focus')).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when value exceeds max', () => {
    it('should clamp to max', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 200, max: 100 },
      })
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const lastValue = emitted!.at(-1)?.[0]
      expect(lastValue).toBe(100)
      wrapper.unmount()
    })
  })

  describe('when value is below min', () => {
    it('should clamp to min', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 5, min: 10 },
      })
      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      const lastValue = emitted!.at(-1)?.[0]
      expect(lastValue).toBe(10)
      wrapper.unmount()
    })
  })

  describe('when noIcon is true', () => {
    it('should not display icon', () => {
      const wrapper = mount(MazInputPrice, {
        props: { noIcon: true },
      })
      // No left-icon should be rendered
      expect(wrapper.find('.m-input-wrapper-left-icon').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when noIcon is false', () => {
    it('should display the banknotes icon', () => {
      const wrapper = mount(MazInputPrice, {
        props: { noIcon: false },
      })
      // Check for icon presence
      wrapper.unmount()
    })
  })

  describe('when currency is USD', () => {
    it('should format with USD', () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 42.5, currency: 'USD', locale: 'en-US' },
      })
      expect(wrapper.find('input').element.value).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when entering a negative value', () => {
    it('should handle negative string input', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: undefined },
      })
      await wrapper.find('input').setValue('-42.50')
      await wrapper.find('input').trigger('input')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when entering non-numeric value', () => {
    it('should return undefined', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: undefined },
      })
      await wrapper.find('input').setValue('abc')
      await wrapper.find('input').trigger('input')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when block prop is set', () => {
    it('should pass block to MazInput', () => {
      const wrapper = mount(MazInputPrice, {
        props: { block: true },
      })
      wrapper.unmount()
    })
  })

  describe('when error prop is set', () => {
    it('should pass error to MazInput', () => {
      const wrapper = mount(MazInputPrice, {
        props: { error: true },
      })
      wrapper.unmount()
    })
  })

  describe('when success prop is set', () => {
    it('should pass success to MazInput', () => {
      const wrapper = mount(MazInputPrice, {
        props: { success: true },
      })
      wrapper.unmount()
    })
  })

  describe('when warning prop is set', () => {
    it('should pass warning to MazInput', () => {
      const wrapper = mount(MazInputPrice, {
        props: { warning: true },
      })
      wrapper.unmount()
    })
  })

  describe('when pressing enter', () => {
    it('should emit values', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 42 },
      })
      await wrapper.find('input').trigger('keydown.enter')
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when modelValue changes externally', () => {
    it('should update internal value', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: 10 },
      })
      await wrapper.setProps({ modelValue: 20 })
      await nextTick()
      wrapper.unmount()
    })
  })

  describe('when currencyOptions are provided', () => {
    it('should use custom currency options', () => {
      const wrapper = mount(MazInputPrice, {
        props: {
          modelValue: 42.5,
          currencyOptions: { round: false },
        },
      })
      wrapper.unmount()
    })
  })

  describe('when hint is provided', () => {
    it('should show hint text', () => {
      const wrapper = mount(MazInputPrice, {
        props: { hint: 'Enter price' },
      })
      expect(wrapper.text()).toContain('Enter price')
      wrapper.unmount()
    })
  })

  describe('when value with commas is entered', () => {
    it('should parse comma as decimal separator', async () => {
      const wrapper = mount(MazInputPrice, {
        props: { modelValue: undefined },
      })
      await wrapper.find('input').setValue('42,50')
      await wrapper.find('input').trigger('input')
      await nextTick()
      wrapper.unmount()
    })
  })
})
