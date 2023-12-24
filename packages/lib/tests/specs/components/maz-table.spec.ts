import { mount } from '@vue/test-utils'
import MazTable from '@components/MazTable.vue'
import { MazCheckbox, MazLoadingBar } from '@components/index'

describe('MazTable', () => {
  test('should render the component', async () => {
    const wrapper = mount(MazTable, {
      props: {
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
      },
    })

    let loadingBar = wrapper.findComponent(MazLoadingBar)

    expect(loadingBar.exists()).toBe(false)

    await wrapper.setProps({ loading: true })

    loadingBar = wrapper.findComponent(MazLoadingBar)
    expect(loadingBar.isVisible()).toBe(true)

    const checkbox = wrapper.findComponent(MazCheckbox)

    expect(checkbox.exists()).toBe(true)

    wrapper.vm.allSelected = true

    expect(wrapper.emitted('update:model-value')[0]).toStrictEqual([[1, 2, 3, 4]])

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
})
