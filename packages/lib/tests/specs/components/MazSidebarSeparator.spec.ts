import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarSeparator from '@components/MazSidebarSeparator.vue'
import { mount } from '@vue/test-utils'

function mountInsideSidebar() {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: { template: '<MazSidebarSeparator />', components: { MazSidebarSeparator } },
    },
  })
}

describe('given MazSidebarSeparator component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it renders an hr element', () => {
      const wrapper = mountInsideSidebar()
      expect(wrapper.find('hr.m-sidebar-separator').exists()).toBe(true)
    })

    it('then it has m-reset-css class on root', () => {
      const wrapper = mountInsideSidebar()
      expect(wrapper.find('hr').classes()).toContain('m-reset-css')
    })

    it('then it has a top border with divider color', () => {
      const wrapper = mountInsideSidebar()
      const classes = wrapper.find('hr').classes()
      expect(classes).toContain('maz:border-t')
      expect(classes).toContain('maz:border-divider')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarSeparator)).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
