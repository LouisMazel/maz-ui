import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenu from '@components/MazSidebarMenu.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar(slot: string) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: slot, components: { MazSidebarMenu } },
    },
  })
}

describe('given MazSidebarMenu component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders a ul element', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenu />')
      expect(wrapper.find('ul.m-sidebar-menu').exists()).toBe(true)
    })

    it('then the ul has role="menu"', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenu />')
      expect(wrapper.find('ul').attributes('role')).toBe('menu')
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenu />')
      expect(wrapper.find('ul').classes()).toContain('m-reset-css')
    })

    it('then the slot content is rendered as children', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenu><li>Item 1</li><li>Item 2</li></MazSidebarMenu>')
      expect(wrapper.findAll('li')).toHaveLength(2)
    })

    it('then it has flex column layout', () => {
      const wrapper = mountInsideSidebar('<MazSidebarMenu />')
      const classes = wrapper.find('ul').classes()
      expect(classes).toContain('maz:flex')
      expect(classes).toContain('maz:flex-col')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarMenu)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
