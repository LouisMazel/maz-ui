import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenuItem from '@components/MazSidebarMenuItem.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar(slot: string) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: slot, components: { MazSidebarMenuItem } },
    },
  })
}

describe('given MazSidebarMenuItem component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders an li element', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenuItem />')
      expect(wrapper.find('li.m-sidebar-menu-item').exists()).toBe(true)
    })

    it('then the li has role="none"', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenuItem />')
      expect(wrapper.find('li').attributes('role')).toBe('none')
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenuItem />')
      expect(wrapper.find('li').classes()).toContain('m-reset-css')
    })

    it('then the slot content is rendered', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenuItem><span>Inner</span></MazSidebarMenuItem>')
      expect(wrapper.find('li').text()).toBe('Inner')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarMenuItem)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
