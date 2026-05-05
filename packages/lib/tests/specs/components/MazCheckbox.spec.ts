import MazCheckbox from '@components/MazCheckbox.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('MazCheckbox extended branch coverage', () => {
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

  describe('isChecked computed', () => {
    it('returns true when modelValue is true (boolean)', () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: true,
        },
      })
      expect(wrapper.find('input').element.checked).toBe(true)
      expect(wrapper.attributes('aria-checked')).toBe('true')
    })

    it('returns false when modelValue is false (boolean)', () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: false,
        },
      })
      expect(wrapper.find('input').element.checked).toBe(false)
      expect(wrapper.attributes('aria-checked')).toBe('false')
    })

    it('returns true when modelValue is array containing the value', () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: ['apple', 'banana'],
          value: 'apple',
        },
      })
      expect(wrapper.find('input').element.checked).toBe(true)
    })

    it('returns false when modelValue is array not containing the value', () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: ['apple', 'banana'],
          value: 'cherry',
        },
      })
      expect(wrapper.find('input').element.checked).toBe(false)
    })

    it('returns false when modelValue is undefined', () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: undefined,
        },
      })
      expect(wrapper.find('input').element.checked).toBe(false)
    })
  })

  describe('checkboxSize computed', () => {
    it('applies xl size', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, size: 'xl' },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 2rem')
      expect(span.attributes('style')).toContain('height: 2rem')
    })

    it('applies lg size', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, size: 'lg' },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 1.75rem')
      expect(span.attributes('style')).toContain('height: 1.75rem')
    })

    it('applies md size (default)', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 1.5rem')
      expect(span.attributes('style')).toContain('height: 1.5rem')
    })

    it('applies sm size', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, size: 'sm' },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 1.25rem')
      expect(span.attributes('style')).toContain('height: 1.25rem')
    })

    it('applies xs size', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, size: 'xs' },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 1rem')
      expect(span.attributes('style')).toContain('height: 1rem')
    })

    it('applies mini size', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, size: 'mini' },
      })
      const span = wrapper.find('label > span')
      expect(span.attributes('style')).toContain('width: 0.75rem')
      expect(span.attributes('style')).toContain('height: 0.75rem')
    })
  })

  describe('checkIconColor computed', () => {
    it('uses contrast color for icon when color is contrast', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, color: 'contrast' },
      })
      const checkIcon = wrapper.find('.check-icon')
      expect(checkIcon.attributes('style')).toContain('var(--maz-surface)')
    })

    it('uses color-foreground for icon when color is primary', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, color: 'primary' },
      })
      const checkIcon = wrapper.find('.check-icon')
      expect(checkIcon.attributes('style')).toContain('var(--maz-primary-foreground)')
    })

    it('uses color-foreground for icon when color is success', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, color: 'success' },
      })
      const checkIcon = wrapper.find('.check-icon')
      expect(checkIcon.attributes('style')).toContain('var(--maz-success-foreground)')
    })
  })

  describe('checkboxSelectedColor computed', () => {
    it('uses contrast color for checkbox background when color is contrast', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, color: 'contrast' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-contrast)')
    })

    it('uses specific color for checkbox background', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, color: 'warning' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-warning)')
    })
  })

  describe('checkboxBoxShadow computed', () => {
    it('uses destructive color for box shadow when error is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, error: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-destructive)')
    })

    it('uses warning color for box shadow when warning is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, warning: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-warning)')
    })

    it('uses success color for box shadow when success is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, success: true },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-success)')
    })

    it('uses muted color for box shadow when color is transparent', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, color: 'transparent' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-muted)')
    })

    it('uses muted color for box shadow when color is contrast', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, color: 'contrast' },
      })
      expect(wrapper.attributes('style')).toContain('var(--maz-muted)')
    })

    it('uses color with opacity for box shadow for regular colors', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, color: 'info' },
      })
      expect(wrapper.attributes('style')).toContain('color-mix(in srgb, var(--maz-info) 60%, transparent)')
    })
  })

  describe('disabled state', () => {
    it('renders disabled input when disabled prop is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, disabled: true },
      })
      expect(wrapper.find('input').element.disabled).toBe(true)
    })

    it('renders enabled input by default', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      expect(wrapper.find('input').element.disabled).toBe(false)
    })
  })

  describe('label and hint', () => {
    it('renders label text when label prop is provided', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, label: 'Accept terms' },
      })
      expect(wrapper.find('.m-checkbox__text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Accept terms')
    })

    it('renders hint when hint prop is provided', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, hint: 'Required field' },
      })
      expect(wrapper.find('.m-checkbox__hint').exists()).toBe(true)
      expect(wrapper.find('.m-checkbox__hint').text()).toBe('Required field')
    })

    it('applies error class to hint when error is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, hint: 'Error', error: true },
      })
      expect(wrapper.find('.m-checkbox__hint').classes()).toContain('--error')
    })

    it('applies success class to hint when success is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, hint: 'Success', success: true },
      })
      expect(wrapper.find('.m-checkbox__hint').classes()).toContain('--success')
    })

    it('applies warning class to hint when warning is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, hint: 'Warning', warning: true },
      })
      expect(wrapper.find('.m-checkbox__hint').classes()).toContain('--warning')
    })

    it('does not render text container when no label, hint, or slot', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      expect(wrapper.find('.m-checkbox__text').exists()).toBe(false)
    })

    it('renders text container when default slot is provided', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
        slots: {
          default: 'Slot content',
        },
      })
      expect(wrapper.find('.m-checkbox__text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Slot content')
    })
  })

  describe('emitValue and getNewValue', () => {
    it('emits toggled boolean when modelValue is boolean', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      await wrapper.find('input').setValue(true)
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([true])
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('emits toggled boolean from true to false', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([false])
    })

    it('adds value to array when not present', async () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: ['apple'],
          value: 'banana',
        },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')![0]).toEqual([['apple', 'banana']])
    })

    it('removes value from array when already present', async () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: ['apple', 'banana'],
          value: 'banana',
        },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')![0]).toEqual([['apple']])
    })

    it('creates new array with value when modelValue is not an array and value is not boolean', async () => {
      const wrapper = mount(MazCheckbox, {
        props: {
          modelValue: undefined,
          value: 'apple',
        },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')![0]).toEqual([['apple']])
    })
  })

  describe('keyboard handler', () => {
    it('emits value on Space keydown', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Space' })
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
    })

    it('does not emit value on non-Space keydown', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Enter' })
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('focus and blur events', () => {
    it('emits blur event', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('emits focus event', async () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('error, warning, success classes on root', () => {
    it('applies --error class when error prop is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, error: true },
      })
      expect(wrapper.classes()).toContain('--error')
    })

    it('applies --warning class when warning prop is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, warning: true },
      })
      expect(wrapper.classes()).toContain('--warning')
    })

    it('applies --success class when success prop is true', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, success: true },
      })
      expect(wrapper.classes()).toContain('--success')
    })
  })

  describe('custom id', () => {
    it('uses custom id when provided', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, id: 'my-checkbox' },
      })
      expect(wrapper.find('input').attributes('id')).toBe('my-checkbox')
      expect(wrapper.find('label').attributes('for')).toBe('my-checkbox')
    })
  })

  describe('name prop', () => {
    it('uses default name m-checkbox', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false },
      })
      expect(wrapper.find('input').attributes('name')).toBe('m-checkbox')
    })

    it('uses custom name', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, name: 'my-field' },
      })
      expect(wrapper.find('input').attributes('name')).toBe('my-field')
    })
  })

  describe('checkIconSize computed', () => {
    it('returns maz:text-2xl for xl', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, size: 'xl' },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-2xl')
    })

    it('returns maz:text-xl for lg', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, size: 'lg' },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-xl')
    })

    it('returns maz:text-lg for md (default)', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-lg')
    })

    it('returns maz:text-base for sm', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, size: 'sm' },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-base')
    })

    it('returns maz:text-sm for xs', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, size: 'xs' },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-sm')
    })

    it('returns maz:text-xs for mini', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: true, size: 'mini' },
      })
      expect(wrapper.find('.check-icon').classes()).toContain('maz:text-xs')
    })
  })

  describe('custom class and style', () => {
    it('applies custom class', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, class: 'custom-class' },
      })
      expect(wrapper.classes()).toContain('custom-class')
    })

    it('applies custom style', () => {
      const wrapper = mount(MazCheckbox, {
        props: { modelValue: false, style: { marginTop: '10px' } },
      })
      expect(wrapper.attributes('style')).toContain('margin-top: 10px')
    })
  })
})
