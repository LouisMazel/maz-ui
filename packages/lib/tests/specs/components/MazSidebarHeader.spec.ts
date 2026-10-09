import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarHeader from '@components/MazSidebarHeader.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar(slot: string) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: slot, components: { MazSidebarHeader } },
    },
  })
}

describe('given MazSidebarHeader component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders a header element', () => {
      const wrapper = mountInsideSidebar('<MazSidebarHeader>Title</MazSidebarHeader>')
      expect(wrapper.find('header.m-sidebar-header').exists()).toBe(true)
    })

    it('then the slot content is displayed', () => {
      const wrapper = mountInsideSidebar('<MazSidebarHeader><span>My App</span></MazSidebarHeader>')
      expect(wrapper.find('header').text()).toBe('My App')
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar('<MazSidebarHeader />')
      expect(wrapper.find('header').classes()).toContain('m-reset-css')
    })

    it('then it has shrink-0 class to prevent shrinking', () => {
      const wrapper = mountInsideSidebar('<MazSidebarHeader />')
      expect(wrapper.find('header').classes()).toContain('maz:shrink-0')
    })

    it('then it has a bottom border', () => {
      const wrapper = mountInsideSidebar('<MazSidebarHeader />')
      const classes = wrapper.find('header').classes()
      expect(classes).toContain('maz:border-b')
      expect(classes).toContain('maz:border-divider')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarHeader)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
