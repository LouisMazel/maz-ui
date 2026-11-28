import MazTable from '@components/MazTable.vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

const rows = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
]

const headers = [{ label: 'Name', key: 'name' }]

async function mountTable(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazTable, {
    props: { headers, rows, rowKey: 'id', expandable: true, ...props },
    slots: { 'expanded-row': `<template #expanded-row="{ row }"><span class="detail">Detail {{ row.name }}</span></template>` },
  })
  await vi.dynamicImportSettled()
  return wrapper
}

describe('given MazTable expandable', () => {
  describe('when rendered', () => {
    it('then each row has a toggle with aria-expanded false and no detail rendered', async () => {
      const wrapper = await mountTable()
      const toggles = wrapper.findAll('.m-table-expand-button')

      expect(toggles).toHaveLength(2)
      expect(toggles[0]?.attributes('aria-expanded')).toBe('false')
      expect(wrapper.find('.m-table-expanded-row').exists()).toBe(false)
    })
  })

  describe('when a toggle is clicked', () => {
    it('then the detail is rendered under the row and aria-expanded is true', async () => {
      const wrapper = await mountTable()
      const toggle = wrapper.findAll('.m-table-expand-button')[0]

      await toggle?.trigger('click')

      const detail = wrapper.find('.m-table-expanded-row')
      expect(detail.find('.detail').text()).toBe('Detail John')
      expect(detail.attributes('style') ?? '').not.toContain('display: none')
      expect(toggle?.attributes('aria-expanded')).toBe('true')
      expect(toggle?.attributes('aria-controls')).toBe(detail.attributes('id'))
      expect(detail.find('td').attributes('colspan')).toBe('2')
      expect(wrapper.emitted('expand')?.[0]?.[0]).toMatchObject({ expanded: true })
      expect(wrapper.emitted('update:expanded')?.[0]?.[0]).toEqual([1])
    })

    it('then the detail is hidden but kept mounted when closed again', async () => {
      const wrapper = await mountTable()
      const toggle = wrapper.findAll('.m-table-expand-button')[0]

      await toggle?.trigger('click')
      await toggle?.trigger('click')

      const detail = wrapper.find('.m-table-expanded-row')
      expect(detail.exists()).toBe(true)
      expect(detail.attributes('style')).toContain('display: none')
      expect(toggle?.attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when a row action is defined', () => {
    it('then toggling does not trigger the row action', async () => {
      const action = vi.fn()
      const wrapper = await mountTable({ rows: [{ id: 1, name: 'John', action }] })

      await wrapper.find('.m-table-expand-button').trigger('click')

      expect(action).not.toHaveBeenCalled()
    })
  })

  describe('when the expanded model is provided', () => {
    it('then the matching rows are open at mount', async () => {
      const wrapper = await mountTable({ expanded: [2] })

      expect(wrapper.findAll('.m-table-expanded-row')).toHaveLength(1)
      expect(wrapper.findAll('.m-table-expand-button')[1]?.attributes('aria-expanded')).toBe('true')
    })
  })

  describe('when the table is selectable', () => {
    it('then the toggle column is added to the colspan of the detail', async () => {
      const wrapper = await mountTable({ selectable: true, expanded: [1] })

      expect(wrapper.find('.m-table-expanded-cell').attributes('colspan')).toBe('3')
    })
  })

  describe('when expandable is not set', () => {
    it('then no toggle is rendered', async () => {
      const wrapper = await mountTable({ expandable: false })

      expect(wrapper.find('.m-table-expand-button').exists()).toBe(false)
    })
  })

  describe('when the table is animated', () => {
    it('then expandable is ignored', async () => {
      const wrapper = await mountTable({ animatedRows: true })

      expect(wrapper.find('.m-table-expand-button').exists()).toBe(false)
    })
  })
})

describe('given MazTable expandable with striped rows', () => {
  describe('when background-odd is set and a detail is open', () => {
    it('then the detail takes the color of its row and the alternation is not shifted', async () => {
      const wrapper = await mountTable({
        backgroundOdd: true,
        rows: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }],
        expanded: [1, 2],
      })
      const striped = (element: { classes: () => string[] }) => element.classes().includes('maz:bg-surface-600/70')
      const rows = wrapper.findAll('tbody > tr')
      const states = rows.map(row => striped(row))

      expect(rows).toHaveLength(5)
      expect(states).toEqual([true, true, false, false, true])
      expect(rows.some(row => row.classes().includes('maz:odd:bg-surface-600/70'))).toBe(false)
    })
  })

  describe('when the table is not expandable', () => {
    it('then the striping keeps the DOM based classes', async () => {
      const wrapper = await mountTable({ expandable: false, backgroundOdd: true })

      expect(wrapper.find('tbody > tr').classes()).toContain('maz:odd:bg-surface-600/70')
    })
  })
})
