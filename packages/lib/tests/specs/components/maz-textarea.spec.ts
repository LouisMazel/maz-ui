import { type VueWrapper, shallowMount } from '@vue/test-utils'
import MazTextarea from '@components/MazTextarea.vue'
import { TextareaAutogrow } from '@components/MazTextarea/textarea-autogrow'
import type { ComponentPublicInstance } from 'vue'
import { elementEmitEvent } from '@tests/helpers/document-event'

describe('components/MazTextarea/textarea-autogrow.ts', () => {
  let textareaElement: HTMLTextAreaElement

  beforeEach(() => {
    textareaElement = document.createElement('textarea')
    const _textareaAutogrow = new TextareaAutogrow(textareaElement)
  })

  test('Should add css style on init', () => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(textareaElement.style.resize).toBe('none')
    // @ts-ignore
    expect(textareaElement.style.boxSizing).toBe('border-box')
    /* eslint-enable @typescript-eslint/ban-ts-comment */
  })

  test('Should add css style on focus event', () => {
    elementEmitEvent(textareaElement, 'focus')

    expect(textareaElement.style.height).toBe('0px')
    expect(textareaElement.style.overflow).toBe('hidden')
  })

  test('Should add css style on resize event', () => {
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

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe('Un text')
  })

  test('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazTextarea-1')
  })

  test('Should up the label if the component is focused', async () => {
    await wrapper.setProps({
      modelValue: undefined,
      label: 'Label',
    })
    wrapper.vm.focus()
    expect(wrapper.vm.shouldUp).toBeTruthy()
  })

  test('Should emit focus event', () => {
    wrapper.vm.focus()
    expect(wrapper.emitted().focus).toBeTruthy()
  })

  test('Should emit blur event', () => {
    wrapper.vm.blur()
    expect(wrapper.emitted().blur).toBeTruthy()
  })

  test('Should emit change event', () => {
    wrapper.vm.change()
    expect(wrapper.emitted().change).toBeTruthy()
  })

  test('Should have border color according with the color prop', async () => {
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
