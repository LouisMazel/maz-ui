import type { MazSelectProps } from '@components/MazSelect.vue'
import MazSelect from '@components/MazSelect.vue'
import SelectListbox from '@components/MazSelect/SelectListbox.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { flushPromises, mount } from '@vue/test-utils'

beforeEach(() => {
  vi.mocked(useTranslations).mockReturnValue({
    t: (key: string) => key,
    locale: { value: 'en' },
  } as unknown as ReturnType<typeof useTranslations>)
})

const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]

async function mountSelect(props: Partial<MazSelectProps> = {}) {
  const wrapper = mount(MazSelect, {
    props: { options, search: true, ...props },
    attachTo: document.body,
    global: { stubs: { teleport: true } },
  })

  await vi.dynamicImportSettled()
  await flushPromises()

  return wrapper
}

function mountListbox(props: Record<string, unknown> = {}) {
  return mount(SelectListbox, {
    props: {
      id: 'list',
      options,
      label: 'List',
      getOptionId: (index: number) => `option-${index}`,
      isSelected: () => false,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('given a MazSelect with the search', () => {
  describe('when a query matches an option', () => {
    it('then the matched letters are underlined', async () => {
      const wrapper = await mountSelect({ open: true })

      ;(wrapper.vm as unknown as { searchQuery: string }).searchQuery = 'ban'
      await flushPromises()

      const marks = wrapper.findAll('.m-select-list-mark')

      expect(marks.length).toBeGreaterThan(0)
      expect(marks.map(mark => mark.text()).join('')).toBe('Ban')
      wrapper.unmount()
    })
  })

  describe('when there is no query', () => {
    it('then no letter is underlined', async () => {
      const wrapper = await mountSelect({ open: true })

      expect(wrapper.find('.m-select-list-mark').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when a custom search function is used', () => {
    it('then no letter is underlined', async () => {
      const wrapper = await mountSelect({ open: true, searchFunction: () => options })

      ;(wrapper.vm as unknown as { searchQuery: string }).searchQuery = 'ban'
      await flushPromises()

      expect(wrapper.find('.m-select-list-mark').exists()).toBe(false)
      wrapper.unmount()
    })
  })
})

describe('given a listbox', () => {
  describe('when it is rendered', () => {
    it('then the highlight is hidden and not exposed to assistive technologies', async () => {
      const wrapper = mountListbox()

      await flushPromises()

      const highlight = wrapper.find('.m-select-list__highlight')

      expect(highlight.attributes('aria-hidden')).toBe('true')
      expect(highlight.attributes('style')).toContain('opacity: 0')
      wrapper.unmount()
    })

    it('then the options animate their entrance', async () => {
      const wrapper = mountListbox()

      await flushPromises()

      expect(wrapper.find('.m-select-list__scroll-wrapper').classes()).toContain('--entering')
      wrapper.unmount()
    })
  })

  describe('when the pointer moves over options', () => {
    it('then the highlight shows, slides to the next option and hides on leave', async () => {
      const wrapper = mountListbox()

      await flushPromises()

      const items = wrapper.findAll('.m-select-list-item')
      const highlight = wrapper.find('.m-select-list__highlight')

      await items[0]!.trigger('pointerover')
      await flushPromises()

      expect(highlight.attributes('style')).toContain('opacity: 1')
      expect(highlight.attributes('style')).toContain('transition-property: opacity')

      await items[1]!.trigger('pointerover')
      await flushPromises()

      expect(highlight.attributes('style')).toContain('transition-property: transform, opacity')

      await wrapper.find('.m-select-list__scroll-wrapper').trigger('pointerleave')
      await flushPromises()

      expect(highlight.attributes('style')).toContain('opacity: 0')
      wrapper.unmount()
    })

    it('then a touch pointer does not highlight', async () => {
      const wrapper = mountListbox()

      await flushPromises()
      await wrapper.findAll('.m-select-list-item')[0]!.trigger('pointerover', { pointerType: 'touch' })
      await flushPromises()

      expect(wrapper.find('.m-select-list__highlight').attributes('style')).toContain('opacity: 0')
      wrapper.unmount()
    })
  })

  describe('when the focus moves with the keyboard', () => {
    it('then the highlight jumps without transition', async () => {
      const wrapper = mountListbox()

      await flushPromises()

      const items = wrapper.findAll('.m-select-list-item')
      const highlight = wrapper.find('.m-select-list__highlight')

      await items[0]!.trigger('focusin')
      await flushPromises()
      await items[1]!.trigger('focusin')
      await flushPromises()

      expect(highlight.attributes('style')).toContain('opacity: 1')
      expect(highlight.attributes('style')).toContain('transition-property: opacity')
      expect(highlight.attributes('style')).not.toContain('transform, opacity')
      wrapper.unmount()
    })

    it('then the highlight keeps the focused option when the pointer leaves', async () => {
      const wrapper = mountListbox()

      await flushPromises()
      await wrapper.findAll('.m-select-list-item')[0]!.trigger('focusin')
      await wrapper.findAll('.m-select-list-item')[1]!.trigger('pointerover')
      await wrapper.find('.m-select-list__scroll-wrapper').trigger('pointerleave')
      await flushPromises()

      expect(wrapper.find('.m-select-list__highlight').attributes('style')).toContain('opacity: 1')
      wrapper.unmount()
    })

    it('then the highlight is hidden when the focus leaves the list', async () => {
      const wrapper = mountListbox()

      await flushPromises()
      await wrapper.findAll('.m-select-list-item')[0]!.trigger('focusin')
      await wrapper.find('.m-select-list__scroll-wrapper').trigger('focusout', { relatedTarget: null })
      await flushPromises()

      expect(wrapper.find('.m-select-list__highlight').attributes('style')).toContain('opacity: 0')
      wrapper.unmount()
    })
  })

  describe('when the focus stays on an input', () => {
    it('then the highlight follows the active index', async () => {
      const wrapper = mountListbox({ virtualFocus: true, activeIndex: 1 })

      await flushPromises()

      expect(wrapper.find('.m-select-list__highlight').attributes('style')).toContain('opacity: 1')

      await wrapper.setProps({ activeIndex: -1 })
      await flushPromises()

      expect(wrapper.find('.m-select-list__highlight').attributes('style')).toContain('opacity: 0')
      wrapper.unmount()
    })
  })

  describe('when there is no option', () => {
    it('then the no result message is visible', () => {
      const wrapper = mountListbox({ options: [] })

      expect(wrapper.find('[role="status"]').text()).toBe('aria.noResults')
      expect(wrapper.find('.maz\\:sr-only').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when segments are given', () => {
    it('then the matched parts are marked', () => {
      const wrapper = mountListbox({
        getSegments: (option: { label: string }) => option.label === 'Apple'
          ? [{ text: 'Ap', match: true }, { text: 'ple', match: false }]
          : undefined,
      })

      expect(wrapper.find('.m-select-list-mark').text()).toBe('Ap')
      expect(wrapper.findAll('.m-select-list-mark')).toHaveLength(1)
      wrapper.unmount()
    })
  })
})
