import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazTextarea from '@components/MazTextarea.vue'
import { TextareaAutogrow } from '@components/MazTextarea/textarea-autogrow'
import { elementEmitEvent } from '@tests/helpers/document-event'
import { shallowMount } from '@vue/test-utils'

describe('components/MazTextarea/textarea-autogrow.ts', () => {
  let textareaElement: HTMLTextAreaElement

  beforeEach(() => {
    textareaElement = document.createElement('textarea')
    // eslint-disable-next-line sonarjs/no-unused-vars
    const _textareaAutogrow = new TextareaAutogrow(textareaElement)
  })

  it('should add css style on init', () => {
    expect(textareaElement.style.resize).toBe('none')
    expect(textareaElement.style.boxSizing).toBe('border-box')
  })

  it('should add css style on focus event', () => {
    elementEmitEvent(textareaElement, 'focus')

    expect(textareaElement.style.height).toBe('0px')
    expect(textareaElement.style.overflow).toBe('hidden')
  })

  it('should add css style on resize event', () => {
    elementEmitEvent(textareaElement, 'focus')
    elementEmitEvent(window, 'resize')

    expect(textareaElement.style.height).toBe('0px')
    expect(textareaElement.style.overflow).toBe('hidden')
  })
})

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
    expect(wrapper.vm.borderStyle).toBe('maz-border-danger')
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
})
