import MazChecklist from '@components/MazChecklist.vue'
import MazInput from '@components/MazInput.vue'
import { mount } from '@vue/test-utils'

describe('given MazChecklist component', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when component is mounted', () => {
    it('then it should render the component', () => {
      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Item 1', value: '1' },
            { label: 'Item 2', value: '2' },
          ],
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('when items are provided', () => {
    it('then it should render the correct number of items', () => {
      wrapper = mount(MazChecklist, {
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
  })

  describe('when search is enabled and query is entered', () => {
    it('then it should filter items based on query', async () => {
      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Apple', value: '1' },
            { label: 'Banana', value: '2' },
            { label: 'Cherry', value: '3' },
          ],
          search: true,
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      await input.setValue('Banana')

      const items = wrapper.findAll('label.m-checklist-item')
      expect(items.length).toBe(1)
      expect(items[0].text()).toContain('Banana')
    })
  })

  describe('when search query changes', () => {
    it('then it should emit update:query event', async () => {
      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Apple', value: '1' },
            { label: 'Banana', value: '2' },
            { label: 'Cherry', value: '3' },
          ],
          search: true,
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      await input.setValue('Banana')
      expect(wrapper.emitted('update:query')).toBeTruthy()
      expect(wrapper.emitted('update:query')?.[0]).toEqual(['Banana'])
    })
  })

  describe('when item is checked', () => {
    it('then it should emit update:model-value event', async () => {
      wrapper = mount(MazChecklist, {
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
  })

  describe('when no items match the search query', () => {
    it('then it should display no results message', async () => {
      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Apple', value: '1' },
            { label: 'Banana', value: '2' },
          ],
          search: true,
          translations: {
            noResultsFound: 'No results found',
          },
        },
      })
      await vi.dynamicImportSettled()
      const input = wrapper.findComponent(MazInput)
      await input.setValue('Cherry')
      const noResults = wrapper.find('span.no-results-text')

      expect(noResults.exists()).toBe(true)
      expect(noResults.text()).toBe('No results found')
    })
  })

  describe('when custom search function is provided', () => {
    it('then it should use the custom search function', async () => {
      const searchFunction = (query: string, items: any[]) => {
        return items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
      }

      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Apple', value: '1' },
            { label: 'Banana', value: '2' },
            { label: 'Orange', value: '3' },
          ],
          search: true,
          searchFunction,
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      await input.setValue('ba')

      const items = wrapper.findAll('.m-checklist-item')
      expect(items).toHaveLength(1)
      expect(items[0].text()).toBe('Banana')
    })
  })

  describe('when search function returns undefined', () => {
    it('then it should return empty array', async () => {
      const searchFunction = () => undefined

      wrapper = mount(MazChecklist, {
        props: {
          items: [
            { label: 'Apple', value: '1' },
            { label: 'Banana', value: '2' },
          ],
          search: true,
          searchFunction,
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      await input.setValue('test')

      const items = wrapper.findAll('.m-checklist-item')
      expect(items).toHaveLength(0)
    })
  })
})
