import MazDropdown from '@components/MazDropdown.vue'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

function mountDropdown() {
  return mount(MazDropdown, {
    props: {
      items: [{ label: 'Settings', onClick: vi.fn() }],
      trigger: 'click',
    },
    slots: { default: 'Menu' },
    attachTo: document.body,
    global: { stubs: { teleport: true, MazLink: true } },
  })
}

function press(key: string) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  document.dispatchEvent(event)
  return event
}

describe('given an open dropdown and the focus on a field outside of it', () => {
  let wrapper: ReturnType<typeof mountDropdown>
  let field: HTMLInputElement

  beforeEach(async () => {
    wrapper = mountDropdown()
    await wrapper.find('.m-popover-trigger').trigger('click')
    await vi.dynamicImportSettled()
    field = document.createElement('input')
    document.body.append(field)
    field.focus()
  })

  afterEach(() => {
    wrapper.unmount()
    field.remove()
  })

  describe('when ArrowDown is pressed', () => {
    it('then the page keeps the key', () => {
      expect(press('ArrowDown').defaultPrevented).toBe(false)
    })
  })

  describe('when Enter is pressed', () => {
    it('then the field keeps the key', () => {
      expect(press('Enter').defaultPrevented).toBe(false)
    })
  })
})

describe('given an open dropdown with a custom item and the focus on it', () => {
  it('then Enter clicks the item', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MazDropdown, {
      props: { items: [{ label: 'Settings' }], trigger: 'click' },
      slots: {
        default: 'Menu',
        menuitem: () => h('div', { tabindex: 0, class: 'custom-item', onClick }, 'Custom'),
      },
      attachTo: document.body,
      global: { stubs: { teleport: true, MazLink: true } },
    })
    await wrapper.find('.m-popover-trigger').trigger('click')
    await vi.dynamicImportSettled()
    wrapper.find<HTMLElement>('.custom-item').element.focus()

    expect(press('Enter').defaultPrevented).toBe(true)
    expect(onClick).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})

describe('given an open dropdown and the focus on one of its items', () => {
  let wrapper: ReturnType<typeof mountDropdown>

  beforeEach(async () => {
    wrapper = mountDropdown()
    await wrapper.find('.m-popover-trigger').trigger('click')
    await vi.dynamicImportSettled()
    wrapper.find<HTMLElement>('.menuitem').element.focus()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('when ArrowDown is pressed', () => {
    it('then the dropdown handles the key', () => {
      expect(press('ArrowDown').defaultPrevented).toBe(true)
    })
  })
})
