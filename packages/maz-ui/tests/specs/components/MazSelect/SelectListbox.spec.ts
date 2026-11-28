import SelectListbox from '@components/MazSelect/SelectListbox.vue'
import { flushPromises, mount } from '@vue/test-utils'

const options = [
  { label: 'Fruits', isOptGroup: true },
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

function mountListbox(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(SelectListbox, {
    props: {
      id: 'listbox',
      options,
      label: 'Fruits',
      getOptionId: (index: number) => `option-${index}`,
      isSelected: (option: Record<string, unknown>) => option.value === 'banana',
      ...props,
    },
    slots,
    attachTo: document.body,
  })
}

describe('given a SelectListbox', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it is rendered with an optgroup', () => {
    it('then the optgroup header and the options are listed', () => {
      const wrapper = mountListbox()

      expect(wrapper.find('.m-select-list-optgroup').text()).toBe('Fruits')
      expect(wrapper.findAll('[role="option"]').map(option => option.attributes('aria-selected'))).toEqual(['false', 'true'])
      expect(wrapper.find('[role="option"]').attributes('tabindex')).toBe('0')

      wrapper.unmount()
    })
  })

  describe('when the optgroup slot is used', () => {
    it('then it replaces the header', () => {
      const wrapper = mountListbox({}, {
        optgroup: '<template #optgroup="{ label }"><p class="group">{{ label }}</p></template>',
      })

      expect(wrapper.find('.group').text()).toBe('Fruits')

      wrapper.unmount()
    })
  })

  describe('when the focus is virtual', () => {
    it('then the options are not focusable, the active one is highlighted and a mousedown keeps the focus', async () => {
      const wrapper = mountListbox({
        virtualFocus: true,
        activeIndex: 2,
      })
      const option = wrapper.findAll('[role="option"]')[1]!

      expect(option.attributes('tabindex')).toBe('-1')
      expect(option.classes()).toContain('--is-active')

      const event = new MouseEvent('mousedown', { cancelable: true })
      option.element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)

      await option.trigger('click')

      expect(wrapper.emitted('select')?.[0]).toEqual([options[2], 2])

      wrapper.unmount()
    })
  })

  describe('when it scrolls to an option', () => {
    it('then the option is scrolled into view, or centered and focused', () => {
      vi.useFakeTimers()
      const wrapper = mountListbox()
      const option = wrapper.findAll('[role="option"]')[0]!.element as HTMLElement
      const scrollWrapper = wrapper.find('[role="listbox"]').element as HTMLElement
      option.scrollIntoView = vi.fn()
      scrollWrapper.scrollTo = vi.fn()

      const vm = wrapper.vm as unknown as { scrollToIndex: (index: number, options?: { center?: boolean, focus?: boolean }) => void }

      vm.scrollToIndex(1)

      expect(option.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' })

      vm.scrollToIndex(1, {
        center: true,
        focus: true,
      })
      vi.advanceTimersByTime(100)

      expect(scrollWrapper.scrollTo).toHaveBeenCalled()
      expect(document.activeElement).toBe(option)

      vm.scrollToIndex(0)

      wrapper.unmount()
    })
  })

  describe('when an option is selected in a single listbox', () => {
    it('then the selected option has a check icon and the others have none', async () => {
      const wrapper = mountListbox()

      await vi.dynamicImportSettled()
      await flushPromises()

      const items = wrapper.findAll('.m-select-list-item')

      expect(items[0].classes()).not.toContain('--is-selected')
      expect(items[0].find('.m-select-list-item__check').exists()).toBe(false)
      expect(items[1].classes()).toContain('--is-selected')
      expect(items[1].find('.m-select-list-item__check').exists()).toBe(true)
      expect(items[1].find('.m-select-list-item__check').attributes('aria-hidden')).toBe('true')

      wrapper.unmount()
    })
  })

  describe('when an option is selected in a multiple listbox', () => {
    it('then the checkbox marks it and there is no check icon', async () => {
      const wrapper = mountListbox({ multiple: true })

      await vi.dynamicImportSettled()
      await flushPromises()

      expect(wrapper.find('.m-select-list-item.--is-selected').exists()).toBe(true)
      expect(wrapper.find('.m-select-list-item__check').exists()).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the highlight is placed on an option', () => {
    it('then it takes the position and the size of the option', async () => {
      const wrapper = mountListbox({ virtualFocus: true, activeIndex: 1 })
      const option = wrapper.find('#option-1').element as HTMLElement

      Object.defineProperties(option, {
        offsetLeft: { value: 12, configurable: true },
        offsetTop: { value: 40, configurable: true },
        offsetWidth: { value: 180, configurable: true },
        offsetHeight: { value: 36, configurable: true },
      })

      await wrapper.setProps({ activeIndex: 2 })
      await wrapper.setProps({ activeIndex: 1 })
      await flushPromises()

      const style = wrapper.find('.m-select-list__highlight').attributes('style')

      expect(style).toContain('translate(12px, 40px)')
      expect(style).toContain('width: 180px')
      expect(style).toContain('height: 36px')

      wrapper.unmount()
    })
  })

  describe('when there is no option', () => {
    it('then the no results state is displayed', () => {
      const wrapper = mountListbox({ options: [] })

      expect(wrapper.find('.m-select-list__no-results').exists()).toBe(true)

      wrapper.unmount()
    })
  })
})
