import MazTable from '@components/MazTable.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { mount } from '@vue/test-utils'

const rows = [{ name: 'Bob', age: 30 }, { name: 'Alice', age: 25 }]

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => key, locale: { value: 'en' } } as unknown as ReturnType<typeof useTranslations>)
})

function getHeaders(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('thead th')
}

describe('given a MazTable', () => {
  describe('when it is rendered', () => {
    it('then the column headers have a col scope by default and keep a provided scope', async () => {
      const wrapper = mount(MazTable, { props: { headers: [{ label: 'Name', key: 'name' }, { label: 'Age', key: 'age', scope: 'colgroup' }], rows } })
      await vi.dynamicImportSettled()

      expect(getHeaders(wrapper).map(header => header.attributes('scope'))).toEqual(['col', 'colgroup'])
    })

    it('then the not sortable headers are not focusable and have no sort state', async () => {
      const wrapper = mount(MazTable, { props: { headers: ['name'], rows } })
      await vi.dynamicImportSettled()

      expect(getHeaders(wrapper)[0].attributes('tabindex')).toBeUndefined()
      expect(getHeaders(wrapper)[0].attributes('aria-sort')).toBeUndefined()
    })
  })

  describe('when the columns are sortable', () => {
    it('then the headers are focusable and not sorted', async () => {
      const wrapper = mount(MazTable, { props: { sortable: true, headers: ['name', 'age'], rows } })
      await vi.dynamicImportSettled()

      expect(getHeaders(wrapper).map(header => header.attributes('tabindex'))).toEqual(['0', '0'])
      expect(getHeaders(wrapper).map(header => header.attributes('aria-sort'))).toEqual(['none', 'none'])
    })
  })

  describe('when a sortable header is clicked three times', () => {
    it('then its sort state goes descending, ascending then none', async () => {
      const wrapper = mount(MazTable, { props: { sortable: true, headers: ['name', 'age'], rows } })
      await vi.dynamicImportSettled()
      const header = getHeaders(wrapper)[0]
      const states: (string | undefined)[] = []

      for (let click = 0; click < 3; click++) {
        await header.trigger('click')
        states.push(header.attributes('aria-sort'))
      }

      expect(states).toEqual(['descending', 'ascending', 'none'])
      expect(getHeaders(wrapper)[1].attributes('aria-sort')).toBe('none')
    })
  })

  describe('when Enter then Space are pressed on a sortable header', () => {
    it('then the column is sorted like with clicks', async () => {
      const wrapper = mount(MazTable, { props: { sortable: true, headers: [{ label: 'Name', key: 'name' }, { label: 'Age', key: 'age' }], rows } })
      await vi.dynamicImportSettled()
      const header = getHeaders(wrapper)[0]

      await header.trigger('keydown', { key: 'Enter' })
      expect(header.attributes('aria-sort')).toBe('descending')
      expect(wrapper.findAll('tbody tr').map(row => row.text().replace(/\s/g, ''))).toEqual(['Bob30', 'Alice25'])

      await header.trigger('keydown', { key: ' ' })
      expect(header.attributes('aria-sort')).toBe('ascending')
      expect(wrapper.findAll('tbody tr').map(row => row.text().replace(/\s/g, ''))).toEqual(['Alice25', 'Bob30'])
    })
  })

  describe('when another key is pressed on a sortable header', () => {
    it('then the column is not sorted', async () => {
      const wrapper = mount(MazTable, { props: { sortable: true, headers: ['name'], rows } })
      await vi.dynamicImportSettled()

      await getHeaders(wrapper)[0].trigger('keydown', { key: 'a' })

      expect(getHeaders(wrapper)[0].attributes('aria-sort')).toBe('none')
    })
  })

  describe('when Enter is pressed in an element of a sortable header', () => {
    it('then the column is not sorted', async () => {
      const wrapper = mount(MazTable, {
        props: { sortable: true, headers: ['name'], rows },
        slots: { header: '<input class="header-input">' },
      })
      await vi.dynamicImportSettled()

      await wrapper.find('.header-input').trigger('keydown', { key: 'Enter' })

      expect(getHeaders(wrapper)[0].attributes('aria-sort')).toBe('none')
    })
  })

  describe('when the rows are selectable', () => {
    it('then the selection checkboxes have translated labels and their header has a col scope', async () => {
      const wrapper = mount(MazTable, { props: { selectable: true, headers: ['name'], rows } })
      await vi.dynamicImportSettled()

      expect(wrapper.find('thead input[type="checkbox"]').attributes('aria-label')).toBe('aria.selectAll')
      expect(wrapper.findAll('tbody input[type="checkbox"]').map(checkbox => checkbox.attributes('aria-label'))).toEqual(['aria.selectRow', 'aria.selectRow'])
      expect(wrapper.find('thead .m-table-select-column').attributes('scope')).toBe('col')
    })
  })
})
