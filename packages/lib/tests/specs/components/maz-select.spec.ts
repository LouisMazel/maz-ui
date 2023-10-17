import { type VueWrapper, mount } from '@vue/test-utils'
import MazSelect from '@components/MazSelect.vue'
import type { ComponentPublicInstance } from 'vue'

describe('components/MazSelect.vue', () => {
  expect(MazSelect).toBeTruthy()

  let wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }>

  const options = [
    { label: 'Test 1', value: 1 },
    { label: 'Test 2', value: 2 },
    { label: 'Test 3', value: 3 },
    { label: 'Test 4', value: 4 },
    { label: 'Test 5', value: 5 },
    { label: 'Test 6', value: 6 },
  ]

  beforeEach(() => {
    wrapper = mount(MazSelect, {
      props: {
        modelValue: 1,
        options,
      },
    })
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(1)
  })

  test('Should have an uniq id', () => {
    expect(wrapper.vm.instanceId).toBe('MazSelect-11')
  })

  test('Should find the options on search', async () => {
    wrapper.vm.searchQuery = '6'

    expect(wrapper.vm.optionsList).toStrictEqual([{ label: 'Test 6', value: 6 }])
  })

  test('Should find the options on search', async () => {
    wrapper.vm.searchQuery = undefined

    expect(wrapper.vm.optionsList).toStrictEqual(options)
  })

  test('Should show the option label on input for false value', async () => {
    await wrapper.setProps({
      modelValue: false,
      options: [{ label: 'Label', value: false }],
    })

    expect(wrapper.vm.mazInputValue).toBe('Label')
  })

  test('Should update modelValue and close list', async () => {
    await wrapper.vm.updateValue(options[2])
    // expect(wrapper.vm.mazInputValue).toBe('Test 1')
    // expect(wrapper.vm.modelValue).toBe(3)
    expect(wrapper.emitted()['update:model-value']).toStrictEqual([[3]])
  })

  test('Should open the list', async () => {
    const scrollIntoView = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(scrollIntoView).toHaveBeenCalled()
  })

  test('Should open the list on enter keydown', async () => {
    const input = wrapper.find('input')
    expect(input.exists()).toBeTruthy()
    // @ts-ignore
    input.wrapperElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }),
    )
    expect(wrapper.vm.hasListOpened).toBe(true)
  })

  test('opens and closes the options list when the input is focused or blurred', async () => {
    // The options list should be closed by default
    expect(wrapper.vm.hasListOpened).toBe(false)

    // Focusing the input should open the options list
    wrapper.find('input').trigger('focus')
    expect(wrapper.vm.hasListOpened).toBe(true)

    // Blurring the input should close the options list
    wrapper.find('.m-select').trigger('blur')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasListOpened).toBe(false)
  })

  test('updates the input value and emits a change event when an option is selected', async () => {
    wrapper.find('input').trigger('focus')

    expect(wrapper.vm.hasListOpened).toBe(true)

    await wrapper.vm.$nextTick()

    // Selecting the second option should update the input value and emit a change event with the option value
    wrapper.findAll('.m-select-list-item').at(0).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.mazInputValue).toBe('Test 1')
    expect(wrapper.emitted()['update:model-value'][0][0]).toBe(1)
  })
})
