import MazContextMenu from '@components/MazContextMenu.vue'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('@maz-ui/translations/composables/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => key === 'contextMenu.label' ? 'Context menu' : key,
    locale: 'en',
  }),
}))

const rename = vi.fn()
const remove = vi.fn()
const duplicate = vi.fn()

function getItems() {
  return [
    { label: 'Rename', shortcut: 'F2', action: rename },
    { label: 'Duplicate', onClick: duplicate },
    { separator: true },
    { label: 'Locked', disabled: true },
    { label: 'Delete', color: 'destructive' as const, action: remove },
  ]
}

function mountMenu(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazContextMenu, {
    props: { items: getItems(), ...props },
    slots: { default: '<button type="button" class="zone">Zone</button>', ...slots },
    attachTo: document.body,
  })
}

async function open(wrapper: ReturnType<typeof mountMenu>, x = 40, y = 60) {
  await wrapper.trigger('contextmenu', { clientX: x, clientY: y })
  await flushPromises()
}

function menuItems(wrapper: ReturnType<typeof mountMenu>) {
  return wrapper.findAll('[role="menuitem"]')
}

describe('given a MazContextMenu', () => {
  beforeEach(() => {
    rename.mockClear()
    remove.mockClear()
    duplicate.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('when it renders', () => {
    it('then the zone is shown and the menu is closed', () => {
      const wrapper = mountMenu()

      expect(wrapper.find('.zone').exists()).toBe(true)
      expect(menuItems(wrapper)).toHaveLength(0)
    })
  })

  describe('when the zone is right clicked', () => {
    it('then the native menu is prevented and the menu opens', async () => {
      const wrapper = mountMenu()
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 20 })

      wrapper.element.dispatchEvent(event)
      await flushPromises()

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(menuItems(wrapper)).toHaveLength(4)
    })

    it('then the panel has the menu role and a name', async () => {
      const wrapper = mountMenu()

      await open(wrapper)

      const panel = wrapper.find('[role="menu"]')

      expect(panel.exists()).toBe(true)
      expect(panel.attributes('aria-labelledby')).toBeTruthy()
      expect(wrapper.find('[role="separator"]').exists()).toBe(true)
      expect(wrapper.find('.m-context-menu__menu').attributes('role')).toBe('none')
    })

    it('then the label prop names the menu', async () => {
      const wrapper = mountMenu({ label: 'File actions' })

      await open(wrapper)

      expect(wrapper.text()).toContain('File actions')
    })

    it('then the shortcut is rendered', async () => {
      const wrapper = mountMenu()

      await open(wrapper)

      expect(wrapper.find('.m-context-menu__kbd').text()).toBe('F2')
    })

    it('then a second right click while open keeps it open and prevents the native menu', async () => {
      const wrapper = mountMenu()

      await open(wrapper)

      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })

      wrapper.element.dispatchEvent(event)
      await flushPromises()

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then the menu container receives the focus', async () => {
      const wrapper = mountMenu()

      await open(wrapper)

      expect(document.activeElement).toBe(wrapper.find('.m-context-menu__menu').element)
    })
  })

  describe('when the menu is disabled', () => {
    it('then the native menu stays available', async () => {
      const wrapper = mountMenu({ disabled: true })
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })

      wrapper.element.dispatchEvent(event)
      await flushPromises()

      expect(event.defaultPrevented).toBe(false)
      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then the keyboard does not open it', async () => {
      const wrapper = mountMenu({ disabled: true })

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then a long press does not open it', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu({ disabled: true })

      await wrapper.trigger('pointerdown', { pointerType: 'touch' })
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
    })
  })

  describe('when the keyboard opens the menu', () => {
    it('then the ContextMenu key opens it and focuses the first item', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(document.activeElement).toBe(menuItems(wrapper)[0]!.element)
    })

    it('then Shift+F10 opens it', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'F10', shiftKey: true })
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then F10 alone does nothing', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'F10' })
      await flushPromises()

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then the contextmenu event fired right after the key does not reopen it', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()
      await wrapper.trigger('contextmenu')
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then the key on the wrapper itself uses the wrapper box', async () => {
      const wrapper = mountMenu()

      wrapper.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true }))
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })
  })

  describe('when navigating in the menu', () => {
    it('then the arrows move the focus and skip the disabled item', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()

      const items = menuItems(wrapper)

      await items[0]!.trigger('keydown', { key: 'ArrowDown' })
      expect(document.activeElement).toBe(items[1]!.element)

      await items[1]!.trigger('keydown', { key: 'ArrowDown' })
      expect(document.activeElement).toBe(items[3]!.element)

      await items[3]!.trigger('keydown', { key: 'ArrowUp' })
      expect(document.activeElement).toBe(items[1]!.element)
    })

    it('then ArrowDown on the container focuses the first item', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'ArrowDown' })

      expect(document.activeElement).toBe(menuItems(wrapper)[0]!.element)
    })

    it('then ArrowUp on the container focuses the last item', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'ArrowUp' })

      expect(document.activeElement).toBe(menuItems(wrapper).at(-1)!.element)
    })

    it('then Home and End reach the edges', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()

      const menu = wrapper.find('.m-context-menu__menu')

      await menu.trigger('keydown', { key: 'End' })
      expect(document.activeElement).toBe(menuItems(wrapper).at(-1)!.element)

      await menu.trigger('keydown', { key: 'Home' })
      expect(document.activeElement).toBe(menuItems(wrapper)[0]!.element)
    })

    it('then typing a letter focuses the matching item', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'd' })

      expect(document.activeElement?.textContent).toContain('Duplicate')
    })

    it('then Tab closes the menu', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'Tab' })
      await flushPromises()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then Enter activates the focused item and closes the menu', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()
      await menuItems(wrapper)[0]!.trigger('keydown', { key: 'Enter' })
      await flushPromises()

      expect(rename).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'Rename' })
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then Space activates the focused item', async () => {
      const wrapper = mountMenu()

      await wrapper.find('.zone').trigger('keydown', { key: 'ContextMenu' })
      await flushPromises()
      await menuItems(wrapper)[1]!.trigger('keydown', { key: ' ' })
      await flushPromises()

      expect(duplicate).toHaveBeenCalledTimes(1)
    })

    it('then Enter on the container activates nothing', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'Enter' })

      expect(rename).not.toHaveBeenCalled()
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('when an item is clicked', () => {
    it('then its action runs and the menu closes', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      const item = menuItems(wrapper)[3]!

      expect(item.classes()).toContain('--text-destructive')

      await item.trigger('click')
      await flushPromises()

      expect(remove).toHaveBeenCalledTimes(1)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then an item without action only emits select', async () => {
      const wrapper = mountMenu({ items: [{ label: 'Plain' }] })

      await open(wrapper)
      await menuItems(wrapper)[0]!.trigger('click')
      await flushPromises()

      expect(wrapper.emitted('select')).toHaveLength(1)
    })

    it('then a disabled item does nothing', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await menuItems(wrapper)[2]!.trigger('click')

      expect(wrapper.emitted('select')).toBeUndefined()
    })
  })

  describe('when the pointer moves over the items', () => {
    it('then the highlight follows an enabled item', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await menuItems(wrapper)[0]!.trigger('pointerover', { pointerType: 'mouse' })
      await flushPromises()

      expect(wrapper.find('.m-context-menu__highlight').exists()).toBe(true)

      await wrapper.find('.m-context-menu__menu').trigger('pointerleave')

      expect(wrapper.find('.m-context-menu__highlight').exists()).toBe(false)
    })

    it('then a disabled item has no highlight', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await menuItems(wrapper)[2]!.trigger('pointerover', { pointerType: 'mouse' })

      expect(wrapper.find('.m-context-menu__highlight').exists()).toBe(false)
    })

    it('then a touch pointer is ignored', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await menuItems(wrapper)[0]!.trigger('pointerover', { pointerType: 'touch' })

      expect(wrapper.find('.m-context-menu__highlight').exists()).toBe(false)
    })

    it('then the keyboard clears the highlight', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      await menuItems(wrapper)[0]!.trigger('pointerover', { pointerType: 'mouse' })
      await wrapper.find('.m-context-menu__menu').trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.find('.m-context-menu__highlight').exists()).toBe(false)
    })
  })

  describe('when the menu closes', () => {
    it('then the focus returns to the element that had it', async () => {
      const wrapper = mountMenu()
      const zone = wrapper.find('.zone').element as HTMLElement

      zone.focus()
      await zone.dispatchEvent(new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true }))
      await flushPromises()

      expect(document.activeElement).not.toBe(zone)

      await menuItems(wrapper)[1]!.trigger('click')
      await flushPromises()

      expect(document.activeElement).toBe(zone)
    })

    it('then the exposed close closes it', async () => {
      const wrapper = mountMenu()

      await open(wrapper)
      ;(wrapper.vm as unknown as { close: () => void }).close()
      await flushPromises()

      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('then the exposed openAt opens it at a point', async () => {
      const wrapper = mountMenu()

      ;(wrapper.vm as unknown as { openAt: (x: number, y: number) => void }).openAt(5, 6)
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })
  })

  describe('when a long press is made on a touch screen', () => {
    it('then the menu opens after 500 ms and the next click is swallowed', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 })
      vi.advanceTimersByTime(500)
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)

      const click = new MouseEvent('click', { bubbles: true, cancelable: true })

      wrapper.find('.zone').element.dispatchEvent(click)
      expect(click.defaultPrevented).toBe(true)

      const next = new MouseEvent('click', { bubbles: true, cancelable: true })

      wrapper.find('.zone').element.dispatchEvent(next)
      expect(next.defaultPrevented).toBe(false)
    })

    it('then moving far cancels the press', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 })
      await wrapper.trigger('pointermove', { clientX: 60, clientY: 10 })
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then a small move keeps the press', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 })
      await wrapper.trigger('pointermove', { clientX: 12, clientY: 11 })
      vi.advanceTimersByTime(600)
      await flushPromises()

      expect(wrapper.emitted('open')).toHaveLength(1)
    })

    it('then releasing early cancels the press', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 })
      await wrapper.trigger('pointerup')
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then a mouse pointer does not start a press', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'mouse' })
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then longPress false disables it', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu({ longPress: false })

      await wrapper.trigger('pointerdown', { pointerType: 'touch' })
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
      expect(wrapper.classes()).not.toContain('--long-press')
    })

    it('then unmounting cancels the press', async () => {
      vi.useFakeTimers()

      const wrapper = mountMenu()

      await wrapper.trigger('pointerdown', { pointerType: 'touch', clientX: 1, clientY: 1 })
      wrapper.unmount()
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('open')).toBeUndefined()
    })

    it('then a move without a press is ignored', async () => {
      const wrapper = mountMenu()

      await wrapper.trigger('pointermove', { clientX: 1, clientY: 1 })

      expect(wrapper.emitted('open')).toBeUndefined()
    })
  })

  describe('when the item slot is given', () => {
    it('then it replaces the default item', async () => {
      const wrapper = mount(MazContextMenu, {
        props: { items: [{ label: 'Custom' }] },
        slots: {
          default: '<span class="zone">Zone</span>',
          item: `<template #item="{ item }"><b class="slot-item" role="menuitem">{{ item.label }}</b></template>`,
        },
        attachTo: document.body,
      })

      await open(wrapper)

      expect(wrapper.find('.slot-item').text()).toBe('Custom')
    })
  })
})
