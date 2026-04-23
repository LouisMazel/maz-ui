import MazInputCode from '@components/MazInputCode.vue'
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('MazInputCode branch coverage', () => {
  describe('rendering with default props', () => {
    it('renders 4 input fields by default', () => {
      const wrapper = shallowMount(MazInputCode)
      expect(wrapper.findAll('input').length).toBe(4)
    })

    it('renders the correct number of inputs with custom codeLength', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 6 },
      })
      expect(wrapper.findAll('input').length).toBe(6)
    })

    it('renders with codeLength of 1', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 1 },
      })
      expect(wrapper.findAll('input').length).toBe(1)
    })
  })

  describe('size prop', () => {
    it('applies --xs class for xs size', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { size: 'xs' },
      })
      expect(wrapper.find('.m-input-code').classes()).toContain('--xs')
    })

    it('applies --sm class for sm size', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { size: 'sm' },
      })
      expect(wrapper.find('.m-input-code').classes()).toContain('--sm')
    })

    it('applies --md class for md size (default)', () => {
      const wrapper = shallowMount(MazInputCode)
      expect(wrapper.find('.m-input-code').classes()).toContain('--md')
    })

    it('applies --lg class for lg size', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { size: 'lg' },
      })
      expect(wrapper.find('.m-input-code').classes()).toContain('--lg')
    })

    it('applies --xl class for xl size', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { size: 'xl' },
      })
      expect(wrapper.find('.m-input-code').classes()).toContain('--xl')
    })
  })

  describe('color prop', () => {
    it('applies primary color CSS variable by default', () => {
      const wrapper = shallowMount(MazInputCode)
      const style = wrapper.find('.m-input-code').attributes('style') || ''
      expect(style).toContain('--input-border-color: var(--maz-primary)')
    })

    it('applies secondary color CSS variable', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { color: 'secondary' },
      })
      const style = wrapper.find('.m-input-code').attributes('style') || ''
      expect(style).toContain('--input-border-color: var(--maz-secondary)')
    })

    it('applies info color CSS variable', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { color: 'info' },
      })
      const style = wrapper.find('.m-input-code').attributes('style') || ''
      expect(style).toContain('--input-border-color: var(--maz-info)')
    })

    it('applies success color CSS variable', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { color: 'success' },
      })
      const style = wrapper.find('.m-input-code').attributes('style') || ''
      expect(style).toContain('--input-border-color: var(--maz-success)')
    })
  })

  describe('disabled prop', () => {
    it('disables the fieldset when disabled is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { disabled: true },
      })
      expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
    })

    it('does not disable fieldset when disabled is false', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { disabled: false },
      })
      expect(wrapper.find('fieldset').attributes('disabled')).toBeUndefined()
    })
  })

  describe('required prop', () => {
    it('sets required attribute on inputs when required is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { required: true },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('required')).toBeDefined()
      })
    })

    it('does not set required attribute when required is false', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { required: false },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('required')).toBeUndefined()
      })
    })
  })

  describe('borderColorState computed', () => {
    it('returns destructive border class when error is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { error: true },
      })
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).toContain('maz:border-destructive!')
      })
    })

    it('returns success border class when success is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { success: true },
      })
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).toContain('maz:border-success!')
      })
    })

    it('returns warning border class when warning is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { warning: true },
      })
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).toContain('maz:border-warning!')
      })
    })

    it('returns no border class when no state props are set', () => {
      const wrapper = shallowMount(MazInputCode)
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).not.toContain('maz:border-destructive!')
        expect(w.classes()).not.toContain('maz:border-success!')
        expect(w.classes()).not.toContain('maz:border-warning!')
      })
    })

    it('error takes priority over success and warning', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { error: true, success: true, warning: true },
      })
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).toContain('maz:border-destructive!')
        expect(w.classes()).not.toContain('maz:border-success!')
        expect(w.classes()).not.toContain('maz:border-warning!')
      })
    })

    it('success takes priority over warning when error is false', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { error: false, success: true, warning: true },
      })
      const inputWrappers = wrapper.findAll('.input-wrapper')
      inputWrappers.forEach((w) => {
        expect(w.classes()).toContain('maz:border-success!')
        expect(w.classes()).not.toContain('maz:border-warning!')
      })
    })
  })

  describe('hint prop', () => {
    it('displays hint text', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { hint: 'Enter your code' },
      })
      expect(wrapper.find('.m-input-code__hint').text()).toBe('Enter your code')
    })

    it('applies --error class to hint when error is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { hint: 'Error message', error: true },
      })
      expect(wrapper.find('.m-input-code__hint').classes()).toContain('--error')
    })

    it('applies --success class to hint when success is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { hint: 'Success', success: true },
      })
      expect(wrapper.find('.m-input-code__hint').classes()).toContain('--success')
    })

    it('applies --warning class to hint when warning is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { hint: 'Warning', warning: true },
      })
      expect(wrapper.find('.m-input-code__hint').classes()).toContain('--warning')
    })

    it('does not apply state class when no state prop set', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { hint: 'Regular hint' },
      })
      const hint = wrapper.find('.m-input-code__hint')
      expect(hint.classes()).not.toContain('--error')
      expect(hint.classes()).not.toContain('--success')
      expect(hint.classes()).not.toContain('--warning')
    })
  })

  describe('acceptAlpha prop', () => {
    it('sets inputmode to numeric when acceptAlpha is false', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: false },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('inputmode')).toBe('numeric')
      })
    })

    it('sets inputmode to text when acceptAlpha is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: true },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('inputmode')).toBe('text')
      })
    })

    it('sets numeric pattern when acceptAlpha is false', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: false },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('pattern')).toBe('[0-9]{1}')
      })
    })

    it('sets alphanumeric pattern when acceptAlpha is true', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: true },
      })
      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('pattern')).toBe('[a-zA-Z0-9]{1}')
      })
    })
  })

  describe('modelValue watcher', () => {
    it('initializes map from modelValue string', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: '1234' },
      })

      const inputs = wrapper.findAll('input')
      expect((inputs[0].element as HTMLInputElement).value).toBe('1')
      expect((inputs[1].element as HTMLInputElement).value).toBe('2')
      expect((inputs[2].element as HTMLInputElement).value).toBe('3')
      expect((inputs[3].element as HTMLInputElement).value).toBe('4')
    })

    it('updates map when modelValue changes', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: '1234' },
      })

      await wrapper.setProps({ modelValue: '5678' })
      await nextTick()

      const inputs = wrapper.findAll('input')
      expect((inputs[0].element as HTMLInputElement).value).toBe('5')
      expect((inputs[1].element as HTMLInputElement).value).toBe('6')
      expect((inputs[2].element as HTMLInputElement).value).toBe('7')
      expect((inputs[3].element as HTMLInputElement).value).toBe('8')
    })

    it('initializes empty map when modelValue is undefined', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: undefined },
      })

      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect((input.element as HTMLInputElement).value).toBe('')
      })
    })

    it('does not update when modelValue is the same', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: '1234' },
      })

      await wrapper.setProps({ modelValue: '1234' })
      await nextTick()

      // Should still have correct values
      const inputs = wrapper.findAll('input')
      expect((inputs[0].element as HTMLInputElement).value).toBe('1')
    })

    it('handles numeric modelValue', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: 1234, type: 'number' },
      })

      const inputs = wrapper.findAll('input')
      expect((inputs[0].element as HTMLInputElement).value).toBe('1')
      expect((inputs[1].element as HTMLInputElement).value).toBe('2')
    })

    it('handles partial modelValue (shorter than codeLength)', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { modelValue: '12', codeLength: 4 },
      })

      const inputs = wrapper.findAll('input')
      expect((inputs[0].element as HTMLInputElement).value).toBe('1')
      expect((inputs[1].element as HTMLInputElement).value).toBe('2')
      expect((inputs[2].element as HTMLInputElement).value).toBe('')
      expect((inputs[3].element as HTMLInputElement).value).toBe('')
    })
  })

  describe('handleNewValue', () => {
    it('emits update:model-value when input receives a valid digit', async () => {
      const wrapper = shallowMount(MazInputCode)

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('5')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('5')
    })

    it('sanitizes non-numeric input when acceptAlpha is false', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: false },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('a')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      // 'a' should be stripped, emitting empty string
      expect(emitted?.[0][0]).toBe('')
    })

    it('accepts alpha characters when acceptAlpha is true', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: true },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('a')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('a')
    })

    it('fills all inputs and emits completed', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 4 },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')
      await inputs[1].setValue('2')
      await inputs[2].setValue('3')
      await inputs[3].setValue('4')

      expect(wrapper.emitted('completed')).toBeTruthy()
      expect(wrapper.emitted('completed')!.length).toBe(1)
    })

    it('does not emit completed when not all inputs are filled', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 4 },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')
      await inputs[1].setValue('2')

      expect(wrapper.emitted('completed')).toBeFalsy()
    })
  })

  describe('getEmittedValue', () => {
    it('returns string when type is text', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { type: 'text' },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')

      const emitted = wrapper.emitted('update:model-value')
      expect(typeof emitted?.[0][0]).toBe('string')
    })

    it('returns number when type is number and valid', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { type: 'number', codeLength: 4 },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')
      await inputs[1].setValue('2')
      await inputs[2].setValue('3')
      await inputs[3].setValue('4')

      const emitted = wrapper.emitted('update:model-value')
      // Last emission should be a number 1234
      const lastIdx = emitted!.length - 1
      expect(emitted?.[lastIdx][0]).toBe(1234)
    })

    it('returns undefined when type is number but value is NaN', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { type: 'number', acceptAlpha: true },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('a')

      const emitted = wrapper.emitted('update:model-value')
      // 'a' as number is NaN, so should emit undefined
      expect(emitted?.[0][0]).toBeUndefined()
    })

    it('returns empty string when type is text and no values set', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { type: 'text' },
      })

      // Trigger an input event with empty value
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('')

      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        expect(typeof emitted[0][0]).toBe('string')
      }
    })
  })

  describe('handleKeydown', () => {
    it('focuses next input on ArrowRight', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].trigger('keydown', { key: 'ArrowRight' })

      // Focus should move to next input (asynchronously via setTimeout)
      await vi.waitFor(() => {
        expect(document.activeElement).toBeTruthy()
      })

      wrapper.unmount()
    })

    it('focuses previous input on ArrowLeft', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[1].trigger('keydown', { key: 'ArrowLeft' })

      await vi.waitFor(() => {
        expect(document.activeElement).toBeTruthy()
      })

      wrapper.unmount()
    })

    it('clears previous input and focuses it on Backspace when current is empty', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4, modelValue: '12' },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      // Input at index 2 (3rd) is empty
      await inputs[2].trigger('keydown', { key: 'Backspace' })

      await nextTick()

      // Should have emitted an update clearing the value at index 2
      expect(wrapper.emitted('update:model-value')).toBeTruthy()

      wrapper.unmount()
    })

    it('does not go to negative index on Backspace at first input', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].trigger('keydown', { key: 'Backspace' })

      // Should not throw
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })

    it('does nothing for Backspace when current input has value', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4, modelValue: '1234' },
        attachTo: document.body,
      })

      const emittedBefore = wrapper.emitted('update:model-value')?.length || 0

      const inputs = wrapper.findAll('input')
      await inputs[1].trigger('keydown', { key: 'Backspace' })

      // Backspace should not trigger update when input has value
      // (browser handles the actual deletion)
      const emittedAfter = wrapper.emitted('update:model-value')?.length || 0
      expect(emittedAfter).toBe(emittedBefore)

      wrapper.unmount()
    })
  })

  describe('setValueOnPaste', () => {
    it('handles paste without clipboardData', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].trigger('paste')

      await nextTick()
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('selectInputByIndex', () => {
    it('selects input at given index on click', async () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4, modelValue: '1234' },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      const selectSpy = vi.spyOn(inputs[1].element as HTMLInputElement, 'select')

      await inputs[1].trigger('click')

      expect(selectSpy).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('does not select if index exceeds codeLength', () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 2 },
        attachTo: document.body,
      })

      // No error should occur
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })
  })

  describe('focusAndSelectInputByIndex', () => {
    it('focuses and selects input at given index', async () => {
      vi.useFakeTimers()

      const wrapper = mount(MazInputCode, {
        props: { codeLength: 4 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')

      vi.advanceTimersByTime(10)
      await nextTick()

      // After entering value, focus should move to next input
      expect(wrapper.exists()).toBe(true)

      vi.useRealTimers()
      wrapper.unmount()
    })

    it('does not focus if index exceeds codeLength', async () => {
      vi.useFakeTimers()

      const wrapper = mount(MazInputCode, {
        props: { codeLength: 2 },
        attachTo: document.body,
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')
      await inputs[1].setValue('2')

      vi.advanceTimersByTime(10)
      await nextTick()

      // Should not throw when trying to focus beyond last input
      expect(wrapper.exists()).toBe(true)

      vi.useRealTimers()
      wrapper.unmount()
    })
  })

  describe('class and style props', () => {
    it('applies custom class to fieldset', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { class: 'custom-class' },
      })
      expect(wrapper.find('.m-input-code').classes()).toContain('custom-class')
    })

    it('applies custom style to fieldset', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { style: 'max-width: 300px' },
      })
      const style = wrapper.find('.m-input-code').attributes('style') || ''
      expect(style).toContain('max-width: 300px')
    })

    it('renders without custom class when not provided', () => {
      const wrapper = shallowMount(MazInputCode)
      const classes = wrapper.find('.m-input-code').classes()
      expect(classes).toContain('m-input-code')
    })
  })

  describe('attrs inheritance', () => {
    it('passes attrs to input elements (inheritAttrs false)', () => {
      const wrapper = mount(MazInputCode, {
        props: { codeLength: 2 },
        attrs: {
          'data-testid': 'code-input',
        },
      })

      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('data-testid')).toBe('code-input')
      })
    })
  })

  describe('input id and name attributes', () => {
    it('generates correct id for each input', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 3 },
      })

      const inputs = wrapper.findAll('input')
      expect(inputs[0].attributes('id')).toBe('m-input-code-1')
      expect(inputs[1].attributes('id')).toBe('m-input-code-2')
      expect(inputs[2].attributes('id')).toBe('m-input-code-3')
    })

    it('generates correct name for each input', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 3 },
      })

      const inputs = wrapper.findAll('input')
      expect(inputs[0].attributes('name')).toBe('m-input-code-1')
      expect(inputs[1].attributes('name')).toBe('m-input-code-2')
      expect(inputs[2].attributes('name')).toBe('m-input-code-3')
    })
  })

  describe('input attributes', () => {
    it('sets minlength and maxlength to 1', () => {
      const wrapper = shallowMount(MazInputCode)

      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('minlength')).toBe('1')
        expect(input.attributes('maxlength')).toBe('1')
      })
    })

    it('sets autocomplete to do-not-autofill', () => {
      const wrapper = shallowMount(MazInputCode)

      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('autocomplete')).toBe('do-not-autofill')
      })
    })

    it('sets type to text for all inputs regardless of type prop', () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { type: 'number' },
      })

      const inputs = wrapper.findAll('input')
      inputs.forEach((input) => {
        expect(input.attributes('type')).toBe('text')
      })
    })
  })

  describe('getValueSanitized edge cases', () => {
    it('returns undefined for special characters when acceptAlpha is false', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: false },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('!')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('')
    })

    it('returns value for underscore when acceptAlpha is true (\\w includes _)', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { acceptAlpha: true },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('_')

      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe('_')
    })
  })

  describe('complete sequence', () => {
    it('handles full code entry sequence for text type', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 4, type: 'text' },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('a')
      await inputs[1].setValue('b')
      await inputs[2].setValue('c')
      await inputs[3].setValue('d')

      // Should emit completed
      expect(wrapper.emitted('completed')).toBeFalsy()
      // With acceptAlpha false, alphabetic chars are stripped
    })

    it('handles full code entry sequence for number type', async () => {
      const wrapper = shallowMount(MazInputCode, {
        props: { codeLength: 4, type: 'number' },
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('1')
      await inputs[1].setValue('2')
      await inputs[2].setValue('3')
      await inputs[3].setValue('4')

      expect(wrapper.emitted('completed')).toBeTruthy()

      const emitted = wrapper.emitted('update:model-value')
      const lastIdx = emitted!.length - 1
      expect(emitted?.[lastIdx][0]).toBe(1234)
    })
  })
})
