import type { MazInputAutocompleteProps } from '@components/MazInputAutocomplete.vue'
import MazInputAutocomplete from '@components/MazInputAutocomplete.vue'
import { runAxe } from '@tests/helpers/axe'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

interface Country {
  label: string
  value: string
}

enableAutoUnmount(afterEach)

const translations = {
  noResults: 'No results',
  loading: 'Loading...',
  error: 'An error occurred, try again',
  results: 'Results: {count}',
}

const countries: Country[] = [
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Guinea', value: 'GN' },
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
]

function mountAutocomplete(props: Partial<MazInputAutocompleteProps<Country>> & Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazInputAutocomplete<Country>, {
    props: {
      items: countries,
      label: 'Country',
      translations,
      ...props,
    },
    slots,
    attachTo: document.body,
    global: {
      stubs: { teleport: true },
    },
  })
}

type Wrapper = ReturnType<typeof mountAutocomplete>

async function type(wrapper: Wrapper, value: string) {
  await wrapper.find('input').setValue(value)
  await flushPromises()
}

async function press(wrapper: Wrapper, key: string, options: KeyboardEventInit = {}) {
  await wrapper.find('input').trigger('keydown', { key, ...options })
  await flushPromises()
}

function getLabels(wrapper: Wrapper) {
  return wrapper.findAll('[role="option"]').map(option => option.text())
}

describe('given a MazInputAutocomplete with items', () => {
  describe('when a query is typed', () => {
    it('then the matching items are listed, the best first, with the matched characters highlighted', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'guinea')

      expect(getLabels(wrapper)).toEqual(['Guinea', 'Papua New Guinea'])
      expect(wrapper.find('[role="option"] mark').text()).toBe('Guinea')
      expect(wrapper.find('input').attributes('aria-expanded')).toBe('true')
      expect(wrapper.find('input').attributes('aria-controls')).toBe(wrapper.find('[role="listbox"]').attributes('id'))
      expect(wrapper.find('[role="status"]').text()).toBe('Results: 2')
      expect(wrapper.emitted('open')).toHaveLength(1)
    })
  })

  describe('when the query has a typo', () => {
    it('then the item is found without highlight', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'Franse')

      expect(getLabels(wrapper)).toEqual(['France'])
      expect(wrapper.find('mark').exists()).toBe(false)
    })
  })

  describe('when the highlight is disabled', () => {
    it('then no character is highlighted', async () => {
      const wrapper = mountAutocomplete({ highlight: false })

      await type(wrapper, 'fra')

      expect(wrapper.find('mark').exists()).toBe(false)
    })
  })

  describe('when the query matches nothing', () => {
    it('then the empty state is displayed', async () => {
      const wrapper = mountAutocomplete({}, { empty: '<p class="empty">Nothing for {{ query }}</p>' })

      await type(wrapper, 'zzzz')

      expect(wrapper.find('.empty').exists()).toBe(true)
      expect(wrapper.find('input').attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('[role="status"]').text()).toBe('No results')
    })
  })

  describe('when the query is shorter than min-chars', () => {
    it('then the list stays closed', async () => {
      const wrapper = mountAutocomplete({ minChars: 3 })

      await type(wrapper, 'fr')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.find('input').attributes('aria-expanded')).toBe('false')

      await type(wrapper, 'fra')

      expect(getLabels(wrapper)).toEqual(['France'])

      await type(wrapper, 'f')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('when a limit is set', () => {
    it('then the suggestions are capped', async () => {
      const wrapper = mountAutocomplete({ limit: 1 })

      await type(wrapper, 'guinea')

      expect(getLabels(wrapper)).toEqual(['Guinea'])
    })
  })

  describe('when the items are navigated with the keyboard', () => {
    it('then the active option follows the arrows, wraps around and is chosen with Enter', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'guinea')
      await press(wrapper, 'ArrowDown')

      const options = wrapper.findAll('[role="option"]')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBe(options[0]?.attributes('id'))
      expect(options[0]?.classes()).toContain('--is-active')

      await press(wrapper, 'ArrowDown')
      await press(wrapper, 'ArrowDown')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBe(options[0]?.attributes('id'))

      await press(wrapper, 'ArrowUp')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBe(options[1]?.attributes('id'))

      await press(wrapper, 'Enter')

      expect(wrapper.emitted('select')?.[0]).toEqual([countries[0]])
      expect(wrapper.emitted('update:selected')?.[0]).toEqual([countries[0]])
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Papua New Guinea'])
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('when ArrowUp is pressed first', () => {
    it('then the last option is active', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'guinea')
      await press(wrapper, 'ArrowUp')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBe(wrapper.findAll('[role="option"]')[1]?.attributes('id'))
    })
  })

  describe('when Enter is pressed without active option', () => {
    it('then the first suggestion is chosen and the list closes', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'guinea')
      await press(wrapper, 'Enter')

      expect(wrapper.emitted('select')?.[0]).toEqual([countries[1]])
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('when Enter is pressed without suggestion', () => {
    it('then nothing is chosen', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'zzzz')
      await press(wrapper, 'Enter')

      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('when the list is closed and an arrow is pressed', () => {
    it('then the list opens, with Alt it opens without moving', async () => {
      const wrapper = mountAutocomplete({ modelValue: 'guinea' })

      await press(wrapper, 'ArrowDown', { altKey: true })

      expect(getLabels(wrapper)).toEqual(['Guinea', 'Papua New Guinea'])
      expect(wrapper.find('input').attributes('aria-activedescendant')).toBeUndefined()

      await press(wrapper, 'Escape')
      await press(wrapper, 'ArrowDown')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBeDefined()
    })
  })

  describe('when there is no suggestion and an arrow is pressed', () => {
    it('then no option is active', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'zzzz')
      await press(wrapper, 'ArrowDown')

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBeUndefined()
    })
  })

  describe('when Escape is pressed', () => {
    it('then the list closes, a second Escape clears the input', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'fra')
      await press(wrapper, 'Escape')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('fra')

      await press(wrapper, 'Escape')

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    })
  })

  describe('when Escape is pressed on an empty closed input', () => {
    it('then nothing happens', async () => {
      const wrapper = mountAutocomplete()

      await press(wrapper, 'Escape')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when Tab is pressed or the input is blurred', () => {
    it('then the list closes', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'fra')
      await press(wrapper, 'Tab')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

      await type(wrapper, 'fran')
      await wrapper.find('input').trigger('blur')
      await flushPromises()

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })

  describe('when a key is pressed during a composition', () => {
    it('then it is ignored', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'guinea')
      await press(wrapper, 'ArrowDown', { isComposing: true })

      expect(wrapper.find('input').attributes('aria-activedescendant')).toBeUndefined()
    })
  })

  describe('when a suggestion is clicked', () => {
    it('then it is chosen', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'germ')
      await wrapper.find('[role="option"]').trigger('mousedown')
      await wrapper.find('[role="option"]').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('select')?.[0]).toEqual([countries[3]])
    })
  })

  describe('when the text of the chosen suggestion is edited', () => {
    it('then the selection is cleared', async () => {
      const wrapper = mountAutocomplete({ selected: countries[2], modelValue: 'France' })

      await type(wrapper, 'Fran')

      expect(wrapper.emitted('update:selected')?.[0]).toEqual([undefined])
    })
  })

  describe('when the chosen suggestion is in the list', () => {
    it('then it is marked as selected', async () => {
      const wrapper = mountAutocomplete({ selected: countries[2], modelValue: 'France' })

      await press(wrapper, 'ArrowDown', { altKey: true })

      expect(wrapper.find('[role="option"]').attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the suggestion with the text already typed is chosen', () => {
    it('then the list does not open again', async () => {
      const wrapper = mountAutocomplete()

      await type(wrapper, 'France')
      await press(wrapper, 'ArrowDown')
      await press(wrapper, 'Enter')

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('when open-on-focus is enabled with min-chars at 0', () => {
    it('then every item is listed on focus', async () => {
      const wrapper = mountAutocomplete({ openOnFocus: true, minChars: 0 })

      await wrapper.find('input').trigger('focus')
      await flushPromises()

      expect(getLabels(wrapper)).toHaveLength(4)
      expect(wrapper.emitted('focus')).toHaveLength(1)
    })
  })

  describe('when the component is disabled', () => {
    it('then the list does not open', async () => {
      const wrapper = mountAutocomplete({ openOnFocus: true, minChars: 0, disabled: true })

      await wrapper.find('input').trigger('focus')
      await flushPromises()

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('when the item slot is used', () => {
    it('then it renders each suggestion', async () => {
      const wrapper = mountAutocomplete({}, {
        item: '<template #item="{ item, isActive }"><b class="custom">{{ item.value }}-{{ isActive }}</b></template>',
      })

      await type(wrapper, 'germ')

      expect(wrapper.find('.custom').text()).toBe('DE-false')
    })
  })

  describe('when the header, footer and icon slots are used', () => {
    it('then they are rendered', async () => {
      const wrapper = mountAutocomplete({}, {
        'header': '<p class="header">Header</p>',
        'footer': '<p class="footer">Footer</p>',
        'start-icon': '<i class="start" />',
        'end-icon': '<i class="end" />',
      })

      await type(wrapper, 'germ')

      expect(wrapper.find('.header').exists()).toBe(true)
      expect(wrapper.find('.footer').exists()).toBe(true)
      expect(wrapper.find('.start').exists()).toBe(true)
      expect(wrapper.find('.end').exists()).toBe(true)
    })
  })

  describe('when the list is opened and closed with the exposed functions', () => {
    it('then it follows them', async () => {
      const wrapper = mountAutocomplete({ modelValue: 'fra' })
      const vm = wrapper.vm as unknown as { open: () => void, close: () => void }

      vm.open()
      await flushPromises()

      expect(getLabels(wrapper)).toEqual(['France'])

      vm.close()
      await flushPromises()

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })
})

describe('given a MazInputAutocomplete with strings', () => {
  describe('when a query is typed', () => {
    it('then the strings are searched and chosen', async () => {
      const wrapper = mount(MazInputAutocomplete<string>, {
        props: {
          items: ['apple', 'banana', 'cherry'],
          label: 'Fruit',
        },
        global: {
          stubs: { teleport: true },
        },
      })

      await wrapper.find('input').setValue('ban')
      await flushPromises()
      await wrapper.find('[role="option"]').trigger('click')

      expect(wrapper.emitted('select')?.[0]).toEqual(['banana'])
    })
  })
})

describe('given a MazInputAutocomplete with label and value functions', () => {
  describe('when a suggestion is selected', () => {
    it('then the functions give its text and identity', async () => {
      const users = [
        { id: 1, name: 'Ada Lovelace' },
        { id: 2, name: 'Alan Turing' },
      ]
      const wrapper = mount(MazInputAutocomplete<typeof users[number]>, {
        props: {
          items: users,
          itemLabel: user => user.name,
          itemValue: user => user.id,
          selected: { id: 2, name: 'Alan Turing' },
          modelValue: 'Alan Turing',
          label: 'User',
        },
        global: {
          stubs: { teleport: true },
        },
      })

      await wrapper.find('input').trigger('keydown', { key: 'ArrowDown', altKey: true })
      await flushPromises()

      expect(wrapper.find('[role="option"]').attributes('aria-selected')).toBe('true')
    })
  })
})

describe('given a MazInputAutocomplete with a source', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when a query is typed', () => {
    it('then the source is called after the debounce and its results are listed in their order', async () => {
      const source = vi.fn((query: string) => Promise.resolve(countries.filter(country => country.label.toLowerCase().includes(query))))
      const wrapper = mountAutocomplete({ items: undefined, source }, { loading: '<p class="loading">Loading</p>' })

      await type(wrapper, 'guinea')

      expect(source).not.toHaveBeenCalled()
      expect(wrapper.find('.loading').exists()).toBe(true)
      expect(wrapper.find('[role="status"]').text()).toBe('Loading...')

      await vi.advanceTimersByTimeAsync(300)
      await flushPromises()

      expect(source).toHaveBeenCalledWith('guinea', {
        signal: expect.any(AbortSignal),
      })
      expect(getLabels(wrapper)).toEqual(['Papua New Guinea', 'Guinea'])
      expect(wrapper.find('mark').text()).toBe('Guinea')
    })
  })

  describe('when a new query is typed during a request', () => {
    it('then the previous request is aborted and ignored', async () => {
      const signals: AbortSignal[] = []
      const resolvers: ((value: Country[]) => void)[] = []
      const source = vi.fn((_query: string, { signal }: { signal: AbortSignal }) => {
        signals.push(signal)

        return new Promise<Country[]>((resolve) => {
          resolvers.push(resolve)
        })
      })
      const wrapper = mountAutocomplete({ items: undefined, source, debounce: 0 })

      await type(wrapper, 'gu')
      await type(wrapper, 'fr')

      expect(signals[0]?.aborted).toBe(true)

      resolvers[0]?.([countries[0]!])
      resolvers[1]?.([countries[2]!])
      await flushPromises()

      expect(getLabels(wrapper)).toEqual(['France'])
    })
  })

  describe('when the source returns more results than the limit', () => {
    it('then they are capped', async () => {
      const wrapper = mountAutocomplete({
        items: undefined,
        source: () => countries,
        debounce: 0,
        limit: 2,
        highlight: false,
      })

      await type(wrapper, 'a')

      expect(getLabels(wrapper)).toEqual(['Papua New Guinea', 'Guinea'])
    })
  })

  describe('when the source fails', () => {
    it('then the error is displayed and the source can be called again', async () => {
      const source = vi.fn()
        .mockRejectedValueOnce(new Error('network'))
        .mockResolvedValueOnce([countries[2]])
      const wrapper = mountAutocomplete({ items: undefined, source, debounce: 0 }, {
        error: '<template #error="{ retry }"><button class="retry" @click="retry">Retry</button></template>',
      })

      await type(wrapper, 'fr')

      expect(wrapper.emitted('error')?.[0]).toEqual([
        new Error('network'),
      ])
      expect(wrapper.find('[role="status"]').text()).toBe('An error occurred, try again')

      await wrapper.find('.retry').trigger('click')
      await flushPromises()

      expect(getLabels(wrapper)).toEqual(['France'])
    })
  })

  describe('when a request fails after a new query', () => {
    it('then the failure is ignored', async () => {
      const rejecters: ((error: Error) => void)[] = []
      const source = vi.fn(() => new Promise<Country[]>((_resolve, reject) => {
        rejecters.push(reject)
      }))
      const wrapper = mountAutocomplete({ items: undefined, source, debounce: 0 })

      await type(wrapper, 'fr')
      await type(wrapper, 'fra')
      rejecters[0]?.(new Error('aborted'))
      await flushPromises()

      expect(wrapper.emitted('error')).toBeUndefined()
    })
  })

  describe('when the query becomes too short', () => {
    it('then the pending request is cancelled', async () => {
      const source = vi.fn(() => countries)
      const wrapper = mountAutocomplete({ items: undefined, source, minChars: 2 })

      await type(wrapper, 'fr')
      await type(wrapper, 'f')
      await vi.advanceTimersByTimeAsync(300)

      expect(source).not.toHaveBeenCalled()
    })
  })

  describe('when open-on-focus is enabled', () => {
    it('then the source is called on focus', async () => {
      const source = vi.fn(() => countries)
      const wrapper = mountAutocomplete({
        items: undefined,
        source,
        minChars: 0,
        openOnFocus: true,
        debounce: 0,
      })

      await wrapper.find('input').trigger('focus')
      await flushPromises()

      expect(source).toHaveBeenCalledWith('', {
        signal: expect.any(AbortSignal),
      })
      expect(getLabels(wrapper)).toHaveLength(4)
    })
  })
})

describe('given an open MazInputAutocomplete with an active option', () => {
  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', { timeout: 20000 }, async () => {
      const wrapper = mount(MazInputAutocomplete<Country>, {
        props: { items: countries, label: 'Country', translations },
        attachTo: document.body,
      })

      await wrapper.find('input').setValue('guinea')
      await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' })
      await flushPromises()
      await vi.dynamicImportSettled()

      expect(document.querySelector('[role="listbox"] [aria-selected]')).not.toBeNull()
      expect(await runAxe(document.body)).toHaveNoViolations()
    })
  })
})

describe('given a MazInputAutocomplete with a wide input', () => {
  describe('when the list opens', () => {
    it('then the list is at least as wide as the input', async () => {
      const offsetWidth = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(320)
      const wrapper = mountAutocomplete()

      await type(wrapper, 'fra')

      expect((wrapper.find('.m-input-autocomplete-list').element as HTMLElement).style.minWidth).toBe('320px')

      offsetWidth.mockRestore()
    })
  })
})
