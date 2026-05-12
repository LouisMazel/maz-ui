import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarContent from '@components/MazSidebarContent.vue'
import MazSidebarFooter from '@components/MazSidebarFooter.vue'
import MazSidebarGroup from '@components/MazSidebarGroup.vue'
import MazSidebarHeader from '@components/MazSidebarHeader.vue'
import MazSidebarMenu from '@components/MazSidebarMenu.vue'
import MazSidebarMenuButton from '@components/MazSidebarMenuButton.vue'
import MazSidebarMenuItem from '@components/MazSidebarMenuItem.vue'
import MazSidebarMenuSub from '@components/MazSidebarMenuSub.vue'
import MazSidebarSeparator from '@components/MazSidebarSeparator.vue'
import MazSidebarTrigger from '@components/MazSidebarTrigger.vue'
import { mount } from '@vue/test-utils'

// Helper: wrap child component inside MazSidebar
function mountInsideSidebar(
  child: Record<string, unknown>,
  sidebarProps: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(MazSidebar, {
    props: { open: true, ...sidebarProps },
    slots: {
      default: child,
      ...slots,
    },
  })
}

// ─────────────────────────────────────────────
// MazSidebar
// ─────────────────────────────────────────────
describe('given MazSidebar component', () => {
  describe('when rendered in push mode (default)', () => {
    it('then it should render an aside with --push class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      const aside = wrapper.find('aside.m-sidebar.--push')
      expect(aside.exists()).toBe(true)
    })

    it('then it should apply --side-start class by default', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--side-start')
    })

    it('then it should apply --side-end class when side is end', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, side: 'end' } })
      expect(wrapper.find('aside').classes()).toContain('--side-end')
    })

    it('then it should apply --expanded class when open', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--expanded')
    })

    it('then it should apply --collapsed class when closed', () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })

    it('then it should apply --collapsible-offcanvas class by default', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--collapsible-offcanvas')
    })

    it('then it should apply --collapsible-icon class when collapsible=icon', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, collapsible: 'icon' } })
      expect(wrapper.find('aside').classes()).toContain('--collapsible-icon')
    })

    it('then it should bind CSS custom properties for width', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true, width: '20rem', iconWidth: '4rem' },
      })
      const style = wrapper.find('aside').attributes('style') ?? ''
      expect(style).toContain('--maz-sidebar-width: 20rem')
      expect(style).toContain('--maz-sidebar-icon-width: 4rem')
    })

    it('then it should use the provided id', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, id: 'my-sidebar' } })
      expect(wrapper.find('aside').attributes('id')).toBe('my-sidebar')
    })

    it('then it should generate a unique id when none provided', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').attributes('id')).toBeTruthy()
    })
  })

  describe('when rendered in overlay mode', () => {
    it('then it should render an aside with --overlay class when open', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, mode: 'overlay' } })
      const aside = wrapper.find('aside.m-sidebar.--overlay')
      expect(aside.exists()).toBe(true)
    })

    it('then it should not render the aside when closed', () => {
      const wrapper = mount(MazSidebar, { props: { open: false, mode: 'overlay' } })
      expect(wrapper.find('aside.m-sidebar').exists()).toBe(false)
    })
  })

  describe('when open state changes via v-model', () => {
    it('then it should emit update:open when toggled', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      // Access the component's setOpen function via expose
      await wrapper.vm.toggle()
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })

    it('then it should emit update:open with true when setOpen(true) called', async () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      await wrapper.vm.setOpen(true)
      expect(wrapper.emitted('update:open')).toEqual([[true]])
    })

    it('then it should react to prop change', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.setProps({ open: false })
      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarHeader
// ─────────────────────────────────────────────
describe('given MazSidebarHeader component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render a header element', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarHeader><span>Title</span></MazSidebarHeader>', components: { MazSidebarHeader } },
      )
      expect(wrapper.find('header.m-sidebar-header').exists()).toBe(true)
      expect(wrapper.find('header').text()).toBe('Title')
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it should throw an error', () => {
      expect(() => mount(MazSidebarHeader)).toThrow()
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarContent
// ─────────────────────────────────────────────
describe('given MazSidebarContent component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render a scrollable div', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarContent>Content</MazSidebarContent>', components: { MazSidebarContent } },
      )
      expect(wrapper.find('.m-sidebar-content').exists()).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarFooter
// ─────────────────────────────────────────────
describe('given MazSidebarFooter component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render a footer element', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarFooter>Footer</MazSidebarFooter>', components: { MazSidebarFooter } },
      )
      expect(wrapper.find('footer.m-sidebar-footer').exists()).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarSeparator
// ─────────────────────────────────────────────
describe('given MazSidebarSeparator component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render an hr element', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarSeparator />', components: { MazSidebarSeparator } },
      )
      expect(wrapper.find('hr.m-sidebar-separator').exists()).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarGroup
// ─────────────────────────────────────────────
describe('given MazSidebarGroup component', () => {
  describe('when rendered with a label', () => {
    it('then it should display the label', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarGroup label="Navigation">items</MazSidebarGroup>',
          components: { MazSidebarGroup },
        },
      )
      expect(wrapper.find('.m-sidebar-group__label').text()).toBe('Navigation')
    })
  })

  describe('when in icon-collapsed mode', () => {
    it('then label should have sr-only class', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, collapsible: 'icon' },
        slots: {
          default: {
            template: '<MazSidebarGroup label="Nav">items</MazSidebarGroup>',
            components: { MazSidebarGroup },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-group__label').classes()).toContain('maz:sr-only')
    })
  })

  describe('when expanded', () => {
    it('then label should not have sr-only class', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true, collapsible: 'icon' },
        slots: {
          default: {
            template: '<MazSidebarGroup label="Nav">items</MazSidebarGroup>',
            components: { MazSidebarGroup },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-group__label').classes()).not.toContain('maz:sr-only')
    })
  })

  describe('when rendered without a label', () => {
    it('then the label element should not be rendered', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarGroup>items</MazSidebarGroup>',
          components: { MazSidebarGroup },
        },
      )
      expect(wrapper.find('.m-sidebar-group__label').exists()).toBe(false)
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarMenu
// ─────────────────────────────────────────────
describe('given MazSidebarMenu component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render a ul with role menu', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarMenu />', components: { MazSidebarMenu } },
      )
      const ul = wrapper.find('ul.m-sidebar-menu')
      expect(ul.exists()).toBe(true)
      expect(ul.attributes('role')).toBe('menu')
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarMenuItem
// ─────────────────────────────────────────────
describe('given MazSidebarMenuItem component', () => {
  describe('when rendered inside MazSidebar', () => {
    it('then it should render a li with role none', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarMenuItem />', components: { MazSidebarMenuItem } },
      )
      const li = wrapper.find('li.m-sidebar-menu-item')
      expect(li.exists()).toBe(true)
      expect(li.attributes('role')).toBe('none')
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarMenuButton
// ─────────────────────────────────────────────
describe('given MazSidebarMenuButton component', () => {
  describe('when rendered as a button (no to/href)', () => {
    it('then it should render a button element', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton label="Home" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('button.m-sidebar-menu-btn').exists()).toBe(true)
    })

    it('then it should display the label', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton label="Dashboard" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-btn__label').text()).toBe('Dashboard')
    })
  })

  describe('when rendered with href', () => {
    it('then it should render an anchor element', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton href="https://example.com" label="Link" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('a.m-sidebar-menu-btn').exists()).toBe(true)
      expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    })
  })

  describe('when active prop is true', () => {
    it('then it should have --active class and aria-current=page', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton :active="true" label="Active" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('--active')
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('aria-current')).toBe('page')
    })
  })

  describe('when active prop is false or undefined', () => {
    it('then aria-current should not be set', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton label="Inactive" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('aria-current')).toBeUndefined()
    })
  })

  describe('when disabled', () => {
    it('then it should have --disabled class and disabled attribute', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton :disabled="true" label="Disabled" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-btn').classes()).toContain('--disabled')
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })
  })

  describe('when badge is provided', () => {
    it('then it should display the badge', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton label="Inbox" :badge="5" />',
          components: { MazSidebarMenuButton },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-btn__badge').text()).toBe('5')
    })
  })

  describe('when in icon-collapsed mode', () => {
    it('then label should have sr-only class and badge should be hidden', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, collapsible: 'icon' },
        slots: {
          default: {
            template: '<MazSidebarMenuButton label="Items" :badge="3" />',
            components: { MazSidebarMenuButton },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-menu-btn__label').classes()).toContain('maz:sr-only')
      expect(wrapper.find('.m-sidebar-menu-btn__badge').exists()).toBe(false)
    })

    it('then tooltip should be set to label as fallback', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, collapsible: 'icon' },
        slots: {
          default: {
            template: '<MazSidebarMenuButton label="Dashboard" />',
            components: { MazSidebarMenuButton },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('title')).toBe('Dashboard')
    })

    it('then tooltip prop should override label as tooltip', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, collapsible: 'icon' },
        slots: {
          default: {
            template: '<MazSidebarMenuButton label="Dashboard" tooltip="Go to dashboard" />',
            components: { MazSidebarMenuButton },
          },
        },
      })
      expect(wrapper.find('.m-sidebar-menu-btn').attributes('title')).toBe('Go to dashboard')
    })
  })

  describe('when clicked', () => {
    it('then it should emit a click event', async () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuButton label="Click" />',
          components: { MazSidebarMenuButton },
        },
      )
      await wrapper.find('button').trigger('click')
      // Button click should work; inner component emits it
      expect(wrapper.findComponent(MazSidebarMenuButton).emitted('click')).toBeTruthy()
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarMenuSub
// ─────────────────────────────────────────────
describe('given MazSidebarMenuSub component', () => {
  describe('when rendered with default (closed)', () => {
    it('then the sub-menu list should not be visible', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(false)
    })

    it('then trigger should have aria-expanded=false', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub" />',
          components: { MazSidebarMenuSub },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when defaultOpen is true', () => {
    it('then the sub-menu list should be visible', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub" :default-open="true"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(true)
    })

    it('then trigger should have aria-expanded=true', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub" :default-open="true" />',
          components: { MazSidebarMenuSub },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('when trigger is clicked', () => {
    it('then sub-menu should toggle open', async () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(false)
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('click')
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(true)
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('true')
    })
  })

  describe('when ArrowRight key is pressed', () => {
    it('then sub-menu should open', async () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.find('.m-sidebar-menu-sub__list').exists()).toBe(true)
    })
  })

  describe('when ArrowLeft key is pressed', () => {
    it('then sub-menu trigger should reflect collapsed state via aria-expanded', async () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub" :default-open="true"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      await wrapper.find('.m-sidebar-menu-sub__trigger').trigger('keydown', { key: 'ArrowLeft' })
      // aria-expanded reflects the internal isOpen state immediately
      expect(wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when rendered', () => {
    it('then aria-controls on trigger should match the list id', () => {
      const wrapper = mountInsideSidebar(
        {
          template: '<MazSidebarMenuSub label="Sub" :default-open="true"><li>Item</li></MazSidebarMenuSub>',
          components: { MazSidebarMenuSub },
        },
      )
      const controls = wrapper.find('.m-sidebar-menu-sub__trigger').attributes('aria-controls')
      expect(controls).toBeTruthy()
      expect(wrapper.find(`#${controls}`).exists()).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────
// MazSidebarTrigger
// ─────────────────────────────────────────────
describe('given MazSidebarTrigger component', () => {
  describe('when rendered inside MazSidebar (open)', () => {
    it('then it should have aria-expanded=true', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarTrigger />', components: { MazSidebarTrigger } },
        { open: true, id: 'my-sidebar' },
      )
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-expanded')).toBe('true')
    })

    it('then aria-controls should reference the sidebar id', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarTrigger />', components: { MazSidebarTrigger } },
        { open: true, id: 'my-sidebar' },
      )
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-controls')).toBe('my-sidebar')
    })
  })

  describe('when rendered inside MazSidebar (closed)', () => {
    it('then it should have aria-expanded=false', () => {
      const wrapper = mountInsideSidebar(
        { template: '<MazSidebarTrigger />', components: { MazSidebarTrigger } },
        { open: false },
      )
      expect(wrapper.find('button.m-sidebar-trigger').attributes('aria-expanded')).toBe('false')
    })
  })

  describe('when trigger is clicked', () => {
    it('then it should toggle the sidebar open state', async () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true },
        slots: {
          default: { template: '<MazSidebarTrigger />', components: { MazSidebarTrigger } },
        },
      })
      await wrapper.find('button.m-sidebar-trigger').trigger('click')
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })
  })

  describe('when rendered outside MazSidebar', () => {
    it('then it should throw an error', () => {
      expect(() => mount(MazSidebarTrigger)).toThrow()
    })
  })
})
