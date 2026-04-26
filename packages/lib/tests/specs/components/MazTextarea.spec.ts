import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazTextarea from '@components/MazTextarea.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazTextarea.vue', () => {
  expect(MazTextarea).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> = shallowMount(
    MazTextarea,
    {
      props: {
        modelValue: 'Un text',
      },
    },
  )

  it('should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe('Un text')
  })

  it('should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazTextarea-v-0')
  })

  it('should fall back to a whitespace placeholder when no placeholder prop is provided', () => {
    expect(wrapper.find('textarea').attributes('placeholder')).toBe(' ')
  })

  it('should apply --has-placeholder class when a placeholder prop is provided', async () => {
    await wrapper.setProps({ placeholder: 'Type here' })
    expect(wrapper.find('.m-textarea').classes()).toContain('--has-placeholder')
    await wrapper.setProps({ placeholder: undefined })
  })

  it('should emit focus event', () => {
    wrapper.vm.focus()
    expect(wrapper.emitted().focus).toBeTruthy()
  })

  it('should emit blur event', () => {
    wrapper.vm.blur()
    expect(wrapper.emitted().blur).toBeTruthy()
  })

  it('should emit change event', () => {
    wrapper.vm.change()
    expect(wrapper.emitted().change).toBeTruthy()
  })

  it('should have border color according with the state prop', async () => {
    await wrapper.setProps({
      error: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz:border-destructive')
    await wrapper.setProps({
      error: false,
      warning: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz:border-warning')
    await wrapper.setProps({
      error: false,
      warning: false,
      success: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz:border-success')
    await wrapper.setProps({
      error: false,
      warning: false,
      success: false,
    })
    expect(wrapper.vm.borderStyle).toContain('--default-border')
  })

  it('should apply the color class on the root for :focus-within styling', async () => {
    await wrapper.setProps({ color: 'secondary' })
    expect(wrapper.find('.m-textarea').classes()).toContain('--secondary')
    await wrapper.setProps({ color: 'primary' })
  })

  it('should use native field-sizing for autogrow instead of JS', () => {
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
  })

  describe('autogrow prop', () => {
    it('should have --autogrow class by default', () => {
      const defaultWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text' },
      })
      expect(defaultWrapper.find('.m-textarea').classes()).toContain('--autogrow')
    })

    it('should not have --autogrow class when autogrow is false', () => {
      const noAutogrowWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', autogrow: false },
      })
      expect(noAutogrowWrapper.find('.m-textarea').classes()).not.toContain('--autogrow')
    })

    it('should add --autogrow class when toggled to true', async () => {
      const toggleWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', autogrow: false },
      })
      expect(toggleWrapper.find('.m-textarea').classes()).not.toContain('--autogrow')

      await toggleWrapper.setProps({ autogrow: true })
      expect(toggleWrapper.find('.m-textarea').classes()).toContain('--autogrow')
    })
  })

  describe('Given an append slot is provided', () => {
    describe('When the component renders', () => {
      it('Then it displays the append content below the textarea', () => {
        const appendWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '' },
          slots: { append: '<button class="custom-append">Send</button>' },
        })

        expect(appendWrapper.find('.m-textarea__append .custom-append').exists()).toBe(true)
      })
    })
  })

  describe('Given the disabled prop is enabled', () => {
    describe('When the component renders', () => {
      it('Then it applies the --is-disabled class', () => {
        const disabledWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '', disabled: true },
        })

        expect(disabledWrapper.find('.m-textarea').classes()).toContain('--is-disabled')
      })
    })
  })

  describe('Given the transparent prop is enabled', () => {
    describe('When the component renders', () => {
      it('Then it applies the --background-transparent class', () => {
        const transparentWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '', transparent: true },
        })

        expect(transparentWrapper.find('.m-textarea').classes()).toContain('--background-transparent')
      })
    })
  })

  describe('Given the user types inside the textarea', () => {
    describe('When the textarea value changes', () => {
      it('Then it emits update:model-value and input with the new value', async () => {
        const typingWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '' },
        })

        await typingWrapper.find('textarea').setValue('hello world')

        expect(typingWrapper.emitted('update:model-value')?.[0]).toEqual(['hello world'])
        expect(typingWrapper.emitted('input')?.[0]).toEqual(['hello world'])
      })
    })
  })

  describe('Given the required prop is enabled', () => {
    describe('When the component renders', () => {
      it('Then it displays a required asterisk marker', () => {
        const requiredWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '', label: 'Message', required: true },
        })

        expect(requiredWrapper.find('sup').exists()).toBe(true)
      })
    })
  })

  describe('Given the hint prop is provided', () => {
    describe('When the component renders', () => {
      it('Then the hint text replaces the label', () => {
        const hintWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '', hint: 'Helpful hint' },
        })

        expect(hintWrapper.find('.m-textarea__label span').text()).toBe('Helpful hint')
      })
    })
  })

  describe('Given a browser autofill occurs on the textarea', () => {
    describe('When the autofill value differs from the current modelValue', () => {
      it('Then it emits update:model-value with the autofilled value', async () => {
        const autofillWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '' },
        })

        const textarea = autofillWrapper.find('textarea').element
        textarea.value = '10 Downing Street'
        textarea.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: 'maz-autofill-start' }),
        )
        await autofillWrapper.vm.$nextTick()

        expect(autofillWrapper.emitted('update:model-value')?.[0]).toEqual(['10 Downing Street'])
      })
    })

    describe('When the autofill value matches the current modelValue', () => {
      it('Then it does not emit update:model-value', async () => {
        const autofillWrapper = shallowMount(MazTextarea, {
          props: { modelValue: 'same' },
        })

        const textarea = autofillWrapper.find('textarea').element
        textarea.value = 'same'
        textarea.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: 'maz-autofill-start' }),
        )
        await autofillWrapper.vm.$nextTick()

        expect(autofillWrapper.emitted('update:model-value')).toBeUndefined()
      })
    })
  })

  describe('Given the textarea has a registered autofill listener', () => {
    describe('When the component is unmounted', () => {
      it('Then subsequent autofill animations do not emit update:model-value', () => {
        const unmountWrapper = shallowMount(MazTextarea, {
          props: { modelValue: '' },
        })
        const textarea = unmountWrapper.find('textarea').element
        unmountWrapper.unmount()

        textarea.value = 'late-autofill'
        textarea.dispatchEvent(
          Object.assign(new Event('animationstart'), { animationName: 'maz-autofill-start' }),
        )

        expect(unmountWrapper.emitted('update:model-value')).toBeUndefined()
      })
    })
  })

  describe('topLabel prop', () => {
    it('should not render top label by default', () => {
      const defaultWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text' },
      })
      expect(defaultWrapper.find('.m-textarea__top-label').exists()).toBe(false)
    })

    it('should render top label when provided', () => {
      const topLabelWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message' },
      })
      const topLabel = topLabelWrapper.find('.m-textarea__top-label')
      expect(topLabel.exists()).toBe(true)
      expect(topLabel.text()).toBe('Your message')
    })

    it('should have the for attribute matching textarea id', () => {
      const topLabelWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', id: 'my-textarea' },
      })
      const topLabel = topLabelWrapper.find('.m-textarea__top-label')
      expect(topLabel.attributes('for')).toBe('my-textarea')
    })

    it('should apply error color class to top label', () => {
      const errorWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', error: true },
      })
      const topLabel = errorWrapper.find('.m-textarea__top-label')
      expect(topLabel.classes()).toContain('maz:text-destructive-600')
    })

    it('should apply success color class to top label', () => {
      const successWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', success: true },
      })
      const topLabel = successWrapper.find('.m-textarea__top-label')
      expect(topLabel.classes()).toContain('maz:text-success-600')
    })

    it('should apply warning color class to top label', () => {
      const warningWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', warning: true },
      })
      const topLabel = warningWrapper.find('.m-textarea__top-label')
      expect(topLabel.classes()).toContain('maz:text-warning-600')
    })
  })
})
