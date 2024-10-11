import { mount } from '@vue/test-utils'
import MazChecklist from '../../../components/MazChecklist.vue'
import MazInput from '../../../components/MazInput.vue'

describe('mazChecklist', () => {
  it('renders the component', () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
        ],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the correct number of items', () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
          { label: 'Item 3', value: '3' },
        ],
      },
    })

    const items = wrapper.findAll('label.m-checklist-item')
    expect(items.length).toBe(3)
  })

  it('filters items based on query', async () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Apple', value: '1' },
          { label: 'Banana', value: '2' },
          { label: 'Cherry', value: '3' },
        ],
        search: { enabled: true },
      },
    })
    await vi.dynamicImportSettled()

    const input = wrapper.findComponent(MazInput)
    await input.setValue('Banana')

    const items = wrapper.findAll('label.m-checklist-item')
    expect(items.length).toBe(1)
    expect(items[0].text()).toContain('Banana')
  })

  it('emits update:query event when query changes', async () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Apple', value: '1' },
          { label: 'Banana', value: '2' },
          { label: 'Cherry', value: '3' },
        ],
        search: { enabled: true },
      },
    })
    await vi.dynamicImportSettled()

    const input = wrapper.findComponent(MazInput)
    await input.setValue('Banana')
    expect(wrapper.emitted('update:query')).toBeTruthy()
    expect(wrapper.emitted('update:query')?.[0]).toEqual(['Banana'])
  })

  it('emits update:model-value event when item is checked', async () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
        ],
        modelValue: [],
      },
    })
    await vi.dynamicImportSettled()
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue()
    expect(wrapper.emitted('update:model-value')).toBeTruthy()
    expect(wrapper.emitted('update:model-value')?.[0]).toEqual([['1']])
  })

  it('displays no results message when no items match the query', async () => {
    const wrapper = mount(MazChecklist, {
      props: {
        items: [
          { label: 'Apple', value: '1' },
          { label: 'Banana', value: '2' },
        ],
        search: { enabled: true },
      },
    })
    await vi.dynamicImportSettled()
    const input = wrapper.findComponent(MazInput)
    await input.setValue('Cherry')
    const noResults = wrapper.find('span.maz-text-muted')

    expect(noResults.exists()).toBe(true)
    expect(noResults.text()).toBe('No results found')
  })
})
