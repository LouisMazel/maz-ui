import { mount } from '@vue/test-utils'
import MazDropdown from '@components/MazDropdown.vue'
import MazBtn from '@components/MazBtn.vue'
import { sleep } from '@modules/helpers'

describe('MazDropdown', () => {
  test('renders a dropdown button with the provided label', () => {
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        items: [{ label: 'Menu 1', action: vi.fn() }],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)
    expect(dropdownButton.exists()).toBe(true)
    expect(dropdownButton.text()).toBe('Dropdown Label')
  })

  test('toggles the dropdown when the button is focused', async () => {
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        trigger: 'click',
        items: [{ label: 'Menu 1', action: vi.fn() }],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.dropdownOpen).toBe(false)

    await dropdownButton.trigger('click')
    expect(wrapper.vm.dropdownOpen).toBe(true)

    await dropdownButton.trigger('click')
    expect(wrapper.vm.dropdownOpen).toBe(false)
  })

  test('toggles the dropdown when the button is clicked', async () => {
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        trigger: 'both',
        items: [{ label: 'Menu 1', action: vi.fn() }],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.dropdownOpen).toBe(false)

    await dropdownButton.trigger('focus')
    expect(wrapper.vm.dropdownOpen).toBe(true)

    await dropdownButton.trigger('blur')
    await sleep(200)
    expect(wrapper.vm.dropdownOpen).toBe(false)
  })

  test('emits "update:open" event when the dropdown is toggled', async () => {
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        items: [{ label: 'Menu 1', action: vi.fn() }],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)

    await dropdownButton.trigger('focus')

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')[0]).toEqual([true])

    await dropdownButton.trigger('blur')

    await sleep(200)

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')[1]).toEqual([false])
  })

  test('closes the dropdown when a menu item is clicked', async () => {
    const action = vi.fn()
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        items: [{ label: 'Menu 1', action }],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)

    await dropdownButton.trigger('focus')
    expect(wrapper.vm.dropdownOpen).toBe(true)

    const menuItems = wrapper.findAll('.menuitem')
    await menuItems[0].trigger('click')

    expect(action).toHaveBeenCalledTimes(1)

    await sleep(200)

    expect(wrapper.vm.dropdownOpen).toBe(false)
  })

  test('navigates through menu items using the keyboard', async () => {
    const wrapper = mount(MazDropdown, {
      slots: {
        default: 'Dropdown Label',
        menuitem: '<div class="menuitem">Menu Item 1</div><div class="menuitem">Menu Item 2</div>',
      },
      props: {
        items: [
          { label: 'Menu 1', action: vi.fn() },
          { label: 'Menu 2', action: vi.fn() },
        ],
      },
    })

    const dropdownButton = wrapper.findComponent(MazBtn)

    await dropdownButton.trigger('focus')
    expect(wrapper.vm.dropdownOpen).toBe(true)

    // Simulate ArrowDown key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(wrapper.vm.keyboardSelectedIndex).toBe(0)

    // Simulate ArrowUp key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(wrapper.vm.keyboardSelectedIndex).toBe(1)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(wrapper.vm.keyboardSelectedIndex).toBe(0)
  })
})
