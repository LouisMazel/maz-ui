import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

vi.mock('@floating-ui/vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/vue')>()

  return {
    ...actual,
    useFloating: () => ({
      floatingStyles: ref({}),
      placement: ref('bottom'),
      update: vi.fn(),
      middlewareData: ref({ hide: { referenceHidden: true } }),
    }),
  }
})

async function mountOpenPopover() {
  const wrapper = mount(MazPopover, {
    props: { modelValue: true },
    slots: { trigger: '<button>Open</button>', default: '<input class="search" aria-label="Search"><button class="other">Other</button>' },
    attachTo: document.body,
  })
  await nextTick()
  return wrapper
}

describe('given an open MazPopover whose reference left the viewport', () => {
  describe('when the focus is outside the panel', () => {
    it('then the panel is hidden', async () => {
      const wrapper = await mountOpenPopover()

      expect(wrapper.find<HTMLElement>('.m-popover-panel').element.style.visibility).toBe('hidden')

      wrapper.unmount()
    })
  })

  describe('when the focus is inside the panel', () => {
    it('then the panel stays visible', async () => {
      const wrapper = await mountOpenPopover()

      await wrapper.find('.search').trigger('focusin')

      expect(wrapper.find<HTMLElement>('.m-popover-panel').element.style.visibility).toBe('visible')

      wrapper.unmount()
    })
  })

  describe('when the focus moves to another element of the panel', () => {
    it('then the panel stays visible', async () => {
      const wrapper = await mountOpenPopover()
      const other = wrapper.find('.other').element

      await wrapper.find('.search').trigger('focusin')
      await wrapper.find('.search').trigger('focusout', { relatedTarget: other })

      expect(wrapper.find<HTMLElement>('.m-popover-panel').element.style.visibility).toBe('visible')

      wrapper.unmount()
    })
  })

  describe('when the focus leaves the panel', () => {
    it('then the panel is hidden again', async () => {
      const wrapper = await mountOpenPopover()

      await wrapper.find('.search').trigger('focusin')
      await wrapper.find('.search').trigger('focusout', { relatedTarget: null })

      expect(wrapper.find<HTMLElement>('.m-popover-panel').element.style.visibility).toBe('hidden')

      wrapper.unmount()
    })
  })

  describe('when the popover closes with the focus inside', () => {
    it('then the panel is hidden at the next opening until it gets the focus', async () => {
      const wrapper = await mountOpenPopover()

      await wrapper.find('.search').trigger('focusin')
      await wrapper.setProps({ modelValue: false })
      await wrapper.setProps({ modelValue: true })
      await nextTick()

      expect(wrapper.find<HTMLElement>('.m-popover-panel').element.style.visibility).toBe('hidden')

      wrapper.unmount()
    })
  })
})
