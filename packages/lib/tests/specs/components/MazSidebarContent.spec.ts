import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarContent from '@components/MazSidebarContent.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar(slot: string) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: slot, components: { MazSidebarContent } },
    },
  })
}

describe('given MazSidebarContent component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders a div with m-sidebar-content class', () => {
      const wrapper = mountInsideSidebar('<MazSidebarContent />')
      expect(wrapper.find('div.m-sidebar-content').exists()).toBe(true)
    })

    it('then the slot content is displayed', () => {
      const wrapper = mountInsideSidebar('<MazSidebarContent>Content body</MazSidebarContent>')
      expect(wrapper.find('.m-sidebar-content').text()).toBe('Content body')
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar('<MazSidebarContent />')
      expect(wrapper.find('.m-sidebar-content').classes()).toContain('m-reset-css')
    })

    it('then it has flex-1 class to fill remaining space', () => {
      const wrapper = mountInsideSidebar('<MazSidebarContent />')
      expect(wrapper.find('.m-sidebar-content').classes()).toContain('maz:flex-1')
    })

    it('then it has vertical scroll on overflow', () => {
      const wrapper = mountInsideSidebar('<MazSidebarContent />')
      const classes = wrapper.find('.m-sidebar-content').classes()
      expect(classes).toContain('maz:overflow-y-auto')
      expect(classes).toContain('maz:overflow-x-hidden')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarContent)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
