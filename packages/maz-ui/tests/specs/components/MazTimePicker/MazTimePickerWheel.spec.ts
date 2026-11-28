import MazTimePickerWheel from '@components/MazTimePicker/MazTimePickerWheel.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'

const reduced = ref(false)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

const items = Array.from({ length: 10 }, (_, index) => ({ key: index, label: String(index), disabled: index === 3 }))

function mountWheel(props: Record<string, unknown> = {}) {
  return mount(MazTimePickerWheel, { props: { items, label: 'Hours', modelValue: 5, ...props } })
}

describe('given a MazTimePickerWheel', () => {
  beforeEach(() => {
    reduced.value = false
    Element.prototype.scrollTo = vi.fn(function scrollTo(this: Element, options: ScrollToOptions) {
      this.scrollTop = options.top ?? 0
    }) as never
  })

  describe('when it renders', () => {
    it('then it is a listbox of options with the selected one', () => {
      const wrapper = mountWheel()

      expect(wrapper.find('[role="listbox"]').attributes('aria-label')).toBe('Hours')
      expect(wrapper.findAll('[role="option"]')).toHaveLength(10)
      expect(wrapper.findAll('[aria-selected="true"]')).toHaveLength(1)
      expect(wrapper.find('[role="listbox"]').attributes('aria-activedescendant')).toBe(wrapper.findAll('[role="option"]')[5]!.attributes('id'))
    })

    it('then it scrolls to the selected option', () => {
      const wrapper = mountWheel()

      expect((wrapper.find('[role="listbox"]').element as HTMLElement).scrollTop).toBe(5 * 36)
    })

    it('then it marks the disabled options', () => {
      const wrapper = mountWheel()

      expect(wrapper.findAll('[role="option"]')[3]!.attributes('aria-disabled')).toBe('true')
    })

    it('then it has no active descendant without a value', () => {
      const wrapper = mountWheel({ modelValue: undefined })

      expect(wrapper.find('[role="listbox"]').attributes('aria-activedescendant')).toBeUndefined()
    })
  })

  describe('when an option is clicked', () => {
    it('then it emits its key', async () => {
      const wrapper = mountWheel()

      await wrapper.findAll('[role="option"]')[7]!.trigger('click')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([7])
    })

    it('then a disabled option is ignored', async () => {
      const wrapper = mountWheel()

      await wrapper.findAll('[role="option"]')[3]!.trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then the current option emits nothing', async () => {
      const wrapper = mountWheel()

      await wrapper.findAll('[role="option"]')[5]!.trigger('click')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then it does nothing when disabled', async () => {
      const wrapper = mountWheel({ disabled: true })

      await wrapper.findAll('[role="option"]')[7]!.trigger('click')
      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then it scrolls without animation with reduced motion', async () => {
      reduced.value = true
      const wrapper = mountWheel()

      await wrapper.findAll('[role="option"]')[7]!.trigger('click')

      expect(Element.prototype.scrollTo).toHaveBeenLastCalledWith({ top: 7 * 36, behavior: 'instant' })
    })
  })

  describe('when keys are pressed', () => {
    async function press(key: string, props: Record<string, unknown> = {}) {
      const wrapper = mountWheel(props)

      await wrapper.find('[role="listbox"]').trigger('keydown', { key })

      return wrapper.emitted('update:model-value')?.[0]
    }

    it('then ArrowDown goes to the next option', async () => {
      expect(await press('ArrowDown')).toEqual([6])
    })

    it('then ArrowUp goes to the previous option', async () => {
      expect(await press('ArrowUp')).toEqual([4])
    })

    it('then ArrowUp skips the disabled option', async () => {
      expect(await press('ArrowUp', { modelValue: 4 })).toEqual([2])
    })

    it('then PageDown moves by 5 and stays inside the list', async () => {
      expect(await press('PageDown')).toEqual([9])
    })

    it('then PageUp moves by 5', async () => {
      expect(await press('PageUp', { modelValue: 9 })).toEqual([4])
    })

    it('then Home goes to the first option', async () => {
      expect(await press('Home')).toEqual([0])
    })

    it('then End goes to the last option', async () => {
      expect(await press('End')).toEqual([9])
    })

    it('then the first key press selects the first moves from the centered option without a value', async () => {
      expect(await press('ArrowDown', { modelValue: undefined })).toEqual([1])
    })

    it('then Enter emits commit', async () => {
      const wrapper = mountWheel()

      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('commit')).toHaveLength(1)
    })

    it('then another key does nothing', async () => {
      expect(await press('x')).toBeUndefined()
    })

    it('then the last option does not move further', async () => {
      expect(await press('ArrowDown', { modelValue: 9 })).toBeUndefined()
    })

    it('then it goes back when nothing is enabled after', async () => {
      const wrapper = mountWheel({ modelValue: 1, items: [{ key: 0, label: '0' }, { key: 1, label: '1' }, { key: 2, label: '2', disabled: true }] })

      await wrapper.find('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when the user scrolls', () => {
    it('then the settled option is emitted after a delay', async () => {
      vi.useFakeTimers()
      const wrapper = mountWheel()
      const list = wrapper.find('[role="listbox"]')

      ;(list.element as HTMLElement).scrollTop = 7 * 36
      await list.trigger('scroll')
      expect(wrapper.findAll('[role="option"]')[7]!.classes()).toContain('--centered')
      expect(wrapper.emitted('update:model-value')).toBeUndefined()

      vi.advanceTimersByTime(200)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([7])
      vi.useRealTimers()
    })

    it('then scrollend settles at once', async () => {
      const wrapper = mountWheel()
      const list = wrapper.find('[role="listbox"]')

      ;(list.element as HTMLElement).scrollTop = 8 * 36
      await list.trigger('scrollend')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([8])
    })

    it('then a disabled option sends the wheel back to the selected one', async () => {
      const wrapper = mountWheel()
      const list = wrapper.find('[role="listbox"]')

      ;(list.element as HTMLElement).scrollTop = 3 * 36
      await list.trigger('scrollend')

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
      expect((list.element as HTMLElement).scrollTop).toBe(5 * 36)
    })

    it('then the scroll that follows a programmatic move is not emitted', async () => {
      const wrapper = mountWheel()

      await wrapper.findAll('[role="option"]')[7]!.trigger('click')
      wrapper.emitted('update:model-value')!.length = 0
      ;(wrapper.find('[role="listbox"]').element as HTMLElement).scrollTop = 6 * 36
      await wrapper.find('[role="listbox"]').trigger('scrollend')

      expect(wrapper.emitted('update:model-value')).toHaveLength(0)
    })
  })

  describe('when the value changes from the outside', () => {
    it('then the wheel scrolls to it', async () => {
      const wrapper = mountWheel()

      await wrapper.setProps({ modelValue: 8 })
      await flushPromises()

      expect((wrapper.find('[role="listbox"]').element as HTMLElement).scrollTop).toBe(8 * 36)
    })
  })
})
