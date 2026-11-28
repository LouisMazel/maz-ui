import type { VueWrapper } from '@vue/test-utils'
import MazSelect from '@components/MazSelect.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]

async function mountOpenSelect(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazSelect, {
    props: { label: 'Fruit', options, open: true, search: true, ...props },
    attachTo: document.body,
  })

  mountedWrappers.push(wrapper)

  await vi.dynamicImportSettled()
  await nextTick()

  return wrapper
}

function pressKeyOn(element: Element, key: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })

  element.dispatchEvent(event)

  return event
}

describe('given an open MazSelect with the search and the focus on an option', () => {
  describe('when a letter is typed', () => {
    it('then the letter goes into the focused search input', async () => {
      const wrapper = await mountOpenSelect()
      const option = wrapper.find<HTMLElement>('[role="option"]').element
      const searchInput = wrapper.find<HTMLInputElement>('.m-select-list__search-input input')

      option.focus()
      const event = pressKeyOn(option, 'b')
      await nextTick()

      expect(event.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(searchInput.element)
      expect(searchInput.element.value).toBe('b')
    })
  })

  describe('when several letters are typed', () => {
    it('then they are appended to the query', async () => {
      const wrapper = await mountOpenSelect()
      const option = wrapper.find<HTMLElement>('[role="option"]').element
      const searchInput = wrapper.find<HTMLInputElement>('.m-select-list__search-input input')

      option.focus()
      pressKeyOn(option, 'b')
      await nextTick()
      option.focus()
      pressKeyOn(option, 'a')
      await nextTick()

      expect(searchInput.element.value).toBe('ba')
    })
  })

  describe('when a space or a shortcut is pressed', () => {
    it('then the search input is left alone', async () => {
      const wrapper = await mountOpenSelect()
      const option = wrapper.find<HTMLElement>('[role="option"]').element
      const searchInput = wrapper.find<HTMLInputElement>('.m-select-list__search-input input')

      option.focus()
      const space = pressKeyOn(option, ' ')
      const shortcut = pressKeyOn(option, 'c', { ctrlKey: true })
      await nextTick()

      expect(space.defaultPrevented).toBe(false)
      expect(shortcut.defaultPrevented).toBe(false)
      expect(searchInput.element.value).toBe('')
    })
  })
})

describe('given an open MazSelect without the search', () => {
  describe('when a letter is typed on an option', () => {
    it('then the keyboard search keeps the focus on the options', async () => {
      const wrapper = await mountOpenSelect({ search: false })
      const option = wrapper.find<HTMLElement>('[role="option"]').element

      option.focus()
      const event = pressKeyOn(option, 'b')

      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.find('.m-select-list__search-input').exists()).toBe(false)
    })
  })
})
