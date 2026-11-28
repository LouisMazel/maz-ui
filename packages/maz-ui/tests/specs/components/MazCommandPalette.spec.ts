import type { MazCommandPaletteGroup } from '@components/MazCommandPalette.vue'
import MazCommandPalette from '@components/MazCommandPalette.vue'
import { MazMagnifyingGlass } from '@maz-ui/icons/raw/MazMagnifyingGlass'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

vi.mock('@maz-ui/translations/composables/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string, variables?: { count?: number }) => ({
      'commandPalette.label': 'Command palette',
      'commandPalette.placeholder': 'Search a command',
      'commandPalette.noResults': 'No results',
      'commandPalette.results': `${variables?.count} results`,
    })[key] ?? key,
    locale: 'en',
  }),
}))

enableAutoUnmount(afterEach)

const goHome = vi.fn()
const toggleTheme = vi.fn()

function getGroups(): MazCommandPaletteGroup[] {
  return [
    {
      label: 'Navigation',
      items: [
        { id: 'home', label: 'Go home', description: 'Back to the start', shortcut: 'G H', action: goHome, icon: MazMagnifyingGlass },
        { id: 'docs', label: 'Open the docs', to: '/docs' },
        { id: 'locked', label: 'Locked command', disabled: true },
      ],
    },
    {
      items: [
        { id: 'theme', label: 'Change the theme', keywords: ['dark', 'light'], action: toggleTheme },
        { id: 'ext', label: 'Visit the site', href: 'https://maz-ui.com', target: '_blank' },
        { id: 'same', label: 'Reload the page', href: '/reload' },
      ],
    },
  ]
}

function mountPalette(props: Record<string, unknown> = {}, slots: Record<string, string> = {}, mocks: Record<string, unknown> = {}) {
  return mount(MazCommandPalette, {
    props: { groups: getGroups(), open: true, ...props },
    slots,
    attachTo: document.body,
    global: { config: { globalProperties: mocks } },
  })
}

type Wrapper = ReturnType<typeof mountPalette>

function input(wrapper: Wrapper) {
  return wrapper.find('input[role="combobox"]')
}

function options(wrapper: Wrapper) {
  return wrapper.findAll('[role="option"]')
}

async function type(wrapper: Wrapper, value: string) {
  await input(wrapper).setValue(value)
  await flushPromises()
}

async function press(wrapper: Wrapper, key: string, init: KeyboardEventInit = {}) {
  await input(wrapper).trigger('keydown', { key, ...init })
  await flushPromises()
}

describe('given a MazCommandPalette', () => {
  beforeEach(() => {
    goHome.mockClear()
    toggleTheme.mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when it is open', () => {
    it('then the search field is a combobox wired to the listbox', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      const field = input(wrapper)
      const listbox = wrapper.find('[role="listbox"]')

      expect(field.attributes('aria-controls')).toBe(listbox.attributes('id'))
      expect(field.attributes('aria-autocomplete')).toBe('list')
      expect(field.attributes('aria-expanded')).toBe('true')
      expect(field.attributes('aria-label')).toBe('Command palette')
      expect(field.attributes('placeholder')).toBe('Search a command')
    })

    it('then the groups and the options are rendered', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      expect(wrapper.findAll('[role="group"]')).toHaveLength(2)
      expect(options(wrapper)).toHaveLength(6)
      expect(wrapper.find('.m-command-palette__group-label').text()).toBe('Navigation')
      expect(wrapper.find('.m-command-palette__kbd').text()).toBe('G H')
    })

    it('then the first option is the active descendant', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      const first = options(wrapper)[0]!

      expect(input(wrapper).attributes('aria-activedescendant')).toBe(first.attributes('id'))
      expect(first.attributes('aria-selected')).toBe('true')
      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('false')
    })

    it('then a disabled command is marked', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      expect(options(wrapper)[2]!.attributes('aria-disabled')).toBe('true')
    })

    it('then a live region announces the count', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      expect(wrapper.find('[role="status"]').text()).toBe('6 results')
    })

    it('then the placeholder prop wins', async () => {
      const wrapper = mountPalette({ placeholder: 'Type...' })

      await flushPromises()

      expect(input(wrapper).attributes('placeholder')).toBe('Type...')
    })

    it('then it renders on the server closed', async () => {
      const html = await renderToString(createSSRApp(MazCommandPalette, { groups: getGroups() }))

      expect(html).not.toContain('role="option"')
    })
  })

  describe('when the user types', () => {
    it('then the options are filtered and ranked', async () => {
      const wrapper = mountPalette()

      await type(wrapper, 'docs')

      expect(options(wrapper).map(option => option.text())).toEqual(['Open the docs'])
    })

    it('then the matched letters are marked', async () => {
      const wrapper = mountPalette()

      await type(wrapper, 'docs')

      expect(wrapper.find('mark').exists()).toBe(true)
    })

    it('then the keywords find a command', async () => {
      const wrapper = mountPalette()

      await type(wrapper, 'dark')

      expect(options(wrapper)[0]!.text()).toContain('Change the theme')
    })

    it('then the empty text is shown without a match', async () => {
      const wrapper = mountPalette()

      await type(wrapper, 'zzzzzzzz')

      expect(wrapper.find('.m-command-palette__empty').text()).toBe('No results')
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      expect(input(wrapper).attributes('aria-activedescendant')).toBeUndefined()
      expect(input(wrapper).attributes('aria-controls')).toBeUndefined()
      expect(wrapper.find('[role="status"]').text()).toBe('0 results')
    })

    it('then the empty slot receives the query', async () => {
      const wrapper = mountPalette({}, { empty: `<template #empty="{ query }"><p class="custom-empty">Nothing for {{ query }}</p></template>` })

      await type(wrapper, 'zzzzzzzz')

      expect(wrapper.find('.custom-empty').text()).toBe('Nothing for zzzzzzzz')
    })

    it('then the first enabled option becomes active again', async () => {
      const wrapper = mountPalette()

      await press(wrapper, 'ArrowDown')
      await type(wrapper, 'the')

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the keyboard moves the selection', () => {
    it('then ArrowDown and ArrowUp move and skip the disabled command', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'ArrowDown')
      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'ArrowDown')
      expect(options(wrapper)[3]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'ArrowUp')
      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('true')
    })

    it('then the selection wraps around', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'ArrowUp')

      expect(options(wrapper)[5]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'ArrowDown')

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('then PageDown and PageUp reach the edges', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'PageDown')
      expect(options(wrapper)[5]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'PageUp')
      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('then Ctrl+End and Ctrl+Home reach the edges, plain Home and End stay in the field', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'End')
      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'End', { ctrlKey: true })
      expect(options(wrapper)[5]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'Home')
      expect(options(wrapper)[5]!.attributes('aria-selected')).toBe('true')

      await press(wrapper, 'Home', { ctrlKey: true })
      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('then an unknown key does nothing', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'a')

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('then moving with nothing to choose is harmless', async () => {
      const wrapper = mountPalette()

      await type(wrapper, 'zzzzzzzz')
      await press(wrapper, 'ArrowDown')
      await press(wrapper, 'PageDown')

      expect(wrapper.find('.m-command-palette__empty').exists()).toBe(true)
    })
  })

  describe('when a command is chosen', () => {
    it('then Enter runs the action, emits select and closes', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'Enter')

      expect(goHome).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'home' })
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
    })

    it('then Enter during an IME composition does nothing', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await press(wrapper, 'Enter', { isComposing: true })

      expect(goHome).not.toHaveBeenCalled()
    })

    it('then a click runs the action', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[3]!.trigger('click')
      await flushPromises()

      expect(toggleTheme).toHaveBeenCalledTimes(1)
    })

    it('then a disabled command is ignored', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[2]!.trigger('click')

      expect(wrapper.emitted('select')).toBeUndefined()
    })

    it('then closeOnSelect false keeps it open', async () => {
      const wrapper = mountPalette({ closeOnSelect: false })

      await flushPromises()
      await press(wrapper, 'Enter')

      expect(goHome).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('update:open')).toBeUndefined()
    })

    it('then a route goes through the router', async () => {
      const push = vi.fn()
      const wrapper = mountPalette({}, {}, { $router: { push } })

      await flushPromises()
      await options(wrapper)[1]!.trigger('click')
      await flushPromises()

      expect(push).toHaveBeenCalledWith('/docs')
    })

    it('then a route without a router assigns the location', async () => {
      const assign = vi.fn()

      vi.stubGlobal('location', { assign })

      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[1]!.trigger('click')
      await flushPromises()

      expect(assign).toHaveBeenCalledWith('/docs')

      vi.unstubAllGlobals()
    })

    it('then an href with a target opens a new window', async () => {
      const open = vi.fn()

      vi.stubGlobal('open', open)

      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[4]!.trigger('click')
      await flushPromises()

      expect(open).toHaveBeenCalledWith('https://maz-ui.com', '_blank', 'noopener,noreferrer')

      vi.unstubAllGlobals()
    })

    it('then an href without a target navigates', async () => {
      const assign = vi.fn()

      vi.stubGlobal('location', { assign })

      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[5]!.trigger('click')
      await flushPromises()

      expect(assign).toHaveBeenCalledWith('/reload')

      vi.unstubAllGlobals()
    })

    it('then a mousedown does not steal the focus from the field', async () => {
      const wrapper = mountPalette()

      await flushPromises()

      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })

      options(wrapper)[0]!.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('when the pointer moves', () => {
    it('then it selects the option and shows the sliding highlight', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[3]!.trigger('pointermove', { pointerType: 'mouse' })
      await flushPromises()

      expect(options(wrapper)[3]!.attributes('aria-selected')).toBe('true')
      expect(wrapper.find('.m-command-palette__highlight').exists()).toBe(true)
    })

    it('then a touch pointer and a disabled option are ignored', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[3]!.trigger('pointermove', { pointerType: 'touch' })
      await options(wrapper)[2]!.trigger('pointermove', { pointerType: 'mouse' })

      expect(options(wrapper)[0]!.attributes('aria-selected')).toBe('true')
    })

    it('then leaving the list or using the keyboard goes back to the keyboard mode', async () => {
      const wrapper = mountPalette()

      await flushPromises()
      await options(wrapper)[3]!.trigger('pointermove', { pointerType: 'mouse' })
      await wrapper.find('[role="listbox"]').trigger('pointerleave')
      await options(wrapper)[3]!.trigger('pointermove', { pointerType: 'mouse' })
      await press(wrapper, 'ArrowUp')

      expect(options(wrapper)[1]!.attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the global shortcut is used', () => {
    it('then mod+k toggles the palette', async () => {
      const wrapper = mountPalette({ open: false })

      await flushPromises()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
      await flushPromises()

      expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    })

    it('then shortcut false disables it', async () => {
      const wrapper = mountPalette({ open: false, shortcut: false })

      await flushPromises()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true, bubbles: true }))
      await flushPromises()

      expect(wrapper.emitted('update:open')).toBeUndefined()
    })
  })

  describe('when it reopens', () => {
    it('then the search is cleared and the first option is active', async () => {
      const wrapper = mountPalette({ open: false })

      await wrapper.setProps({ open: true, search: 'docs' })
      await flushPromises()

      expect(options(wrapper)).toHaveLength(6)
      expect((input(wrapper).element as HTMLInputElement).value).toBe('')
    })
  })

  describe('when the exposed methods are used', () => {
    it('then open, close and focus work', () => {
      const wrapper = mountPalette({ open: false })
      const vm = wrapper.vm as unknown as { open: () => void, close: () => void, focus: () => void }

      vm.open()
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])

      vm.close()
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])

      expect(() => vm.focus()).not.toThrow()
    })
  })

  describe('when the trigger and item slots are given', () => {
    it('then the trigger receives open and the item slot replaces the content', async () => {
      const wrapper = mountPalette(
        { open: false },
        {
          trigger: `<template #trigger="{ open }"><button class="my-trigger" @click="open">Open</button></template>`,
        },
      )

      await wrapper.find('.my-trigger').trigger('click')

      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    })

    it('then the item slot gets the item and the active state', async () => {
      const wrapper = mountPalette({}, {
        item: `<template #item="{ item, isActive }"><span class="custom-item">{{ item.label }}-{{ isActive }}</span></template>`,
      })

      await flushPromises()

      expect(wrapper.find('.custom-item').text()).toBe('Go home-true')
    })
  })

  describe('when there are no groups', () => {
    it('then the empty text is shown', async () => {
      const wrapper = mountPalette({ groups: undefined })

      await flushPromises()

      expect(wrapper.find('.m-command-palette__empty').exists()).toBe(true)
    })
  })
})
