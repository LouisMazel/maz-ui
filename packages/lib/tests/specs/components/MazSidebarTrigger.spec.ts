import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarTrigger from '@components/MazSidebarTrigger.vue'
import { mount } from '@vue/test-utils'

vi.mock('@maz-ui/icons/lazy/MazBars3', () => ({
  MazBars3: { template: '<svg class="bars-stub" />' },
}))

function mountWithSidebar(sidebarProps: Record<string, unknown> = { open: true }) {
  return mount(MazSidebar, {
    props: sidebarProps,
    slots: {
      default: { template: '<MazSidebarTrigger />', components: { MazSidebarTrigger } },
    },
  })
}

describe('given MazSidebarTrigger component', () => {
  describe('when rendered inside an open MazSidebar', () => {
    it('then the button has aria-expanded=true', () => {
      const wrapper = mountWithSidebar({ open: true })
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-expanded')).toBe('true')
    })

    it('then the button has aria-label="Close sidebar"', () => {
      const wrapper = mountWithSidebar({ open: true })
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-label')).toBe('Close sidebar')
    })
  })

  describe('when rendered inside a closed MazSidebar', () => {
    it('then the button has aria-expanded=false', () => {
      const wrapper = mountWithSidebar({ open: false })
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-expanded')).toBe('false')
    })

    it('then the button has aria-label="Open sidebar"', () => {
      const wrapper = mountWithSidebar({ open: false })
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-label')).toBe('Open sidebar')
    })
  })

  describe('when a sidebar id is provided', () => {
    it('then aria-controls matches the sidebar id', () => {
      const wrapper = mountWithSidebar({ open: true, id: 'sidebar-A' })
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-controls')).toBe('sidebar-A')
    })
  })

  describe('when the button is clicked', () => {
    it('then update:open is emitted with the inverted value', async () => {
      const wrapper = mountWithSidebar({ open: true })
      await wrapper.find('button.m-sidebar-trigger').trigger('click')
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })
  })

  describe('when no slot is provided', () => {
    it('then the default content is rendered', async () => {
      const wrapper = mountWithSidebar()
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      const btn = wrapper.find('button.m-sidebar-trigger')
      expect(btn.find('.custom-trigger').exists()).toBe(false)
      expect(btn.element.children.length).toBeGreaterThan(0)
    })
  })

  describe('when a custom slot is provided', () => {
    it('then the slot content replaces the default icon', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true },
        slots: {
          default: {
            template: '<MazSidebarTrigger><span class="custom-trigger">X</span></MazSidebarTrigger>',
            components: { MazSidebarTrigger },
          },
        },
      })
      expect(wrapper.find('.custom-trigger').exists()).toBe(true)
    })
  })

  describe('when rendered', () => {
    it('then the root has m-reset-css class', () => {
      const wrapper = mountWithSidebar()
      expect(wrapper.find('button.m-sidebar-trigger').classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarTrigger)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
