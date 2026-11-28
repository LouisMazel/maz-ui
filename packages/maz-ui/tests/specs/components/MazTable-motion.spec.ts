import MazTable from '@components/MazTable.vue'
import { flushPromises, mount } from '@vue/test-utils'

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
]
const rows = [
  { name: 'Bob', age: 30 },
  { name: 'Alice', age: 25 },
]

async function mountTable(props: Record<string, unknown>) {
  const wrapper = mount(MazTable, { props: { headers, rows, ...props } as never })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

describe('given MazTable motion', () => {
  describe('when a column is sorted', () => {
    it('then the header and the cells of the column get the band class', async () => {
      const wrapper = await mountTable({ sortable: true })

      expect(wrapper.find('.--sorted-column').exists()).toBe(false)

      await wrapper.findAll('thead th')[1]!.trigger('click')

      expect(wrapper.findAll('thead th')[1]!.classes()).toContain('--sorted-column')
      expect(wrapper.findAll('thead th')[0]!.classes()).not.toContain('--sorted-column')

      const cells = wrapper.findAll('tbody tr').map(row => row.findAll('td')[1]!)

      expect(cells.every(cell => cell.classes().includes('--sorted-column'))).toBe(true)
    })

    it('then the band moves to the next sorted column', async () => {
      const wrapper = await mountTable({ sortable: true })

      await wrapper.findAll('thead th')[0]!.trigger('click')
      await wrapper.findAll('thead th')[1]!.trigger('click')

      expect(wrapper.findAll('thead th')[0]!.classes()).not.toContain('--sorted-column')
      expect(wrapper.findAll('tbody tr')[0]!.findAll('td')[0]!.classes()).not.toContain('--sorted-column')
    })
  })

  describe('when the rows are hoverable', () => {
    it('then the hover uses the foreground token, without a dark override', async () => {
      const wrapper = await mountTable({ hoverable: true })
      const classes = wrapper.find('tbody tr').classes()

      expect(classes).toContain('maz:hover:bg-foreground/5')
      expect(classes.some(name => name.includes('dark:hover'))).toBe(false)
    })
  })

  describe('when the table is scrollable', () => {
    it('then the wrapper is flagged so the header sticks', async () => {
      const wrapper = await mountTable({ scrollable: true, maxHeight: '200px' })

      expect(wrapper.find('.m-table-wrapper').classes()).toContain('--scrollable')
    })
  })
})
