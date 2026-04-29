import MazInput from '@components/MazInput.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('MazInput extended coverage', () => {
  function getWrapper(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
    return mount(MazInput, {
      props: {
        ...props,
      },
      slots: {
        ...slots,
      },
    })
  }

  describe('when rendered with default props', () => {
    it('should render the input component', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('.m-input').exists()).toBe(true)
    })

    it('should render an input element', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should have text type by default', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should have text inputmode by default', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('input').attributes('inputmode')).toBe('text')
    })

    it('should have primary color by default', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('.m-input').classes()).toContain('--primary')
    })

    it('should have border by default', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('.m-input-wrapper.--border').exists()).toBe(true)
    })

    it('should have rounded-md by default', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('.m-input-wrapper.--rounded-md').exists()).toBe(true)
    })
  })

  describe('when modelValue is provided', () => {
    it('should display the value in the input', () => {
      const wrapper = getWrapper({ modelValue: 'Hello World' })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).value).toBe('Hello World')
    })

    it('should handle numeric modelValue', () => {
      const wrapper = getWrapper({ modelValue: 42 })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).value).toBe('42')
    })

    it('should handle empty string modelValue', () => {
      const wrapper = getWrapper({ modelValue: '' })
      const input = wrapper.find('input')
      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('when type is configured', () => {
    it('should render text input', () => {
      const wrapper = getWrapper({ type: 'text' })
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should render password input', async () => {
      const wrapper = getWrapper({ type: 'password' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })

    it('should render number input', () => {
      const wrapper = getWrapper({ type: 'number' })
      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('should render email input', () => {
      const wrapper = getWrapper({ type: 'email' })
      expect(wrapper.find('input').attributes('type')).toBe('email')
    })

    it('should render tel input', () => {
      const wrapper = getWrapper({ type: 'tel' })
      expect(wrapper.find('input').attributes('type')).toBe('tel')
    })

    it('should render url input', () => {
      const wrapper = getWrapper({ type: 'url' })
      expect(wrapper.find('input').attributes('type')).toBe('url')
    })

    it('should render search input', () => {
      const wrapper = getWrapper({ type: 'search' })
      expect(wrapper.find('input').attributes('type')).toBe('search')
    })

    it('should render date input', () => {
      const wrapper = getWrapper({ type: 'date' })
      expect(wrapper.find('input').attributes('type')).toBe('date')
    })
  })

  describe('when type is password', () => {
    it('should show password toggle button', async () => {
      const wrapper = getWrapper({ type: 'password' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(true)
      const btn = wrapper.findComponent({ name: 'MazBtn' })
      expect(btn.exists()).toBe(true)
    })

    it('should toggle password visibility on button click', async () => {
      const wrapper = getWrapper({ type: 'password', modelValue: 'secret' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('input').attributes('type')).toBe('password')

      const btn = wrapper.findComponent({ name: 'MazBtn' })
      await btn.trigger('click')
      expect(wrapper.find('input').attributes('type')).toBe('text')

      await btn.trigger('click')
      expect(wrapper.find('input').attributes('type')).toBe('password')
    })
  })

  describe('when disabled prop is true', () => {
    it('should set disabled attribute on input', () => {
      const wrapper = getWrapper({ disabled: true })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    })
  })

  describe('when disabled prop is false', () => {
    it('should not set disabled attribute on input', () => {
      const wrapper = getWrapper({ disabled: false })
      expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
    })
  })

  describe('when readonly prop is true', () => {
    it('should set readonly attribute on input', () => {
      const wrapper = getWrapper({ readonly: true })
      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })

    it('should apply --is-readonly class', () => {
      const wrapper = getWrapper({ readonly: true })
      expect(wrapper.find('.m-input.--is-readonly').exists()).toBe(true)
    })
  })

  describe('when error prop is true', () => {
    it('should apply --has-state class', () => {
      const wrapper = getWrapper({ error: true })
      expect(wrapper.find('.m-input.--has-state').exists()).toBe(true)
    })

    it('should apply --has-z-2 class', () => {
      const wrapper = getWrapper({ error: true })
      expect(wrapper.find('.m-input.--has-z-2').exists()).toBe(true)
    })

    it('should apply destructive border style when not focused', () => {
      const wrapper = getWrapper({ error: true })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-destructive').exists()).toBe(true)
    })
  })

  describe('when success prop is true', () => {
    it('should apply --has-state class', () => {
      const wrapper = getWrapper({ success: true })
      expect(wrapper.find('.m-input.--has-state').exists()).toBe(true)
    })

    it('should apply success border style when not focused', () => {
      const wrapper = getWrapper({ success: true })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-success').exists()).toBe(true)
    })
  })

  describe('when warning prop is true', () => {
    it('should apply --has-state class', () => {
      const wrapper = getWrapper({ warning: true })
      expect(wrapper.find('.m-input.--has-state').exists()).toBe(true)
    })

    it('should apply warning border style when not focused', () => {
      const wrapper = getWrapper({ warning: true })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-warning').exists()).toBe(true)
    })
  })

  describe('when label prop is provided', () => {
    it('should render the label', () => {
      const wrapper = getWrapper({ label: 'Email Address' })
      expect(wrapper.find('.m-input-label').exists()).toBe(true)
      expect(wrapper.find('.m-input-label').text()).toBe('Email Address')
    })

    it('should apply --has-label class', () => {
      const wrapper = getWrapper({ label: 'Email' })
      expect(wrapper.find('.m-input.--has-label').exists()).toBe(true)
    })

    it('should render the label element when label prop is provided', () => {
      const wrapper = getWrapper({ label: 'Email', modelValue: 'test@test.com' })
      expect(wrapper.find('.m-input-label').exists()).toBe(true)
    })
  })

  describe('when hint prop is provided', () => {
    it('should display hint text instead of label', () => {
      const wrapper = getWrapper({ label: 'Email', hint: 'Optional field' })
      expect(wrapper.find('.m-input-label').text()).toBe('Optional field')
    })

    it('should apply --has-label class when hint is provided', () => {
      const wrapper = getWrapper({ hint: 'Optional' })
      expect(wrapper.find('.m-input.--has-label').exists()).toBe(true)
    })
  })

  describe('when topLabel prop is provided', () => {
    it('should render a top label element', () => {
      const wrapper = getWrapper({ topLabel: 'User Information' })
      expect(wrapper.find('.m-input-top-label').exists()).toBe(true)
      expect(wrapper.find('.m-input-top-label').text()).toBe('User Information')
    })

    it('should apply --top-label class to input wrapper', () => {
      const wrapper = getWrapper({ topLabel: 'Info' })
      expect(wrapper.find('.m-input-wrapper-input.--top-label').exists()).toBe(true)
    })
  })

  describe('when assistiveText prop is provided', () => {
    it('should render assistive text below input', () => {
      const wrapper = getWrapper({ assistiveText: 'Must be at least 8 characters' })
      expect(wrapper.find('.m-input-bottom-text').exists()).toBe(true)
      expect(wrapper.find('.m-input-bottom-text').text()).toBe('Must be at least 8 characters')
    })

    it('should apply destructive color to assistive text when error', () => {
      const wrapper = getWrapper({ assistiveText: 'Invalid', error: true })
      expect(wrapper.find('.m-input-bottom-text').classes()).toContain('maz:text-destructive-600')
    })

    it('should apply success color to assistive text when success', () => {
      const wrapper = getWrapper({ assistiveText: 'Valid', success: true })
      expect(wrapper.find('.m-input-bottom-text').classes()).toContain('maz:text-success-600')
    })

    it('should apply warning color to assistive text when warning', () => {
      const wrapper = getWrapper({ assistiveText: 'Caution', warning: true })
      expect(wrapper.find('.m-input-bottom-text').classes()).toContain('maz:text-warning-600')
    })

    it('should apply muted color when no state', () => {
      const wrapper = getWrapper({ assistiveText: 'Help text' })
      expect(wrapper.find('.m-input-bottom-text').classes()).toContain('maz:text-muted')
    })
  })

  describe('when placeholder prop is provided', () => {
    it('should set placeholder on input', () => {
      const wrapper = getWrapper({ placeholder: 'Enter text...' })
      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...')
    })

    it('should apply --has-placeholder class when placeholder is set', () => {
      const wrapper = getWrapper({ label: 'Name', placeholder: 'Enter name' })
      expect(wrapper.find('.m-input.--has-placeholder').exists()).toBe(true)
    })
  })

  describe('when startIcon prop is provided', () => {
    it('should render the start part with string icon', async () => {
      const wrapper = getWrapper({ startIcon: 'search' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-start').exists()).toBe(true)
    })

    it('should apply --has-start-icon class', async () => {
      const wrapper = getWrapper({ startIcon: 'user' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-input.--has-start-icon').exists()).toBe(true)
    })
  })

  describe('when endIcon prop is provided', () => {
    it('should render the end part with string icon', async () => {
      const wrapper = getWrapper({ endIcon: 'check' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(true)
    })

    it('should apply --has-end-icon class', async () => {
      const wrapper = getWrapper({ endIcon: 'check' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-input.--has-end-icon').exists()).toBe(true)
    })
  })

  describe('when color is configured', () => {
    it.each([
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'destructive',
      'contrast',
    ] as const)('should apply --%s class', (color) => {
      const wrapper = getWrapper({ color })
      expect(wrapper.find('.m-input').classes()).toContain(`--${color}`)
    })

    it('should apply the color class on the root when color prop is set', () => {
      const wrapper = getWrapper({ color: 'info' })
      expect(wrapper.find('.m-input.--info').exists()).toBe(true)
    })
  })

  describe('when size is configured', () => {
    it.each([
      'xl',
      'lg',
      'md',
      'sm',
      'xs',
      'mini',
    ] as const)('should apply --%s class to input wrapper', (size) => {
      const wrapper = getWrapper({ size })
      expect(wrapper.find(`.m-input-wrapper-input.--${size}`).exists()).toBe(true)
    })
  })

  describe('when border is false', () => {
    it('should not apply --border class', () => {
      const wrapper = getWrapper({ border: false })
      expect(wrapper.find('.m-input-wrapper.--border').exists()).toBe(false)
    })

    it('should not apply any border style class', () => {
      const wrapper = getWrapper({ border: false })
      expect(wrapper.find('.m-input-wrapper.--default-border').exists()).toBe(false)
    })
  })

  describe('when borderActive is true', () => {
    it('should apply --border-active class on the root', () => {
      const wrapper = getWrapper({ borderActive: true })
      expect(wrapper.find('.m-input.--border-active').exists()).toBe(true)
    })
  })

  describe('when roundedSize is configured', () => {
    it.each([
      'none',
      'sm',
      'md',
      'lg',
      'xl',
      'full',
    ] as const)('should apply --rounded-%s class', (roundedSize) => {
      const wrapper = getWrapper({ roundedSize })
      expect(wrapper.find(`.m-input-wrapper.--rounded-${roundedSize}`).exists()).toBe(true)
    })
  })

  describe('when block prop is true', () => {
    it('should apply --block class to root', () => {
      const wrapper = getWrapper({ block: true })
      expect(wrapper.find('.m-input.--block').exists()).toBe(true)
    })

    it('should apply --block class to wrapper', () => {
      const wrapper = getWrapper({ block: true })
      expect(wrapper.find('.m-input-wrapper.--block').exists()).toBe(true)
    })
  })

  describe('when required prop is true', () => {
    it('should set required attribute on input', () => {
      const wrapper = getWrapper({ required: true })
      expect(wrapper.find('input').attributes('required')).toBeDefined()
    })
  })

  describe('when name prop is provided', () => {
    it('should set name attribute on input', () => {
      const wrapper = getWrapper({ name: 'email-field' })
      expect(wrapper.find('input').attributes('name')).toBe('email-field')
    })
  })

  describe('when autocomplete prop is provided', () => {
    it('should set autocomplete attribute on input', () => {
      const wrapper = getWrapper({ autocomplete: 'email' })
      expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    })
  })

  describe('when loading prop is true', () => {
    it('should show the loading spinner', async () => {
      const wrapper = getWrapper({ loading: true })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(true)
    })
  })

  describe('focus and blur events', () => {
    it('should emit focus event on input focus', async () => {
      const wrapper = getWrapper()
      const input = wrapper.find('input')
      await input.trigger('focus')
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit blur event on input blur', async () => {
      const wrapper = getWrapper()
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('blur')
      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('input and change events', () => {
    it('should emit input event on input', async () => {
      const wrapper = getWrapper()
      const input = wrapper.find('input')
      await input.trigger('input')
      expect(wrapper.emitted('input')).toBeTruthy()
    })

    it('should emit change event on change', async () => {
      const wrapper = getWrapper()
      const input = wrapper.find('input')
      await input.trigger('change')
      expect(wrapper.emitted('change')).toBeTruthy()
    })

    it('should emit click event on click', async () => {
      const wrapper = getWrapper()
      const input = wrapper.find('input')
      await input.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('value updates', () => {
    it('should emit update:model-value when value changes', async () => {
      const wrapper = getWrapper({ modelValue: '' })
      const input = wrapper.find('input')
      await input.setValue('new value')
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual(['new value'])
    })
  })

  describe('when debounce is configured', () => {
    it('should debounce value updates when debounce is true', async () => {
      vi.useFakeTimers()
      const wrapper = getWrapper({ debounce: true, modelValue: '' })
      const input = wrapper.find('input')
      await input.setValue('debounced')
      // Value not emitted immediately
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      vi.advanceTimersByTime(600)
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      vi.useRealTimers()
    })

    it('should debounce with custom delay', async () => {
      vi.useFakeTimers()
      const wrapper = getWrapper({ debounce: 200, modelValue: '' })
      const input = wrapper.find('input')
      await input.setValue('fast')
      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      vi.advanceTimersByTime(250)
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      vi.useRealTimers()
    })
  })

  describe('when the label float state is driven by CSS', () => {
    it('should apply --has-placeholder when placeholder prop is set', () => {
      const wrapper = getWrapper({ label: 'Name', placeholder: 'Enter name' })
      expect(wrapper.find('.m-input.--has-placeholder').exists()).toBe(true)
    })

    it('should apply --always-up when type is date', () => {
      const wrapper = getWrapper({ label: 'Date', type: 'date' })
      expect(wrapper.find('.m-input.--always-up').exists()).toBe(true)
    })

    it('should apply --always-up when type is month', () => {
      const wrapper = getWrapper({ label: 'Month', type: 'month' })
      expect(wrapper.find('.m-input.--always-up').exists()).toBe(true)
    })

    it('should apply --always-up when type is week', () => {
      const wrapper = getWrapper({ label: 'Week', type: 'week' })
      expect(wrapper.find('.m-input.--always-up').exists()).toBe(true)
    })

    it('should not apply --always-up for text type', () => {
      const wrapper = getWrapper({ label: 'Name', type: 'text' })
      expect(wrapper.find('.m-input.--always-up').exists()).toBe(false)
    })

    it('should fall back to a whitespace placeholder when none is provided', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('input').attributes('placeholder')).toBe(' ')
    })
  })

  describe('when start-icon slot is provided', () => {
    it('should render custom start icon content', () => {
      const wrapper = getWrapper({}, { 'start-icon': '<span class="custom-start">L</span>' })
      expect(wrapper.find('.custom-start').exists()).toBe(true)
      expect(wrapper.find('.m-input-wrapper-start').exists()).toBe(true)
    })
  })

  describe('when end-icon slot is provided', () => {
    it('should render custom end icon content', () => {
      const wrapper = getWrapper({}, { 'end-icon': '<span class="custom-end">R</span>' })
      expect(wrapper.find('.custom-end').exists()).toBe(true)
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(true)
    })
  })

  describe('when id is provided', () => {
    it('should use provided id for input', () => {
      const wrapper = getWrapper({ id: 'my-custom-input' })
      expect(wrapper.find('input').attributes('id')).toBe('my-custom-input')
    })
  })

  describe('when combining states', () => {
    it('should handle error with label and assistiveText', () => {
      const wrapper = getWrapper({
        error: true,
        label: 'Email',
        assistiveText: 'Invalid email format',
        modelValue: 'bad@',
      })
      expect(wrapper.find('.m-input.--has-state').exists()).toBe(true)
      expect(wrapper.find('.m-input-bottom-text').text()).toBe('Invalid email format')
      expect(wrapper.find('.m-input-bottom-text').classes()).toContain('maz:text-destructive-600')
    })

    it('should handle success with topLabel and block', () => {
      const wrapper = getWrapper({
        success: true,
        topLabel: 'User Info',
        block: true,
        modelValue: 'valid',
      })
      expect(wrapper.find('.m-input.--has-state.--block').exists()).toBe(true)
      expect(wrapper.find('.m-input-top-label').text()).toBe('User Info')
    })

    it('should handle password with endIcon', async () => {
      const wrapper = getWrapper({ type: 'password', endIcon: 'lock' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(true)
    })

    it('should handle disabled with error state', () => {
      const wrapper = getWrapper({ disabled: true, error: true })
      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.m-input.--has-state').exists()).toBe(true)
    })
  })

  describe('when shallowMounted', () => {
    it('should render with shallowMount', () => {
      const wrapper = shallowMount(MazInput)
      expect(wrapper.exists()).toBe(true)
    })

    it('should render with shallowMount and props', () => {
      const wrapper = shallowMount(MazInput, {
        props: { modelValue: 'test', label: 'Label', type: 'email' },
      })
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.modelValue).toBe('test')
    })
  })

  describe('aria attributes', () => {
    it('should set aria-label from label prop', () => {
      const wrapper = getWrapper({ label: 'Search' })
      expect(wrapper.find('input').attributes('aria-label')).toBe('Search')
    })

    it('should set aria-label from placeholder when no label', () => {
      const wrapper = getWrapper({ placeholder: 'Type here' })
      expect(wrapper.find('input').attributes('aria-label')).toBe('Type here')
    })
  })

  describe('when inputClasses is provided', () => {
    it('should apply custom classes to input wrapper', () => {
      const wrapper = getWrapper({ inputClasses: 'custom-class' })
      expect(wrapper.find('.m-input-wrapper.custom-class').exists()).toBe(true)
    })
  })

  describe('border style when error', () => {
    it('should apply the destructive state border', () => {
      const wrapper = getWrapper({ error: true, color: 'primary' })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-destructive').exists()).toBe(true)
    })
  })

  describe('border style when success', () => {
    it('should apply the success state border', () => {
      const wrapper = getWrapper({ success: true, color: 'info' })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-success').exists()).toBe(true)
    })
  })

  describe('border style when warning', () => {
    it('should apply the warning state border', () => {
      const wrapper = getWrapper({ warning: true, color: 'secondary' })
      expect(wrapper.find('.m-input-wrapper.maz\\:border-warning').exists()).toBe(true)
    })
  })

  describe('default border style', () => {
    it('should apply --default-border when no state and not focused', () => {
      const wrapper = getWrapper()
      expect(wrapper.find('.m-input-wrapper.--default-border').exists()).toBe(true)
    })
  })
})
