import MazTable from '@components/MazTable.vue'
import { flushPromises, mount } from '@vue/test-utils'

const rows = [
  { name: 'Zoé Martin', city: 'Paris', age: 31 },
  { name: 'Ada Lovelace', city: 'London', age: 36 },
  { name: 'José García', city: 'Málaga', age: 28 },
  { name: 'Martin Dupont', city: 'Lyon', age: 45 },
]

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'City', key: 'city' },
  { label: 'Age', key: 'age' },
]

async function mountTable(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazTable, {
    props: {
      rows,
      headers,
      search: true,
      ...props,
    },
  })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

type Wrapper = Awaited<ReturnType<typeof mountTable>>

async function search(wrapper: Wrapper, query: string, searchBy?: string) {
  const vm = wrapper.vm as unknown as { searchQueryModel: string, searchByKey?: string }

  vm.searchByKey = searchBy
  vm.searchQueryModel = query
  await flushPromises()
}

function getNames(wrapper: Wrapper) {
  return (wrapper.vm as unknown as { rowsFiltered: { name: string }[] }).rowsFiltered.map(row => row.name)
}

describe('given a MazTable with the search', () => {
  describe('when the query matches several rows', () => {
    it('then the rows keep the order of the table', async () => {
      const wrapper = await mountTable()

      await search(wrapper, 'martin')

      expect(getNames(wrapper)).toEqual(['Zoé Martin', 'Martin Dupont'])
    })
  })

  describe('when the query has no accent', () => {
    it('then the rows with accents are found', async () => {
      const wrapper = await mountTable()

      await search(wrapper, 'malaga')

      expect(getNames(wrapper)).toEqual(['José García'])
    })
  })

  describe('when the query has a typo', () => {
    it('then the row is found', async () => {
      const wrapper = await mountTable()

      await search(wrapper, 'Londn')

      expect(getNames(wrapper)).toEqual(['Ada Lovelace'])
    })
  })

  describe('when the query is a number', () => {
    it('then the numeric cells are searched', async () => {
      const wrapper = await mountTable()

      await search(wrapper, '45')

      expect(getNames(wrapper)).toEqual(['Martin Dupont'])
    })
  })

  describe('when a column is chosen in search by', () => {
    it('then only this column is searched', async () => {
      const wrapper = await mountTable()

      await search(wrapper, 'lyon', 'name')

      expect(getNames(wrapper)).toEqual([])

      await search(wrapper, 'lyon', 'city')

      expect(getNames(wrapper)).toEqual(['Martin Dupont'])
    })
  })

  describe('when the query is empty', () => {
    it('then every row is displayed', async () => {
      const wrapper = await mountTable()

      await search(wrapper, '')

      expect(getNames(wrapper)).toHaveLength(4)
    })
  })

  describe('when the search in rows is hidden', () => {
    it('then the rows are not filtered', async () => {
      const wrapper = await mountTable({ hideSearchInRow: true })

      await search(wrapper, 'martin')

      expect(getNames(wrapper)).toHaveLength(4)
    })
  })
})

describe('given a MazTable whose search engine is not loaded yet', () => {
  describe('when a query is set', () => {
    it('then the rows containing the query are found', async () => {
      const wrapper = mount(MazTable, {
        props: {
          rows,
          headers,
          search: true,
          searchQuery: 'martin',
        },
      })

      expect(getNames(wrapper)).toEqual(['Zoé Martin', 'Martin Dupont'])

      await vi.dynamicImportSettled()
    })
  })
})
