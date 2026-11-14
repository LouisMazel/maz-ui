import type { MazSelectProps } from '@components/MazSelect.vue'
import MazSelect from '@components/MazSelect.vue'
import { flushPromises, mount } from '@vue/test-utils'

type SelectOptions = MazSelectProps['options']

const countries: SelectOptions = [
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Guinea Bissau', value: 'GW' },
  { label: 'Guinea', value: 'GN' },
  { label: 'France', value: 'FR' },
]

async function mountSelect(props: Partial<MazSelectProps> = {}) {
  const wrapper = mount(MazSelect, {
    props: { options: countries, search: true, ...props },
    global: {
      stubs: { teleport: true },
    },
  })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

function getLabels(wrapper: Awaited<ReturnType<typeof mountSelect>>) {
  return (wrapper.vm as unknown as { optionList: { label: string }[] }).optionList.map(option => option.label)
}

async function search(wrapper: Awaited<ReturnType<typeof mountSelect>>, query: string) {
  ;(wrapper.vm as unknown as { searchQuery: string }).searchQuery = query
  await flushPromises()
}

describe('given a MazSelect with the search', () => {
  describe('when the query matches several options', () => {
    it('then the best match comes first', async () => {
      const wrapper = await mountSelect()

      await search(wrapper, 'guinea')

      expect(getLabels(wrapper)).toEqual(['Guinea', 'Guinea Bissau', 'Papua New Guinea'])
    })
  })

  describe('when the query has a typo', () => {
    it('then the option is found', async () => {
      const wrapper = await mountSelect()

      await search(wrapper, 'Franse')

      expect(getLabels(wrapper)).toEqual(['France'])
    })
  })

  describe('when the typo tolerance is disabled with searchThreshold', () => {
    it('then a typo finds nothing', async () => {
      const wrapper = await mountSelect({ searchThreshold: 1 })

      await search(wrapper, 'Franse')

      expect(getLabels(wrapper)).toEqual([])
    })
  })

  describe('when the query matches the value of an option', () => {
    it('then the option is found', async () => {
      const wrapper = await mountSelect()

      await search(wrapper, 'GW')

      expect(getLabels(wrapper)).toEqual(['Guinea Bissau'])
    })
  })

  describe('when the options have groups', () => {
    it('then the matched options keep the order of the list under their group', async () => {
      const wrapper = await mountSelect({
        options: [
          {
            label: 'Africa',
            options: [
              { label: 'Guinea Bissau', value: 'GW' },
              { label: 'Guinea', value: 'GN' },
            ],
          },
          {
            label: 'Europe',
            options: [
              { label: 'France', value: 'FR' },
            ],
          },
          {
            label: 'Oceania',
            options: [
              { label: 'Papua New Guinea', value: 'PG' },
            ],
          },
        ],
      })

      await search(wrapper, 'guinea')

      expect(getLabels(wrapper)).toEqual([
        'Africa',
        'Guinea Bissau',
        'Guinea',
        'Oceania',
        'Papua New Guinea',
      ])
    })
  })
})

describe('given a MazSelect without the search', () => {
  describe('when an option is searched with the keyboard', () => {
    it('then the options containing the query are found without the search engine', async () => {
      const wrapper = await mountSelect({ search: false })

      const options = (wrapper.vm as unknown as { getFilteredOptionWithQuery: (query: string) => { label: string }[] }).getFilteredOptionWithQuery('guin')

      expect(options.map(option => option.label)).toEqual(['Papua New Guinea', 'Guinea Bissau', 'Guinea'])
    })
  })

  describe('when the options have groups and are searched with the keyboard', () => {
    it('then the groups without match are removed', async () => {
      const wrapper = await mountSelect({
        search: false,
        options: [
          {
            label: 'Africa',
            options: [
              { label: 'Guinea', value: 'GN' },
            ],
          },
          {
            label: 'Europe',
            options: [
              { label: 'France', value: 'FR' },
            ],
          },
        ],
      })

      const options = (wrapper.vm as unknown as { getFilteredOptionWithQuery: (query: string) => { label: string }[] }).getFilteredOptionWithQuery('fr')

      expect(options.map(option => option.label)).toEqual(['Europe', 'France'])
    })
  })
})
