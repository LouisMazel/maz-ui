import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenuSub from '@components/MazSidebarMenuSub.vue'
import { mount } from '@vue/test-utils'

vi.mock('@maz-ui/icons/lazy/MazChevronDown', () => ({
  MazChevronDown: { template: '<div class="chevron-stub" />' },
}))

function mountWithSidebar(
  template: string,
  sidebarProps: Record<string, unknown> = { open: true },
) {
  return mount(MazSidebar, {
    props: sidebarProps,
    slots: {
      default: { template, components: { MazSidebarMenuSub } },
    },
  })
}

describe('given MazSidebarMenuSub component', () => {
  describe('when rendered with default props (closed)', () => {
    it('then the trigger has aria-expanded=false', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })

    it('then the trigger has aria-controls referencing a list id', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      const controls = wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-controls')
      expect(controls).toBeTruthy()
      expect(controls?.startsWith('maz-sidebar-sub-')).toBe(true)
    })
  })

  describe('when defaultOpen is true', () => {
    it('then the trigger has aria-expanded=true', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" :default-open="true"><li>X</li></MazSidebarMenuSub>')
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('true')
    })

    it('then the chevron has rotate-180 class', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" :default-open="true" />')
      expect(wrapper.find('.m-sidebar-menu-sub__chevron').classes()).toContain('maz:rotate-180')
    })
  })

  describe('when the trigger is clicked', () => {
    it('then aria-expanded flips to true', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('click')
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('true')
    })

    it('then clicking again flips back to false', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" :default-open="true" />')
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('click')
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when ArrowRight is pressed on the trigger', () => {
    it('then aria-expanded becomes true', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('when ArrowLeft is pressed on the trigger', () => {
    it('then aria-expanded becomes false', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" :default-open="true" />')
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when a label prop is provided', () => {
    it('then the label text is displayed inside the trigger', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Products" />')
      expect(wrapper.find('.m-sidebar-menu-sub__label').text()).toBe('Products')
    })

    it('then the trigger has aria-label set to the label', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Products" />')
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-label')).toBe('Products')
    })
  })

  describe('when an icon prop is provided as a component value', () => {
    it('then the icon container is rendered', () => {
      const IconStub = { template: '<svg class="icon-stub" />' }
      const wrapper = mount(MazSidebar, {
        props: { open: true },
        slots: {
          default: {
            template: '<MazSidebarMenuSub label="Sub" :icon="iconComp" />',
            components: { MazSidebarMenuSub },
            data() {
              return { iconComp: IconStub }
            },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-menu-sub__icon').exists()).toBe(true)
    })
  })

  describe('when defaultOpen=true and sub-menu content is rendered', () => {
    it('then the sub-menu list is wrapped by an expand animation region', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" :default-open="true"><li>Item</li></MazSidebarMenuSub>')
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(true)
    })
  })

  describe('when an unrelated key is pressed on the trigger', () => {
    it('then aria-expanded does not change', async () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('keydown', { key: 'a' })
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when sidebar is icon-collapsed', () => {
    it('then the label has opacity-0', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarMenuSub label="Sub" />',
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__label').classes()).toContain('maz:opacity-0')
    })

    it('then the chevron is not rendered', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarMenuSub label="Sub" />',
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__chevron').exists()).toBe(false)
    })
  })

  describe('when sidebar collapsible is "hover" and not hovered', () => {
    it('then the label has opacity-0', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarMenuSub label="Sub" />',
        { collapsible: 'hover', persist: false },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__label').classes()).toContain('maz:opacity-0')
    })

    it('then the chevron is not rendered', () => {
      const wrapper = mountWithSidebar(
        '<MazSidebarMenuSub label="Sub" />',
        { collapsible: 'hover', persist: false },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__chevron').exists()).toBe(false)
    })
  })

  describe('when the component renders', () => {
    it('then the root has m-reset-css class', () => {
      const wrapper = mountWithSidebar('<MazSidebarMenuSub label="Sub" />')
      expect(wrapper.find('.m-sidebar-menu-sub').classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarMenuSub, { props: { label: 'Sub' } })).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
