import type { MazTableProps } from '@components/MazTable.vue'
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
      props,
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

    // @ts-expect-error - allSelected is private
    wrapper.vm.allSelected = true

    expect(wrapper.emitted('update:model-value')?.[0]).toStrictEqual([[1, 2, 3, 4]])

    await wrapper.findAll('thead tr th')[3].trigger('click')

    // @ts-expect-error - rowsFiltered is private
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

    // @ts-expect-error - searchQueryModel is private
    wrapper.vm.searchQueryModel = 'Tokyo'

    // @ts-expect-error - rowsFiltered is private
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
      props,
    })

    await vi.dynamicImportSettled()

    await wrapper.findAll('thead tr th')[3].trigger('click')
    // @ts-expect-error - rowsFiltered is private
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

    // @ts-expect-error - rowsFiltered is private
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
      props,
    })

    await vi.dynamicImportSettled()

    // @ts-expect-error - searchQueryModel is private
    wrapper.vm.searchQueryModel = 'Doe'

    // @ts-expect-error - rowsFiltered is private
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
      props,
    })

    await vi.dynamicImportSettled()

    // @ts-expect-error - rowsOfPage is private
    expect(wrapper.vm.rowsOfPage).toStrictEqual([
      { id: 1, firstname: 'John', lastname: 'Doe', age: 25, city: 'New York', selected: undefined },
      { id: 2, firstname: 'Jane', lastname: 'Doe', age: 22, city: 'Paris', selected: undefined },
    ])

    // @ts-expect-error - currentPageModel is private
    wrapper.vm.currentPageModel = 2

    // @ts-expect-error - rowsOfPage is private
    expect(wrapper.vm.rowsOfPage).toStrictEqual([
      { id: 3, firstname: 'John', lastname: 'Smith', age: 32, city: 'London', selected: undefined },
      { id: 4, firstname: 'Jane', lastname: 'Smith', age: 28, city: 'Tokyo', selected: undefined },
    ])
  })
})
