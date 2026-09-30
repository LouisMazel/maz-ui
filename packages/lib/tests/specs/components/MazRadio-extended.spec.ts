import MazRadio from '@components/MazRadio.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('MazRadio extended branch coverage', () => {
  describe('rendering', () => {
    it('renders correctly with required props', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'group1' },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-radio')
      expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
      expect(wrapper.attributes('role')).toBe('radio')
    })
  })

  describe('isSelected computed', () => {
    it('adds --selected class when modelValue matches value', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'option1', name: 'group1', modelValue: 'option1' },
      })
      expect(wrapper.classes()).toContain('--selected')
      expect(wrapper.attributes('aria-checked')).toBe('true')
    })

    it('does not add --selected class when modelValue does not match value', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'option1', name: 'group1', modelValue: 'option2' },
      })
      expect(wrapper.classes()).not.toContain('--selected')
      expect(wrapper.attributes('aria-checked')).toBe('false')
    })

    it('does not add --selected class when modelValue is undefined', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'option1', name: 'group1' },
      })
      expect(wrapper.classes()).not.toContain('--selected')
    })

    it('handles numeric values correctly', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 42, name: 'group1', modelValue: 42 },
      })
      expect(wrapper.classes()).toContain('--selected')
    })

    it('handles boolean values correctly', () => {
      const wrapper = mount(MazRadio, {
        props: { value: true, name: 'group1', modelValue: true },
      })
      expect(wrapper.classes()).toContain('--selected')
    })

    it('does not select when boolean values differ', () => {
      const wrapper = mount(MazRadio, {
        props: { value: true, name: 'group1', modelValue: false },
      })
      expect(wrapper.classes()).not.toContain('--selected')
    })
  })

  describe('radioSize computed', () => {
    it('applies default md size (1.625rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'md' },
      })
      expect(wrapper.attributes('style')).toContain('1.625rem')
    })

    it('applies xl size (2.25rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'xl' },
      })
      expect(wrapper.attributes('style')).toContain('2.25rem')
    })

    it('applies lg size (2rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'lg' },
      })
      expect(wrapper.attributes('style')).toContain('2rem')
    })

    it('applies sm size (1.425rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'sm' },
      })
      expect(wrapper.attributes('style')).toContain('1.425rem')
    })

    it('applies xs size (1.325rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'xs' },
      })
      expect(wrapper.attributes('style')).toContain('1.325rem')
    })

    it('applies mini size (1.2rem)', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', size: 'mini' },
      })
      expect(wrapper.attributes('style')).toContain('1.2rem')
    })
  })

  describe('radioSelectedColor computed', () => {
    it('uses primary color by default', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-primary)')
    })

    it('uses success color', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'success' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-success)')
    })

    it('uses warning color', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'warning' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-warning)')
    })

    it('uses destructive color', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'destructive' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-destructive)')
    })

    it('uses info color', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'info' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-info)')
    })

    it('uses contrast color', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'contrast' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-contrast)')
    })
  })

  describe('radioBoxShadow computed', () => {
    it('uses destructive color for box shadow when error is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', error: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-destructive)')
    })

    it('uses warning color for box shadow when warning is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', warning: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-warning)')
    })

    it('uses success color for box shadow when success is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', success: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-success)')
    })

    it('uses muted color for box shadow when color is transparent', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'transparent' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-muted)')
    })

    it('uses muted color for box shadow when color is contrast', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'contrast' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-muted)')
    })

    it('uses color with opacity for regular colors', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', color: 'info' },
      })
      expect(wrapper.attributes('style')).toContain('color-mix(in srgb, var(--maz-info) 60%, transparent)')
    })

    it('error takes precedence over warning and success', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', error: true, warning: true, success: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-destructive)')
    })

    it('warning takes precedence over success', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', warning: true, success: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-warning)')
    })
  })

  describe('disabled state', () => {
    it('sets disabled attribute on input when disabled is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', disabled: true },
      })
      expect(wrapper.find('input').element.disabled).toBe(true)
    })

    it('does not set disabled attribute by default', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      expect(wrapper.find('input').element.disabled).toBe(false)
    })
  })

  describe('emitValue', () => {
    it('emits update:model-value and change when input changes', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'option1', name: 'group1', modelValue: 'option2' },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual(['option1'])
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual(['option1'])
    })

    it('emits numeric value', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 42, name: 'group1' },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')![0]).toEqual([42])
    })
  })

  describe('keyboard handler', () => {
    it('emits value on Space keydown', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Space' })
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual(['a'])
    })

    it('does not emit on Enter keydown', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Enter' })
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('does not emit on other key presses', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      await wrapper.find('label').trigger('keydown', { code: 'KeyA' })
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('focus and blur events', () => {
    it('emits focus event', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      await wrapper.find('label').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event', async () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      await wrapper.find('label').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('label prop', () => {
    it('renders label text from label prop', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', label: 'Option A' },
      })
      expect(wrapper.find('.m-radio__text').text()).toContain('Option A')
    })

    it('renders slot content instead of label prop', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', label: 'Option A' },
        slots: {
          default: 'Slot Label',
        },
      })
      expect(wrapper.find('.m-radio__text').text()).toContain('Slot Label')
    })
  })

  describe('hint prop', () => {
    it('renders hint when provided', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', hint: 'Select this option' },
      })
      expect(wrapper.find('.m-radio__hint').exists()).toBe(true)
      expect(wrapper.find('.m-radio__hint').text()).toBe('Select this option')
    })

    it('does not render hint when not provided', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      expect(wrapper.find('.m-radio__hint').exists()).toBe(false)
    })

    it('applies --error class to hint when error is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', hint: 'Error', error: true },
      })
      expect(wrapper.find('.m-radio__hint').classes()).toContain('--error')
    })

    it('applies --success class to hint when success is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', hint: 'Success', success: true },
      })
      expect(wrapper.find('.m-radio__hint').classes()).toContain('--success')
    })

    it('applies --warning class to hint when warning is true', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', hint: 'Warning', warning: true },
      })
      expect(wrapper.find('.m-radio__hint').classes()).toContain('--warning')
    })
  })

  describe('error, warning, success classes on root', () => {
    it('applies --error class to root', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', error: true },
      })
      expect(wrapper.classes()).toContain('--error')
    })

    it('applies --warning class to root', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', warning: true },
      })
      expect(wrapper.classes()).toContain('--warning')
    })

    it('applies --success class to root', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', success: true },
      })
      expect(wrapper.classes()).toContain('--success')
    })

    it('does not apply state classes by default', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g' },
      })
      expect(wrapper.classes()).not.toContain('--error')
      expect(wrapper.classes()).not.toContain('--warning')
      expect(wrapper.classes()).not.toContain('--success')
    })
  })

  describe('custom id', () => {
    it('uses custom id when provided', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', id: 'custom-radio' },
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-radio')
      expect(wrapper.find('label').attributes('for')).toBe('custom-radio')
    })
  })

  describe('custom class and style', () => {
    it('applies custom class to root element', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', class: 'custom-radio-class' },
      })
      expect(wrapper.classes()).toContain('custom-radio-class')
    })

    it('applies custom style to root element', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', style: { padding: '4px' } },
      })
      expect(wrapper.attributes('style')).toContain('padding: 4px')
    })
  })

  describe('input checked state', () => {
    it('sets checked attribute when selected', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', modelValue: 'a' },
      })
      expect(wrapper.find('input').element.checked).toBe(true)
    })

    it('does not set checked attribute when not selected', () => {
      const wrapper = mount(MazRadio, {
        props: { value: 'a', name: 'g', modelValue: 'b' },
      })
      expect(wrapper.find('input').element.checked).toBe(false)
    })
  })
})
