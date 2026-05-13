import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenuButton from '@components/MazSidebarMenuButton.vue'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

function mountWithSidebar(
  buttonProps: Record<string, unknown> = {},
  sidebarProps: Record<string, unknown> = { open: true },
  buttonSlot?: string,
) {
  return mount(MazSidebar, {
    props: sidebarProps,
    slots: {
      default: {
        components: { MazSidebarMenuButton },
        setup() {
          return () => h(MazSidebarMenuButton, buttonProps, buttonSlot ? { default: () => buttonSlot } : undefined)
        },
      },
    },
  })
}

describe('given MazSidebarMenuButton component', () => {
  describe('when no to or href is provided', () => {
    it('then it renders a button element', () => {
      const wrapper = mountWithSidebar({ label: 'Home' })
      expect(wrapper.find('button.m-sidebar-menu-btn').exists()).toBe(true)
    })

    it('then it has type="button"', () => {
      const wrapper = mountWithSidebar({ label: 'Home' })
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })
  })

  describe('when href is provided', () => {
    it('then it renders an anchor element', () => {
      const wrapper = mountWithSidebar({ href: 'https://example.com', label: 'Link' })
      expect(wrapper.find('a.m-sidebar-menu-btn').exists()).toBe(true)
    })

    it('then the href is set on the anchor', () => {
      const wrapper = mountWithSidebar({ href: 'https://example.com', label: 'Link' })
      expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    })
  })

  describe('when "to" prop is provided (router-link path)', () => {
    it('then the resolved component is rendered (not a native button)', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mountWithSidebar({ to: '/dashboard', label: 'Dashboard' })
      expect(wrapper.find('button.m-sidebar-menu-btn').exists()).toBe(false)
      expect(wrapper.find('.m-sidebar-menu-btn').exists()).toBe(true)
      consoleSpy.mockRestore()
    })

    it('then the link component receives the "to" attribute', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mountWithSidebar({ to: '/dashboard', label: 'Dashboard' })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('to')).toBe('/dashboard')
      consoleSpy.mockRestore()
    })
  })

  describe('when tooltip prop is provided in a start-side sidebar', () => {
    it('then the button mounts without error and is rendered', () => {
      const wrapper = mountWithSidebar(
        { label: 'Home', tooltip: 'Go home' },
        { open: true, side: 'start' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').exists()).toBe(true)
    })
  })

  describe('when tooltip prop is provided in an end-side sidebar', () => {
    it('then the button mounts without error and is rendered', () => {
      const wrapper = mountWithSidebar(
        { label: 'Home', tooltip: 'Go home' },
        { open: true, side: 'end' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').exists()).toBe(true)
    })
  })

  describe('when a label prop is provided', () => {
    it('then the label text is displayed', () => {
      const wrapper = mountWithSidebar({ label: 'Dashboard' })
      expect(wrapper.find('.m-sidebar-menu-btn__label').text()).toBe('Dashboard')
    })

    it('then the aria-label attribute is set to the label', () => {
      const wrapper = mountWithSidebar({ label: 'Dashboard' })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('aria-label')).toBe('Dashboard')
    })
  })

  describe('when active is true', () => {
    it('then the --active modifier class is applied', () => {
      const wrapper = mountWithSidebar({ label: 'Active', active: true })
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('--active')
    })

    it('then aria-current="page" is set', () => {
      const wrapper = mountWithSidebar({ label: 'Active', active: true })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('aria-current')).toBe('page')
    })
  })

  describe('when active is false', () => {
    it('then aria-current is not set', () => {
      const wrapper = mountWithSidebar({ label: 'Inactive' })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('aria-current')).toBeUndefined()
    })
  })

  describe('when disabled is true', () => {
    it('then the --disabled modifier class is applied', () => {
      const wrapper = mountWithSidebar({ label: 'X', disabled: true })
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('--disabled')
    })

    it('then the disabled attribute is set on a native button', () => {
      const wrapper = mountWithSidebar({ label: 'X', disabled: true })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })

  describe('when badge is a simple number', () => {
    it('then the badge text is displayed', async () => {
      const wrapper = mountWithSidebar({ label: 'Inbox', badge: 5 })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-sidebar-menu-btn__badge').text()).toBe('5')
    })
  })

  describe('when badge is a simple string', () => {
    it('then the badge text is displayed', async () => {
      const wrapper = mountWithSidebar({ label: 'Inbox', badge: 'NEW' })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-sidebar-menu-btn__badge').text()).toBe('NEW')
    })
  })

  describe('when badge is a full MazBadgeProps object', () => {
    it('then the badge color class is applied', async () => {
      const wrapper = mountWithSidebar({
        label: 'Inbox',
        badge: { text: 7, color: 'destructive', outlined: true },
      })
      await vi.dynamicImportSettled()
      expect(wrapper.find('.m-sidebar-menu-btn__badge').text()).toBe('7')
      expect(wrapper.find('.m-sidebar-menu-btn__badge .m-badge').classes()).toContain('--destructive')
    })
  })

  describe('when sidebar is icon-collapsed', () => {
    it('then the label has opacity-0 class', () => {
      const wrapper = mountWithSidebar(
        { label: 'Dashboard', icon: 'i' },
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn__label').classes()).toContain('maz:opacity-0')
    })

    it('then the label has aria-hidden=true', () => {
      const wrapper = mountWithSidebar(
        { label: 'Dashboard' },
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn__label').attributes('aria-hidden')).toBe('true')
    })

    it('then the badge is not rendered', () => {
      const wrapper = mountWithSidebar(
        { label: 'Inbox', badge: 3 },
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn__badge').exists()).toBe(false)
    })

    it('then the button has --icon-collapsed modifier class', () => {
      const wrapper = mountWithSidebar(
        { label: 'X' },
        { open: false, collapsible: 'icon' },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('--icon-collapsed')
    })
  })

  describe('when sidebar is expanded', () => {
    it('then the label has opacity-100 class', () => {
      const wrapper = mountWithSidebar({ label: 'Home' })
      expect(wrapper.find('.m-sidebar-menu-btn__label').classes()).toContain('maz:opacity-100')
    })
  })

  describe('when clicked and not disabled', () => {
    it('then a click event is emitted', async () => {
      const wrapper = mountWithSidebar({ label: 'Click' })
      await wrapper.find('button').trigger('click')
      const btn = wrapper.findComponent(MazSidebarMenuButton)
      expect(btn.emitted('click')).toBeTruthy()
    })
  })

  describe('when the root has m-reset-css class', () => {
    it('then the class is present on the button', () => {
      const wrapper = mountWithSidebar({ label: 'X' })
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it throws an error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(() => mount(MazSidebarMenuButton, { props: { label: 'X' } })).toThrow()
      consoleSpy.mockRestore()
    })
  })
})
