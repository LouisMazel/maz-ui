import MazInput from '@components/MazInput.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazInput.vue', () => {
  expect(MazInput).toBeTruthy()

  const wrapper = shallowMount(MazInput, {
    props: {
      modelValue: 'test value',
    },
  })

  it('should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe('test value')
  })

  it('should have an uniq id', () => {
    // @ts-expect-error - test case
    expect(wrapper.vm.instanceId).toBe('MazInput-v-0')
  })

  it('should emit an input event with the new value when the input value changes', () => {
    const input = wrapper.find('input')
    input.setValue('new value')
    expect(wrapper.emitted()['update:model-value'][0]).toEqual(['new value'])
  })

  it('should apply the --has-label class when the label prop is passed', async () => {
    await wrapper.setProps({ label: 'Some label' })
    expect(wrapper.classes()).toContain('--has-label')
  })

  it('should apply the --is-focused class when the input is focused', async () => {
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.classes()).toContain('--is-focused')
  })

  it('should apply the --is-readonly class when the readonly prop is passed', async () => {
    await wrapper.setProps({ readonly: true })
    expect(wrapper.classes()).toContain('--is-readonly')
  })

  it('should apply the --has-state class and the appropriate color class when the error, warning or success prop is passed', async () => {
    await wrapper.setProps({ error: true })
    expect(wrapper.classes()).toContain('--has-state')

    await wrapper.setProps({ error: false, warning: true })
    expect(wrapper.classes()).toContain('--has-state')

    await wrapper.setProps({ warning: false, success: true })
    expect(wrapper.classes()).toContain('--has-state')
  })
})
