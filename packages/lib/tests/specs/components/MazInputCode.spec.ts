import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazInputCode from '@components/MazInputCode.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazInputCode', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof MazInputCode> & { [key: string]: any }>

  beforeEach(() => {
    wrapper = shallowMount(MazInputCode)
  })

  it('should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the correct number of input fields', async () => {
    expect(wrapper.findAll('input')).toHaveLength(4)

    await wrapper.setProps({ codeLength: 6 })
    expect(wrapper.findAll('input')).toHaveLength(6)
  })

  it('emits completed event when code is complete', async () => {
    const inputFields = wrapper.findAll('input')
    await inputFields[0].setValue('1')
    await inputFields[1].setValue('2')
    await inputFields[2].setValue('3')
    await inputFields[3].setValue('4')

    expect(wrapper.emitted('completed')).toHaveLength(1)
  })

  it('sets initial input values correctly', async () => {
    await wrapper.setProps({
      modelValue: '1234',
    })

    const inputFields = wrapper.findAll('input')
    expect(inputFields[0].element.value).toBe('1')
    expect(inputFields[1].element.value).toBe('2')
    expect(inputFields[2].element.value).toBe('3')
    expect(inputFields[3].element.value).toBe('4')
  })

  it('allows only numeric values when acceptAlpha prop is false', async () => {
    const inputFields = wrapper.findAll('input')

    await inputFields[0].setValue('a')
    await inputFields[1].setValue('1')
    await inputFields[2].setValue('f')
    await inputFields[3].setValue('2')

    expect(wrapper.emitted('update:model-value')).toHaveLength(4)
    expect(wrapper.emitted('update:model-value')).toStrictEqual([[''], ['1'], ['1'], ['12']])
  })

  it('allows alphanumeric values when acceptAlpha prop is true', async () => {
    await wrapper.setProps({
      acceptAlpha: true,
    })

    const inputFields = wrapper.findAll('input')
    await inputFields[0].setValue('a')
    await inputFields[1].setValue('1')
    await inputFields[2].setValue('b')
    await inputFields[3].setValue('2')

    expect(inputFields[0].element.value).toBe('a')
    expect(inputFields[1].element.value).toBe('1')
    expect(inputFields[2].element.value).toBe('b')
    expect(inputFields[3].element.value).toBe('2')

    expect(wrapper.emitted('update:model-value')).toHaveLength(4)
    expect(wrapper.emitted('update:model-value')).toStrictEqual([['a'], ['a1'], ['a1b'], ['a1b2']])
  })
})
