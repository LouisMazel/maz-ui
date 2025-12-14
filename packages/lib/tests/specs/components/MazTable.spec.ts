import type { MazTableProps } from '@components/MazTable.vue'
import type { ComponentPublicInstance } from 'vue'
import MazCheckbox from '@components/MazCheckbox.vue'
import MazLoadingBar from '@components/MazLoadingBar.vue'
import MazTable from '@components/MazTable.vue'
import { mount } from '@vue/test-utils'

describe('given MazTable component', () => {
  it('should render the component', async () => {
    const props: MazTableProps<{
      id: number
      firstname: string
      lastname: string
      age: number
      city: string
    }> = {
      sortable: true,
      pagination: true,
      search: true,
      selectedKey: 'id',
      headers: [
        { label: 'Id', key: 'id' },
        { label: 'Firstname', key: 'firstname' },
        { label: 'Lastname', key: 'lastname' },
        { label: 'Age', key: 'age' },
        { label: 'City', key: 'city' },
      ],
      caption: 'This is a caption',
      rows: [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          age: 25,
          city: 'New York',
        },
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Doe',
          age: 22,
          city: 'Paris',
        },
        {
          id: 3,
          firstname: 'John',
          lastname: 'Smith',
          age: 32,
          city: 'London',
        },
        {
          id: 4,
          firstname: 'Jane',
          lastname: 'Smith',
          age: 28,
          city: 'Tokyo',
        },
      ],
    }

    const wrapper = mount(MazTable, {
      props: props as any,
    })

    await vi.dynamicImportSettled()

    let loadingBar = wrapper.findComponent(MazLoadingBar)

    expect(loadingBar.exists()).toBe(false)

    await wrapper.setProps({ loading: true })

    await vi.dynamicImportSettled()

    loadingBar = wrapper.findComponent(MazLoadingBar)
    expect(loadingBar.isVisible()).toBe(true)

    const checkbox = wrapper.findComponent(MazCheckbox)

    expect(checkbox.exists()).toBe(true)

    wrapper.vm.allSelected = true

    expect(wrapper.emitted('update:model-value')?.[0]).toStrictEqual([[1, 2, 3, 4]])

    await wrapper.findAll('thead tr th')[3].trigger('click')

    expect(wrapper.vm.rowsFiltered).toStrictEqual([
      {
        age: 32,
        city: 'London',
        firstname: 'John',
        id: 3,
        lastname: 'Smith',
        selected: true,
      },
      {
        age: 28,
        city: 'Tokyo',
        firstname: 'Jane',
        id: 4,
        lastname: 'Smith',
        selected: true,
      },
      {
        age: 25,
        city: 'New York',
        firstname: 'John',
        id: 1,
        lastname: 'Doe',
        selected: true,
      },
      {
        age: 22,
        city: 'Paris',
        firstname: 'Jane',
        id: 2,
        lastname: 'Doe',
        selected: true,
      },
    ])

    wrapper.vm.searchQueryModel = 'Tokyo'

    expect(wrapper.vm.rowsFiltered).toStrictEqual([
      {
        age: 28,
        city: 'Tokyo',
        firstname: 'Jane',
        id: 4,
        lastname: 'Smith',
        selected: true,
      },
    ])
  })

  it('should sort rows by column', async () => {
    const props: MazTableProps<{
      id: number
      firstname: string
      lastname: string
      age: number
      city: string
    }> = {
      sortable: true,
      headers: [
        { label: 'Id', key: 'id' },
        { label: 'Firstname', key: 'firstname' },
        { label: 'Lastname', key: 'lastname' },
        { label: 'Age', key: 'age' },
        { label: 'City', key: 'city' },
      ],
      rows: [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York' },
        { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris' },
        { id: 3, firstname: 'John', lastname: 'Smith', age: 32, city: 'London' },
        { id: 4, firstname: 'Jane', lastname: 'Smith', age: 28, city: 'Tokyo' },
      ],
    }

    const wrapper = mount(MazTable, {
      props: props as any,
    })

    await vi.dynamicImportSettled()

    await wrapper.findAll('thead tr th')[3].trigger('click')
    expect(wrapper.vm.rowsFiltered).toStrictEqual([
      {
        age: 32,
        city: 'London',
        firstname: 'John',
        id: 3,
        lastname: 'Smith',
        selected: undefined,
      },
      {
        age: 28,
        city: 'Tokyo',
        firstname: 'Jane',
        id: 4,
        lastname: 'Smith',
        selected: undefined,
      },
      {
        age: 25,
        city: 'New York',
        firstname: 'John',
        id: 1,
        lastname: 'Doe',
        selected: undefined,
      },
      {
        age: 22,
        city: 'Paris',
        firstname: 'Jane',
        id: 2,
        lastname: 'Doe',
        selected: undefined,
      },
    ])

    await wrapper.findAll('thead tr th')[3].trigger('click')

    expect(wrapper.vm.rowsFiltered).toStrictEqual([
      {
        age: 22,
        city: 'Paris',
        firstname: 'Jane',
        id: 2,
        lastname: 'Doe',
        selected: undefined,
      },
      {
        age: 25,
        city: 'New York',
        firstname: 'John',
        id: 1,
        lastname: 'Doe',
        selected: undefined,
      },
      {
        age: 28,
        city: 'Tokyo',
        firstname: 'Jane',
        id: 4,
        lastname: 'Smith',
        selected: undefined,
      },
      {
        age: 32,
        city: 'London',
        firstname: 'John',
        id: 3,
        lastname: 'Smith',
        selected: undefined,
      },
    ])
  })

  it('should filter rows by search query', async () => {
    const props: MazTableProps<{
      id: number
      firstname: string
      lastname: string
      age: number
      city: string
    }> = {
      search: true,
      headers: [
        { label: 'Id', key: 'id' },
        { label: 'Firstname', key: 'firstname' },
        { label: 'Lastname', key: 'lastname' },
        { label: 'Age', key: 'age' },
        { label: 'City', key: 'city' },
      ],
      rows: [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York' },
        { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris' },
        { id: 3, firstname: 'John', lastname: 'Smith', age: 32, city: 'London' },
        { id: 4, firstname: 'Jane', lastname: 'Smith', age: 28, city: 'Tokyo' },
      ],
    }

    const wrapper = mount(MazTable, {
      props: props as any,
    })

    await vi.dynamicImportSettled()

    wrapper.vm.searchQueryModel = 'Doe'

    expect(wrapper.vm.rowsFiltered).toStrictEqual([
      { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York', selected: undefined },
      { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris', selected: undefined },
    ])
  })

  it('should paginate rows', async () => {
    const props: MazTableProps<{
      id: number
      firstname: string
      lastname: string
      age: number
      city: string
    }> = {
      pagination: true,
      pageSize: 2,
      headers: [
        { label: 'Id', key: 'id' },
        { label: 'Firstname', key: 'firstname' },
        { label: 'Lastname', key: 'lastname' },
        { label: 'Age', key: 'age' },
        { label: 'City', key: 'city' },
      ],
      rows: [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York' },
        { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris' },
        { id: 3, firstname: 'John', lastname: 'Smith', age: 32, city: 'London' },
        { id: 4, firstname: 'Jane', lastname: 'Smith', age: 28, city: 'Tokyo' },
      ],
    }

    const wrapper = mount(MazTable, {
      props: props as any,
    })

    await vi.dynamicImportSettled()

    expect(wrapper.vm.rowsOfPage).toStrictEqual([
      { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York', selected: undefined },
      { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris', selected: undefined },
    ])

    wrapper.vm.currentPageModel = 2

    expect(wrapper.vm.rowsOfPage).toStrictEqual([
      { id: 3, firstname: 'John', lastname: 'Smith', age: 32, city: 'London', selected: undefined },
      { id: 4, firstname: 'Jane', lastname: 'Smith', age: 28, city: 'Tokyo', selected: undefined },
    ])
  })

  describe('when pagination is enabled and selectable is true', () => {
    describe('when selecting rows on different pages', () => {
      it('persists selections across page changes', async () => {
        const props: MazTableProps<{
          id: number
          firstname: string
        }> = {
          pagination: true,
          pageSize: 2,
          selectable: true,
          selectedKey: 'id',
          headers: [
            { label: 'Id', key: 'id' },
            { label: 'Firstname', key: 'firstname' },
          ],
          rows: [
            { id: 1, firstname: 'John' },
            { id: 2, firstname: 'Jane' },
            { id: 3, firstname: 'Alice' },
            { id: 4, firstname: 'Bob' },
          ],
        }

        const wrapper = mount(MazTable, {
          props: props as any,
        })

        await vi.dynamicImportSettled()

        const checkboxes = wrapper.findAllComponents<ComponentPublicInstance<typeof MazCheckbox>>(MazCheckbox)

        await checkboxes[1].vm.$emit('update:model-value', true)
        await checkboxes[2].vm.$emit('update:model-value', true)

        expect(wrapper.emitted('update:model-value')).toBeTruthy()
        const emittedValues = wrapper.emitted('update:model-value')
        expect(emittedValues?.[emittedValues.length - 1]).toStrictEqual([[1, 2]])

        wrapper.vm.currentPageModel = 2

        await vi.dynamicImportSettled()

        const checkboxesPage2 = wrapper.findAllComponents<ComponentPublicInstance<typeof MazCheckbox>>(MazCheckbox)

        await checkboxesPage2[1].vm.$emit('update:model-value', true)

        const emittedValuesAfterPageChange = wrapper.emitted('update:model-value')
        expect(emittedValuesAfterPageChange?.[emittedValuesAfterPageChange.length - 1]).toStrictEqual([[1, 2, 3]])

        wrapper.vm.currentPageModel = 1

        await vi.dynamicImportSettled()

        const emittedValuesBackToPage1 = wrapper.emitted('update:model-value')
        expect(emittedValuesBackToPage1?.[emittedValuesBackToPage1.length - 1]).toStrictEqual([[1, 2, 3]])
      })
    })
  })
})
