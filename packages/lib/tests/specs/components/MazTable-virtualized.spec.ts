import type { MazTableProps } from '@components/MazTable.vue'
import MazTable from '@components/MazTable.vue'
import { flushPromises, mount } from '@vue/test-utils'

const { virtualState } = vi.hoisted(() => ({
  virtualState: { items: [] as { index: number, start: number, end: number, size: number, key: number }[], total: 0 },
}))

vi.mock('@tanstack/vue-virtual', async () => {
  const { ref } = await import('vue')
  return {
    useVirtualizer: (options: { value?: { getScrollElement: () => unknown, estimateSize: (index: number) => number } }) => {
      options?.value?.getScrollElement?.()
      options?.value?.estimateSize?.(0)
      return ref({
        getVirtualItems: () => virtualState.items,
        getTotalSize: () => virtualState.total,
        measureElement: () => {},
      })
    },
  }
})

const ROW_HEIGHT = 44

function buildRows(count: number) {
  return Array.from({ length: count }, (_, index) => ({ id: index, name: `User ${index}` }))
}

function setWindow(indexes: number[], count: number) {
  virtualState.items = indexes.map(index => ({
    index,
    start: index * ROW_HEIGHT,
    end: (index + 1) * ROW_HEIGHT,
    size: ROW_HEIGHT,
    key: index,
  }))
  virtualState.total = count * ROW_HEIGHT
}

const headers = [
  { label: 'Id', key: 'id' },
  { label: 'Name', key: 'name' },
]

async function mountTable(props: Partial<MazTableProps<{ id: number, name: string }>>, slots?: Record<string, string>) {
  const wrapper = mount(MazTable, {
    props: { headers, ...props } as any,
    ...(slots ? { slots } : {}),
  })
  await vi.dynamicImportSettled()
  await flushPromises()
  return wrapper
}

describe('given a virtualized MazTable', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    virtualState.items = []
    virtualState.total = 0
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  describe('when mounted with a windowed range', () => {
    it('then it renders only the windowed rows surrounded by spacer rows', async () => {
      setWindow([10, 11, 12], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px' })

      expect(wrapper.findAll('tbody tr.m-table-row')).toHaveLength(3)
      expect(wrapper.findAll('tbody tr.m-table-virtual-spacer')).toHaveLength(2)
      expect(wrapper.text()).toContain('User 10')
      expect(wrapper.text()).toContain('User 12')
      expect(wrapper.text()).not.toContain('User 50')
    })
  })

  describe('when mounted with a windowed range for accessibility', () => {
    it('then it exposes aria-rowcount and per-row aria-rowindex', async () => {
      setWindow([10, 11, 12], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px' })

      expect(wrapper.get('table').attributes('aria-rowcount')).toBe('100')
      const rows = wrapper.findAll('tbody tr.m-table-row')
      expect(rows[0].attributes('aria-rowindex')).toBe('11')
      expect(rows[2].attributes('aria-rowindex')).toBe('13')
    })
  })

  describe('when the virtual window is empty', () => {
    it('then it renders neither data rows nor spacers', async () => {
      setWindow([], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px' })

      expect(wrapper.findAll('tbody tr.m-table-row')).toHaveLength(0)
      expect(wrapper.findAll('tbody tr.m-table-virtual-spacer')).toHaveLength(0)
    })
  })

  describe('when the window starts at the first row', () => {
    it('then no top spacer is rendered', async () => {
      setWindow([0, 1, 2], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px' })

      expect(wrapper.findAll('tbody tr.m-table-virtual-spacer')).toHaveLength(1)
    })
  })

  describe('when selecting a row from the window', () => {
    it('then it emits the selection using the real row index', async () => {
      setWindow([10, 11, 12], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px', selectedKey: 'id' })

      const secondRow = wrapper.findAll('tbody tr.m-table-row')[1]
      await secondRow.findComponent({ name: 'MazCheckbox' }).vm.$emit('update:model-value', true)

      expect(wrapper.emitted('update:model-value')?.at(-1)).toStrictEqual([[11]])
    })
  })

  describe('when animatedRows is enabled alongside virtualized', () => {
    it('then it renders every row, no spacer, and warns', async () => {
      setWindow([0, 1, 2], 100)

      const wrapper = await mountTable({ rows: buildRows(100), virtualized: true, maxHeight: '400px', animatedRows: true })

      expect(wrapper.findAll('tbody tr.m-table-row')).toHaveLength(100)
      expect(wrapper.findAll('tbody tr.m-table-virtual-spacer')).toHaveLength(0)
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`animatedRows`'))
    })
  })

  describe('when a custom default slot is provided alongside virtualized', () => {
    it('then it renders the slot content, does not virtualize, and warns', async () => {
      setWindow([0, 1, 2], 100)

      const wrapper = await mountTable(
        { rows: buildRows(100), virtualized: true, maxHeight: '400px' },
        { default: '<tr class="custom-row"><td>custom content</td></tr>' },
      )

      expect(wrapper.find('tr.custom-row').exists()).toBe(true)
      expect(wrapper.findAll('tbody tr.m-table-virtual-spacer')).toHaveLength(0)
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('custom default slot'))
    })
  })

  describe('when virtualized without a maxHeight', () => {
    it('then it warns that maxHeight is required', async () => {
      setWindow([0, 1, 2], 100)

      await mountTable({ rows: buildRows(100), virtualized: true })

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`maxHeight`'))
    })
  })

  describe('when virtualized with header widths', () => {
    it('then it does not warn about table-layout', async () => {
      setWindow([0, 1, 2], 100)

      await mountTable({
        rows: buildRows(100),
        virtualized: true,
        maxHeight: '400px',
        headers: [
          { label: 'Id', key: 'id', width: '80px' },
          { label: 'Name', key: 'name' },
        ],
      })

      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('table-layout'))
    })
  })
})
