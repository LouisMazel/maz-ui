import MazBtn from '@components/MazBtn.vue'
import MazDropdown from '@components/MazDropdown.vue'
import { sleep } from '@helpers/sleep'
import { mount, type VueWrapper } from '@vue/test-utils'
import { RouterLink } from 'vue-router'

describe('mazDropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDropdown>>

  const actionSpy = vi.fn()

  beforeEach(async () => {
    wrapper = mount(MazDropdown, {
      attachTo: document.body,
      slots: {
        default: 'Dropdown Label',
      },
      props: {
        items: [{ label: 'Menu 1', action: actionSpy }],
      },
      global: {
        components: {
          RouterLink,
        },
      },
    })

    await vi.dynamicImportSettled()
  })

  it('renders a dropdown button with the provided label', () => {
    const dropdownButton = wrapper.findComponent(MazBtn)

    expect(dropdownButton.exists()).toBe(true)
    expect(dropdownButton.text()).toBe('Dropdown Label')
  })

  it('toggles the dropdown when the button is clicked', async () => {
    await wrapper.setProps({ trigger: 'click' })

    await vi.dynamicImportSettled()

    const dropdownButton = wrapper.find('[role="button"]')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeFalsy()

    await dropdownButton.trigger('click')
    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeTruthy()

    await dropdownButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeFalsy()
  })

  it('toggles the dropdown when the button is focused or blurred', async () => {
    await wrapper.setProps({ trigger: 'both' })

    await vi.dynamicImportSettled()

    const dropdownButton = wrapper.find('[role="button"]')

    await wrapper.vm.$nextTick()

    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeFalsy()

    await dropdownButton.trigger('focus')
    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeTruthy()

    await dropdownButton.trigger('blur')
    await sleep(200)
    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBeFalsy()
  })

  it('emits "update:open" event when the dropdown is toggled', async () => {
    await vi.dynamicImportSettled()

    const dropdownButton = wrapper.find('[role="button"]')

    await dropdownButton.trigger('focus')

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])

    await dropdownButton.trigger('blur')

    await sleep(200)

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
  })

  it('closes the dropdown when a menu item is clicked', async () => {
    await vi.dynamicImportSettled()

    const dropdownButton = wrapper.find('[role="button"]')

    await dropdownButton.trigger('focus')
    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBe(true)

    const menuItems = wrapper.findAll('.menuitem')
    await menuItems[0].trigger('click')

    expect(actionSpy).toHaveBeenCalledTimes(1)

    await sleep(200)

    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBe(false)
  })

  it('navigates through menu items using the keyboard', async () => {
    await wrapper.setProps({
      items: [
        { label: 'Menu 1', action: vi.fn() },
        { label: 'Menu 2', action: vi.fn() },
      ],
    })

    await vi.dynamicImportSettled()

    const dropdownButton = wrapper.find('[role="button"]')

    await dropdownButton.trigger('focus')

    expect(wrapper.find('[aria-label="Menu"]').isVisible()).toBe(true)

    // Simulate ArrowDown key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.menuitem').at(0)?.classes()).toStrictEqual(
      expect.arrayContaining(['--is-keyboard-selected']),
    )

    // Simulate ArrowUp key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.menuitem').at(1)?.classes()).toStrictEqual(
      expect.arrayContaining(['--is-keyboard-selected']),
    )

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.menuitem').at(0)?.classes()).toStrictEqual(
      expect.arrayContaining(['--is-keyboard-selected']),
    )
  })
})
