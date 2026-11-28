import MazDropdown from '@components/MazDropdown.vue'
import { mount } from '@vue/test-utils'

const items = [
  { label: 'Alpha', onClick: vi.fn() },
  { label: 'Beta', onClick: vi.fn() },
  { label: 'Gamma', onClick: vi.fn(), disabled: true },
  { label: 'Delta', onClick: vi.fn() },
]

async function mountOpenDropdown() {
  const wrapper = mount(MazDropdown, {
    props: { items, trigger: 'click' },
    slots: { default: 'Menu' },
    attachTo: document.body,
    global: { stubs: { teleport: true, MazLink: true } },
  })

  await wrapper.find('.m-popover-trigger').trigger('click')
  await vi.dynamicImportSettled()
  await wrapper.vm.$nextTick()

  return wrapper
}

function menuItems(wrapper: Awaited<ReturnType<typeof mountOpenDropdown>>) {
  return wrapper.findAll<HTMLElement>('.menuitem')
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given an open dropdown', () => {
  describe('when the pointer enters an item', () => {
    it('then a highlight is displayed and it leaves with the pointer', async () => {
      const wrapper = await mountOpenDropdown()
      const menu = wrapper.get('.m-dropdown__menu')

      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(false)

      await menuItems(wrapper)[0].trigger('pointerover', { pointerType: 'mouse' })
      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(true)
      expect(wrapper.get('.m-dropdown__highlight').attributes('aria-hidden')).toBe('true')

      await menu.trigger('pointerleave')
      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(false)
    })
  })

  describe('when the pointer is a touch', () => {
    it('then there is no highlight', async () => {
      const wrapper = await mountOpenDropdown()

      await menuItems(wrapper)[0].trigger('pointerover', { pointerType: 'touch' })

      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(false)
    })
  })

  describe('when the pointer enters a disabled item', () => {
    it('then there is no highlight', async () => {
      const wrapper = await mountOpenDropdown()

      await menuItems(wrapper)[2].trigger('pointerover', { pointerType: 'mouse' })

      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(false)
    })
  })

  describe('when a key is pressed in the menu', () => {
    it('then the highlight leaves, the focus style takes over', async () => {
      const wrapper = await mountOpenDropdown()
      const rows = menuItems(wrapper)

      await rows[0].trigger('pointerover', { pointerType: 'mouse' })
      rows[0].element.focus()
      await rows[0].trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.find('.m-dropdown__highlight').exists()).toBe(false)
    })
  })

  describe('when the arrows, Home and End are pressed on an item', () => {
    it('then the focus moves between the enabled items and loops', async () => {
      const wrapper = await mountOpenDropdown()
      const rows = menuItems(wrapper)

      rows[0].element.focus()
      await rows[0].trigger('keydown', { key: 'ArrowDown' })
      expect(document.activeElement).toBe(rows[1].element)

      await rows[1].trigger('keydown', { key: 'ArrowDown' })
      expect(document.activeElement).toBe(rows[3].element)

      await rows[3].trigger('keydown', { key: 'ArrowDown' })
      expect(document.activeElement).toBe(rows[0].element)

      await rows[0].trigger('keydown', { key: 'End' })
      expect(document.activeElement).toBe(rows[3].element)

      await rows[3].trigger('keydown', { key: 'Home' })
      expect(document.activeElement).toBe(rows[0].element)

      await rows[0].trigger('keydown', { key: 'ArrowUp' })
      expect(document.activeElement).toBe(rows[3].element)
    })
  })

  describe('when letters are typed on an item', () => {
    it('then the focus goes to the item that starts with them', async () => {
      const wrapper = await mountOpenDropdown()
      const rows = menuItems(wrapper)

      rows[0].element.focus()
      await rows[0].trigger('keydown', { key: 'd' })

      expect(document.activeElement).toBe(rows[3].element)
    })
  })

  describe('when ArrowDown is pressed on the trigger', () => {
    it('then the focus goes to the first item', async () => {
      const wrapper = await mountOpenDropdown()
      const trigger = wrapper.get<HTMLElement>('.m-dropdown__wrapper button')

      trigger.element.focus()
      await trigger.trigger('keydown', { key: 'ArrowDown' })

      expect(document.activeElement).toBe(menuItems(wrapper)[0].element)
    })
  })

  describe('when Enter is pressed on an item', () => {
    it('then the item is clicked', async () => {
      const onClick = vi.fn()
      const wrapper = mount(MazDropdown, {
        props: { items: [{ label: 'Run', onClick }], trigger: 'click' },
        slots: { default: 'Menu' },
        attachTo: document.body,
        global: { stubs: { teleport: true, MazLink: true } },
      })

      await wrapper.find('.m-popover-trigger').trigger('click')
      await vi.dynamicImportSettled()
      const row = wrapper.get<HTMLElement>('.menuitem')
      row.element.focus()

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      row.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
      expect(onClick).toHaveBeenCalled()
    })
  })
})

describe('given a closed dropdown', () => {
  describe('when ArrowDown is pressed on the trigger', () => {
    it('then the page keeps the key', async () => {
      const wrapper = mount(MazDropdown, {
        props: { items, trigger: 'click' },
        slots: { default: 'Menu' },
        attachTo: document.body,
        global: { stubs: { teleport: true, MazLink: true } },
      })
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })

      wrapper.get('.m-dropdown__wrapper button').element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })
  })
})
