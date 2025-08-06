import type { MazSelectProps } from '@components/MazSelect.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import MazSelect from '@components/MazSelect.vue'
import { mount } from '@vue/test-utils'

describe('components/MazSelect.vue', () => {
  expect(MazSelect).toBeTruthy()

  let wrapper: VueWrapper<ComponentPublicInstance<typeof MazSelect> & { [key: string]: any }>

  const options: MazSelectProps['options'] = [
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
        search: true,
        listPosition: 'bottom-start',
      },
      global: {
        stubs: {
          teleport: true, // Ceci désactive tous les teleports
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should have the model value', () => {
    expect(wrapper.vm.modelValue).toBe(1)
  })

  it('should have an uniq id', () => {
    const input = wrapper.findComponent({ name: 'MazInput' })
    expect(input.props('id')).toBe('MazSelect-v-0')
  })

  it('should find the options on search', () => {
    wrapper.vm.searchQuery = '6'

    expect(wrapper.vm.optionList).toStrictEqual([{ label: 'Test 6', value: 6 }])
  })

  it('should find the options on search undefined', () => {
    wrapper.vm.searchQuery = undefined

    expect(wrapper.vm.optionList).toStrictEqual(options)
  })

  it('should show the option label on input for false value', async () => {
    await wrapper.setProps({
      modelValue: '1',
      options: [{ label: 'Label', value: '1' }],
    })

    expect(wrapper.vm.inputValue).toBe('Label')
  })

  it('should update modelValue and close list', async () => {
    await wrapper.vm.updateValue(options[2])
    // expect(wrapper.vm.mazInputValue).toBe('Test 1')
    // expect(wrapper.vm.modelValue).toBe(3)
    expect(wrapper.emitted()['update:model-value']).toStrictEqual([[3]])
  })

  it('should open the list', async () => {
    const input = wrapper.find('input')
    await input.trigger('click')
    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('opens and closes the options list when the input is focused or blurred', async () => {
    // The options list should be closed by default
    expect(wrapper.vm.isOpen).toBe(false)

    await wrapper.find('input').trigger('click')
    expect(wrapper.vm.isOpen).toBe(true)

    await wrapper.find('input').trigger('click')
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('updates the input value and emits a change event when an option is selected', async () => {
    await wrapper.find('input').trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)

    await wrapper.vm.$nextTick()

    // Selecting the second option should update the input value and emit a change event with the option value
    const options = wrapper.findAll('.m-select-list-item')

    await options.at(0)?.trigger('click')

    expect(wrapper.vm.inputValue).toBe('Test 1')
    expect(wrapper.emitted('update:model-value')?.[0][0]).toBe(1)
  })

  it('i can group options', async () => {
    await wrapper.setProps({
      modelValue: undefined,
      options: [
        {
          label: 'Group 1',
          options: [
            { label: 'Test 1', value: 1 },
            { label: 'Test 2', value: 2 },
          ],
        },
        {
          label: 'Group 2',
          options: [
            { label: 'Test 3', value: 3 },
            { label: 'Test 4', value: 4 },
          ],
        },
      ],
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.optionsNormalized).toStrictEqual([
      { label: 'Group 1', isOptGroup: true },
      { label: 'Test 1', value: 1 },
      { label: 'Test 2', value: 2 },
      { label: 'Group 2', isOptGroup: true },
      { label: 'Test 3', value: 3 },
      { label: 'Test 4', value: 4 },
    ])
  })

  it('i can select multiple values', async () => {
    await wrapper.setProps({
      modelValue: undefined,
      multiple: true,
    })

    await wrapper.find('input').trigger('click')

    expect(wrapper.vm.isOpen).toBe(true)

    await wrapper.vm.$nextTick()

    await wrapper.findAll('.m-select-list-item').at(3)?.trigger('click')
    expect(wrapper.emitted('update:model-value')?.[0][0]).toEqual([4])
    await wrapper.findAll('.m-select-list-item').at(4)?.trigger('click')
    expect(wrapper.emitted('update:model-value')?.[1][0]).toEqual([4, 5])
    await wrapper.findAll('.m-select-list-item').at(3)?.trigger('click')
    expect(wrapper.emitted('update:model-value')?.[2][0]).toEqual([5])
  })

  it('should use custom search function when provided', async () => {
    const searchFunction = (query: string, options: any[]) => {
      return options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
    }

    await wrapper.setProps({
      search: true,
      searchFunction,
      options: [
        { label: 'Apple', value: 1 },
        { label: 'Banana', value: 2 },
        { label: 'Orange', value: 3 },
      ],
    })

    await wrapper.find('input').trigger('click')
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('.m-select-list__search-input')
    await searchInput.findComponent({ name: 'MazInput' }).setValue('ba')

    expect(wrapper.vm.optionList).toHaveLength(1)
    expect(wrapper.vm.optionList[0].label).toBe('Banana')
  })

  it('should use default search when no search function provided', async () => {
    await wrapper.setProps({
      search: true,
      options: [
        { label: 'Apple', value: 1 },
        { label: 'Banana', value: 2 },
        { label: 'Orange', value: 3 },
      ],
    })

    await wrapper.find('input').trigger('click')
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('.m-select-list__search-input')
    await searchInput.findComponent({ name: 'MazInput' }).setValue('ba')

    expect(wrapper.vm.optionList).toHaveLength(1)
    expect(wrapper.vm.optionList[0].label).toBe('Banana')
  })

  it('should return empty array when search function returns undefined', async () => {
    const searchFunction = () => undefined

    await wrapper.setProps({
      search: true,
      searchFunction,
      options: [
        { label: 'Apple', value: 1 },
        { label: 'Banana', value: 2 },
      ],
    })

    await wrapper.find('input').trigger('click')
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('.m-select-list__search-input')
    await searchInput.findComponent({ name: 'MazInput' }).setValue('test')

    expect(wrapper.vm.optionList).toHaveLength(0)
  })
})
