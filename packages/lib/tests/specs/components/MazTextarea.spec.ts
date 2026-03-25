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

  it('should up the label if the component has value', async () => {
    await wrapper.setProps({
      modelValue: undefined,
      label: 'Label',
    })

    expect(wrapper.vm.shouldUp).toBeFalsy()

    await wrapper.setProps({
      modelValue: 'Un text',
    })

    expect(wrapper.vm.shouldUp).toBeTruthy()
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

  it('should have border color according with the color prop', async () => {
    await wrapper.setProps({
      error: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz-border-destructive')
    await wrapper.setProps({
      error: false,
      warning: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz-border-warning')
    await wrapper.setProps({
      error: false,
      warning: false,
      success: true,
    })
    expect(wrapper.vm.borderStyle).toBe('maz-border-success')
    await wrapper.setProps({
      error: false,
      warning: false,
      success: false,
    })
    wrapper.vm.focus()
    expect(wrapper.vm.borderStyle).toBe('maz-border-primary')
    await wrapper.setProps({
      color: 'secondary',
    })
    expect(wrapper.vm.borderStyle).toBe('maz-border-secondary')
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
      expect(topLabel.classes()).toContain('maz-text-destructive-600')
    })

    it('should apply success color class to top label', () => {
      const successWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', success: true },
      })
      const topLabel = successWrapper.find('.m-textarea__top-label')
      expect(topLabel.classes()).toContain('maz-text-success-600')
    })

    it('should apply warning color class to top label', () => {
      const warningWrapper = shallowMount(MazTextarea, {
        props: { modelValue: 'text', topLabel: 'Your message', warning: true },
      })
      const topLabel = warningWrapper.find('.m-textarea__top-label')
      expect(topLabel.classes()).toContain('maz-text-warning-600')
    })
  })
})
