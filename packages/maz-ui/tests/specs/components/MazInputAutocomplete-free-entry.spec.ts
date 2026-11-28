import MazInputAutocomplete from '@components/MazInputAutocomplete.vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

const translations = {
  noResults: 'No results',
  loading: 'Loading...',
  error: 'Error',
  results: 'Results: {count}',
  freeEntry: 'Use "{query}"',
}

const items = [
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
]

function mountAutocomplete(props: Record<string, unknown> = {}) {
  return mount(MazInputAutocomplete, {
    props: { items, label: 'Country', translations, freeEntry: true, ...props },
    attachTo: document.body,
    global: { stubs: { teleport: true } },
  })
}

async function type(wrapper: ReturnType<typeof mountAutocomplete>, value: string) {
  await wrapper.find('input').setValue(value)
  await flushPromises()
}

describe('given MazInputAutocomplete in free entry mode', () => {
  describe('when the typed value partially matches the suggestions', () => {
    it('then the status announces the results and the free entry', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Fr')

      expect(wrapper.find('[role="status"]').text()).toBe('Results: 1. Use "Fr"')
      expect(wrapper.find('.m-input-autocomplete-free-entry').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when the list opens on focus with an empty value', () => {
    it('then no free entry row is offered', async () => {
      const wrapper = mountAutocomplete({ openOnFocus: true, minChars: 0 })

      await wrapper.find('input').trigger('focus')
      await flushPromises()

      expect(wrapper.find('.m-input-autocomplete-free-entry').exists()).toBe(false)
    })
  })

  describe('when the typed value matches nothing', () => {
    it('then the free entry row replaces the no results message', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Atlantis')

      expect(wrapper.find('.m-input-autocomplete-free-entry').text()).toBe('Use "Atlantis"')
      expect(wrapper.text()).not.toContain('No results')
      expect(wrapper.find('[role="status"]').text()).toBe('Use "Atlantis"')
    })

    it('then Enter validates the text and emits free-entry without a selection', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Atlantis')
      await wrapper.find('input').trigger('keydown', { key: 'Enter' })
      await flushPromises()

      expect(wrapper.emitted('free-entry')?.[0]).toEqual(['Atlantis'])
      expect(wrapper.emitted('select')).toBeUndefined()
      expect(wrapper.find('.m-input-autocomplete-free-entry').exists()).toBe(false)
    })

    it('then clicking the row emits free-entry', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Atlantis')
      await wrapper.find('.m-input-autocomplete-free-entry').trigger('click')

      expect(wrapper.emitted('free-entry')?.[0]).toEqual(['Atlantis'])
    })
  })

  describe('when the typed value partly matches an item', () => {
    it('then the suggestions and the free entry row are both displayed', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Fra')

      expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
      expect(wrapper.find('.m-input-autocomplete-free-entry').exists()).toBe(true)
    })
  })

  describe('when the typed value equals an item', () => {
    it('then no free entry row is displayed', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'france')

      expect(wrapper.find('.m-input-autocomplete-free-entry').exists()).toBe(false)
    })
  })

  describe('when free-entry is not enabled', () => {
    it('then the no results message is displayed', async () => {
      const wrapper = mountAutocomplete({ freeEntry: false })

      await type(wrapper, 'Atlantis')

      expect(wrapper.text()).toContain('No results')
      expect(wrapper.find('.m-input-autocomplete-free-entry').exists()).toBe(false)
    })
  })
})

describe('given MazInputAutocomplete input props', () => {
  describe('when rounded-size, icons and states are provided', () => {
    it('then they are forwarded to the input', () => {
      const wrapper = mountAutocomplete({ roundedSize: 'full', error: true, assistiveText: 'Required', name: 'country', readonly: true })

      expect(wrapper.find('.m-input-wrapper').classes()).toContain('--rounded-full')
      expect(wrapper.find('.m-input-bottom-text').text()).toBe('Required')
      expect(wrapper.find('input').attributes('name')).toBe('country')
      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })
  })
})
