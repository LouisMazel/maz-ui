import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarFooter from '@components/MazSidebarFooter.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar(slot: string) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: slot, components: { MazSidebarFooter } },
    },
  })
}

describe('given MazSidebarFooter component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders a footer element', () => {
      const wrapper = mountInsideSidebar('<MazSidebarFooter />')
      expect(wrapper.find('footer.m-sidebar-footer').exists()).toBe(true)
    })

    it('then the slot content is displayed', () => {
      const wrapper = mountInsideSidebar('<MazSidebarFooter>Footer text</MazSidebarFooter>')
      expect(wrapper.find('footer').text()).toBe('Footer text')
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar('<MazSidebarFooter />')
      expect(wrapper.find('footer').classes()).toContain('m-reset-css')
    })

    it('then it has shrink-0 class to prevent shrinking', () => {
      const wrapper = mountInsideSidebar('<MazSidebarFooter />')
      expect(wrapper.find('footer').classes()).toContain('maz:shrink-0')
    })

    it('then it has a top border', () => {
      const wrapper = mountInsideSidebar('<MazSidebarFooter />')
      const classes = wrapper.find('footer').classes()
      expect(classes).toContain('maz:border-t')
      expect(classes).toContain('maz:border-divider')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarFooter)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
