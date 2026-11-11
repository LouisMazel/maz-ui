import MazChecklist from '@components/MazChecklist.vue'
import MazInput from '@components/MazInput.vue'
import { flushPromises, mount } from '@vue/test-utils'

const items = [
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Guinea', value: 'GN' },
  { label: 'France', value: 'FR' },
]

async function mountChecklist(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazChecklist, {
    props: { items, search: true, ...props },
  })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

function getLabels(wrapper: Awaited<ReturnType<typeof mountChecklist>>) {
  return wrapper.findAll('label.m-checklist-item').map(item => item.text())
}

describe('given a MazChecklist with the search', () => {
  describe('when the query matches several items', () => {
    it('then the best match comes first', async () => {
      const wrapper = await mountChecklist()

      await wrapper.findComponent(MazInput).setValue('guinea')

      expect(getLabels(wrapper)).toEqual(['Guinea', 'Papua New Guinea'])
    })
  })

  describe('when the query has a typo', () => {
    it('then the item is found', async () => {
      const wrapper = await mountChecklist()

      await wrapper.findComponent(MazInput).setValue('Franse')

      expect(getLabels(wrapper)).toEqual(['France'])
    })
  })

  describe('when the typo tolerance is disabled with the threshold', () => {
    it('then a typo finds nothing', async () => {
      const wrapper = await mountChecklist({
        searchOptions: { threshold: 1 },
      })

      await wrapper.findComponent(MazInput).setValue('Franse')

      expect(getLabels(wrapper)).toEqual([])
    })
  })
})

describe('given a MazChecklist whose search engine is not loaded yet', () => {
  describe('when a query is typed', () => {
    it('then the items containing the query are found', async () => {
      const wrapper = mount(MazChecklist, {
        props: { items, search: true, query: 'guin' },
      })

      expect(getLabels(wrapper)).toEqual(['Papua New Guinea', 'Guinea'])

      await vi.dynamicImportSettled()
    })
  })
})
