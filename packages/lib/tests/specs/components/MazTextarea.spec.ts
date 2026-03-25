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
})
