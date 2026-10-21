import type { VueWrapper } from '@vue/test-utils'
import MazSelect from '@components/MazSelect.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const mountedWrappers: VueWrapper[] = []

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({ t: (key: string) => key, locale: { value: 'en' } } as unknown as ReturnType<typeof useTranslations>)
})

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]

async function mountSelect(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazSelect, {
    props: { label: 'Fruit', options, ...props },
    attachTo: document.body,
  })

  mountedWrappers.push(wrapper)

  await vi.dynamicImportSettled()
  await nextTick()

  return wrapper
}

function getCombobox(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.m-select-input input')
}

function pressKey(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }))
}

describe('given a closed MazSelect', () => {
  describe('when it is rendered', () => {
    it('then the input is a collapsed combobox of a listbox', async () => {
      const wrapper = await mountSelect()
      const combobox = getCombobox(wrapper)

      expect(combobox.attributes('role')).toBe('combobox')
      expect(combobox.attributes('aria-haspopup')).toBe('listbox')
      expect(combobox.attributes('aria-expanded')).toBe('false')
      expect(combobox.attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBeUndefined()
    })

    it('then the toggle button has a translated label', async () => {
      const wrapper = await mountSelect()

      expect(wrapper.find('.m-select-input__toggle-button').attributes('aria-label')).toBe('aria.showOptions')
    })
  })

  describe('when Space is pressed on the combobox', () => {
    it('then the list opens', async () => {
      const wrapper = await mountSelect()

      await getCombobox(wrapper).trigger('keydown', { key: ' ' })
      await nextTick()

      expect(getCombobox(wrapper).attributes('aria-expanded')).toBe('true')
    })
  })
})

describe('given an open MazSelect', () => {
  describe('when it is rendered', () => {
    it('then the combobox controls a labelled listbox of options', async () => {
      const wrapper = await mountSelect({ open: true, modelValue: 'b' })
      const combobox = getCombobox(wrapper)
      const listbox = wrapper.find('[role="listbox"]')

      expect(combobox.attributes('aria-expanded')).toBe('true')
      expect(combobox.attributes('aria-controls')).toBe(listbox.attributes('id'))
      expect(listbox.attributes('aria-label')).toBe('Fruit')
      expect(listbox.attributes('aria-multiselectable')).toBeUndefined()
      expect(wrapper.find('.m-select-input__toggle-button').attributes('aria-label')).toBe('aria.hideOptions')
    })

    it('then each option has an id and its selected state', async () => {
      const wrapper = await mountSelect({ open: true, modelValue: 'b' })
      const optionElements = wrapper.findAll('[role="option"]')
      const ids = optionElements.map(option => option.attributes('id'))

      expect(optionElements).toHaveLength(3)
      expect(new Set(ids).size).toBe(3)
      expect(optionElements.map(option => option.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
    })
  })

  describe('when it has no label', () => {
    it('then the listbox falls back to a translated label', async () => {
      const wrapper = await mountSelect({ open: true, label: undefined })

      expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('aria.options')
    })
  })

  describe('when it has a placeholder and no label', () => {
    it('then the listbox is labelled by the placeholder', async () => {
      const wrapper = await mountSelect({ open: true, label: undefined, placeholder: 'Pick a fruit' })

      expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('Pick a fruit')
    })
  })

  describe('when it is multiple', () => {
    it('then the listbox is multiselectable and the checkboxes are inert', async () => {
      const wrapper = await mountSelect({ open: true, multiple: true, modelValue: ['a', 'c'] })
      const checkbox = wrapper.find('[role="option"] input[type="checkbox"]')

      expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
      expect(wrapper.findAll('[role="option"]').map(option => option.attributes('aria-selected'))).toEqual(['true', 'false', 'true'])
      expect(checkbox.attributes('tabindex')).toBe('-1')
      expect(checkbox.element.closest('[inert]')).not.toBeNull()
      expect(await runAxe(document.body)).toHaveNoViolations()
    })
  })

  describe('when there are option groups', () => {
    it('then the group labels are presentational', async () => {
      const wrapper = await mountSelect({ open: true, options: [{ label: 'Fruits', options: [{ label: 'Apple', value: 'a' }] }] })

      expect(wrapper.find('.m-select-list-optgroup').attributes('role')).toBe('presentation')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    })
  })

  describe('when no option matches', () => {
    it('then a status announces no results and the combobox controls the list container', async () => {
      const wrapper = await mountSelect({ open: true, options: [] })
      const status = wrapper.find('[role="status"]')

      expect(status.text()).toBe('aria.noResults')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(getCombobox(wrapper).attributes('aria-controls')).toBe(wrapper.find('.m-select-list').attributes('id'))
    })
  })
})

describe('given an open MazSelect with the focus on an option', () => {
  describe('when End then Home are pressed', () => {
    it('then the focus moves to the last then the first option', async () => {
      const wrapper = await mountSelect({ open: true })
      const optionElements = wrapper.findAll<HTMLElement>('[role="option"]')

      optionElements[1].element.focus()

      pressKey('End')
      expect(document.activeElement).toBe(optionElements[2].element)

      pressKey('Home')
      expect(document.activeElement).toBe(optionElements[0].element)
    })
  })
})

describe('given an open MazSelect with the focus in the search input', () => {
  describe('when Home is pressed', () => {
    it('then the focus stays in the search input', async () => {
      const wrapper = await mountSelect({ open: true, search: true })
      const searchInput = wrapper.find<HTMLInputElement>('.m-select-list__search-input input')

      searchInput.element.focus()
      pressKey('Home')

      expect(document.activeElement).toBe(searchInput.element)
    })
  })
})
