import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarGroup from '@components/MazSidebarGroup.vue'
import { mount } from '@vue/test-utils'

function mountWithSidebar(
  groupSlot: string,
  sidebarProps: Record<string, unknown> = { open: true },
) {
  return mount(MazSidebar, {
    props: sidebarProps,
    slots: {
      default: { template: groupSlot, components: { MazSidebarGroup } },
    },
  })
}

describe('given MazSidebarGroup component', () => {
  describe('when rendered with a label', () => {
    it('then the label text is displayed', () => {
      const wrapper = mountWithSidebar('<MazSidebarGroup label="Navigation">items</MazSidebarGroup>')
      expect(wrapper.find('.m-sidebar-group__label').text()).toBe('Navigation')
    })

    it('then the slot content is also displayed', () => {
      const wrapper = mountWithSidebar('<MazSidebarGroup label="Nav"><span>Inner item</span></MazSidebarGroup>')
      expect(wrapper.find('.m-sidebar-group').text()).toContain('Inner item')
    })
  })

  describe('when rendered without a label', () => {
    it('then the label element is not in the DOM', () => {
      const wrapper = mountWithSidebar('<MazSidebarGroup>items</MazSidebarGroup>')
      expect(wrapper.find('.m-sidebar-group__label').exists()).toBe(false)
    })
  })

  describe('when sidebar is icon-collapsed', () => {
    it('then the label is visually hidden with sr-only', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarGroup label="Nav">items</MazSidebarGroup>',
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-group__label').classes()).toContain('maz:sr-only')
    })
  })

  describe('when sidebar is expanded with collapsible=icon', () => {
    it('then the label does not have sr-only class', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarGroup label="Nav">items</MazSidebarGroup>',
        { open: true, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-group__label').classes()).not.toContain('maz:sr-only')
    })
  })

  describe('when rendered inside MazSidebar', () => {
    it('then the root has m-reset-css class', () => {
      const wrapper = mountWithSidebar('<MazSidebarGroup label="X" />')
      expect(wrapper.find('.m-sidebar-group').classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarGroup)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
