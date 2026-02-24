import MazSwitch from '@components/MazSwitch.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('MazSwitch extended branch coverage', () => {
  describe('rendering', () => {
    it('renders correctly with default props', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-switch')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
      expect(wrapper.find('.m-switch__toggle').exists()).toBe(true)
    })

    it('sets aria-checked to true when modelValue is true', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: true },
      })
      expect(wrapper.attributes('aria-checked')).toBe('true')
    })

    it('sets aria-checked to false when modelValue is false', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.attributes('aria-checked')).toBe('false')
    })

    it('has role=switch on the label', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.attributes('role')).toBe('switch')
    })
  })

  describe('disabled state', () => {
    it('applies --is-disabled class when disabled', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, disabled: true },
      })
      expect(wrapper.classes()).toContain('--is-disabled')
    })

    it('does not apply --is-disabled class when not disabled', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, disabled: false },
      })
      expect(wrapper.classes()).not.toContain('--is-disabled')
    })

    it('sets disabled attribute on input', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, disabled: true },
      })
      expect(wrapper.find('input').element.disabled).toBe(true)
    })

    it('does not set disabled attribute when not disabled', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.find('input').element.disabled).toBe(false)
    })
  })

  describe('color prop', () => {
    it('applies primary color by default', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-primary))')
    })

    it('applies success color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'success' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-success))')
    })

    it('applies warning color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'warning' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-warning))')
    })

    it('applies destructive color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'destructive' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-destructive))')
    })

    it('applies info color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'info' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-info))')
    })

    it('applies secondary color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'secondary' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-secondary))')
    })

    it('applies contrast color', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, color: 'contrast' },
      })
      expect(wrapper.attributes('style')).toContain('hsl(var(--maz-contrast))')
    })
  })

  describe('emit function (toggle)', () => {
    it('emits update:model-value and change when toggled from false', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([true])
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')![0]).toEqual([true])
    })

    it('emits update:model-value and change when toggled from true', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: true },
      })
      await wrapper.find('input').trigger('change')
      expect(wrapper.emitted('update:model-value')![0]).toEqual([false])
      expect(wrapper.emitted('change')![0]).toEqual([false])
    })
  })

  describe('keyboard handler', () => {
    it('toggles on Space keydown', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Space' })
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([true])
    })

    it('does not toggle on Enter keydown', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Enter' })
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })

    it('does not toggle on Tab keydown', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('keydown', { code: 'Tab' })
      expect(wrapper.emitted('update:model-value')).toBeFalsy()
    })
  })

  describe('focus and blur events', () => {
    it('emits focus event when label is focused', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('emits blur event when label loses focus', async () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      await wrapper.find('label').trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('label text', () => {
    it('renders label when label prop is provided', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, label: 'Enable notifications' },
      })
      expect(wrapper.find('.m-switch__text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Enable notifications')
    })

    it('does not render text span when no label, hint or slot', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.find('.m-switch__text').exists()).toBe(false)
    })

    it('renders default slot content', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
        slots: {
          default: 'Custom label content',
        },
      })
      expect(wrapper.find('.m-switch__text').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom label content')
    })

    it('sets aria-label from label prop on input', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, label: 'Toggle feature' },
      })
      expect(wrapper.find('input').attributes('aria-label')).toBe('Toggle feature')
    })
  })

  describe('hint prop', () => {
    it('renders hint text when hint is provided', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, hint: 'Some hint text' },
      })
      expect(wrapper.find('.m-switch__hint').exists()).toBe(true)
      expect(wrapper.find('.m-switch__hint').text()).toBe('Some hint text')
    })

    it('does not render hint when not provided', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, label: 'Switch' },
      })
      expect(wrapper.find('.m-switch__hint').exists()).toBe(false)
    })

    it('applies --error class to hint when error is true', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, hint: 'Error hint', error: true },
      })
      expect(wrapper.find('.m-switch__hint').classes()).toContain('--error')
    })

    it('applies --success class to hint when success is true', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, hint: 'Success hint', success: true },
      })
      expect(wrapper.find('.m-switch__hint').classes()).toContain('--success')
    })

    it('applies --warning class to hint when warning is true', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, hint: 'Warning hint', warning: true },
      })
      expect(wrapper.find('.m-switch__hint').classes()).toContain('--warning')
    })

    it('does not apply state classes to hint when no state is set', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, hint: 'Neutral hint' },
      })
      const hint = wrapper.find('.m-switch__hint')
      expect(hint.classes()).not.toContain('--error')
      expect(hint.classes()).not.toContain('--success')
      expect(hint.classes()).not.toContain('--warning')
    })
  })

  describe('name prop', () => {
    it('does not set name attribute by default', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      // name defaults to undefined
      expect(wrapper.find('input').attributes('name')).toBeUndefined()
    })

    it('sets name attribute when name prop is provided', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, name: 'my-switch' },
      })
      expect(wrapper.find('input').attributes('name')).toBe('my-switch')
    })
  })

  describe('custom class and style', () => {
    it('applies custom class to root element', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, class: 'my-class' },
      })
      expect(wrapper.classes()).toContain('my-class')
    })

    it('applies custom style to root element', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, style: { margin: '8px' } },
      })
      expect(wrapper.attributes('style')).toContain('margin: 8px')
    })
  })

  describe('custom id', () => {
    it('uses custom id when provided', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false, id: 'custom-switch' },
      })
      expect(wrapper.find('input').attributes('id')).toBe('custom-switch')
      expect(wrapper.find('label').attributes('for')).toBe('custom-switch')
    })
  })

  describe('checked state on input', () => {
    it('sets checked when modelValue is true', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: true },
      })
      expect(wrapper.find('input').element.checked).toBe(true)
    })

    it('does not set checked when modelValue is false', () => {
      const wrapper = mount(MazSwitch, {
        props: { modelValue: false },
      })
      expect(wrapper.find('input').element.checked).toBe(false)
    })
  })
})
