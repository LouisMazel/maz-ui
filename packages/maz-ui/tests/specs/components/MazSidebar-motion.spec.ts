import MazMorphIcon from '@components/MazMorphIcon.vue'
import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenu from '@components/MazSidebarMenu.vue'
import MazSidebarMenuButton from '@components/MazSidebarMenuButton.vue'
import MazSidebarMenuItem from '@components/MazSidebarMenuItem.vue'
import MazSidebarTrigger from '@components/MazSidebarTrigger.vue'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

function mountMenu(initial: string, sidebarProps: Record<string, unknown> = {}) {
  const active = ref(initial)

  const wrapper = mount(MazSidebar, {
    props: { open: true, persist: false, ...sidebarProps },
    slots: {
      default: {
        components: { MazSidebarMenu, MazSidebarMenuItem, MazSidebarMenuButton },
        setup: () => ({ active }),
        template: `
          <MazSidebarMenu>
            <MazSidebarMenuItem><MazSidebarMenuButton label="Home" :active="active === 'home'" /></MazSidebarMenuItem>
            <MazSidebarMenuItem><MazSidebarMenuButton label="Docs" :active="active === 'docs'" /></MazSidebarMenuItem>
          </MazSidebarMenu>
        `,
      },
    },
    attachTo: document.body,
  })

  return { wrapper, active }
}

async function settle() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 20))
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a sidebar menu with an active button', () => {
  describe('when it is mounted', () => {
    it('then the pill is placed and the active button leaves it its background', async () => {
      const { wrapper } = mountMenu('docs')

      await settle()

      const menu = wrapper.get<HTMLElement>('ul.m-sidebar-menu')
      const buttons = wrapper.findAll('.m-sidebar-menu-btn')

      expect(menu.element.style.getPropertyValue('--m-pill-opacity')).toBe('1')
      expect(buttons[1].classes()).toContain('--pill')
      expect(buttons[0].classes()).not.toContain('--pill')
    })

    it('then the list only contains its items', async () => {
      const { wrapper } = mountMenu('docs')

      await settle()

      expect(wrapper.get('ul.m-sidebar-menu').element.children).toHaveLength(2)
    })
  })

  describe('when no button is active', () => {
    it('then the pill stays hidden', async () => {
      const { wrapper } = mountMenu('none')

      await settle()

      expect(wrapper.get<HTMLElement>('ul.m-sidebar-menu').element.style.getPropertyValue('--m-pill-opacity')).toBe('0')
      expect(wrapper.find('.--pill').exists()).toBe(false)
    })
  })

  describe('when the active button changes', () => {
    it('then the pill gives its place to the new active button', async () => {
      const { wrapper, active } = mountMenu('home')

      await settle()
      active.value = 'docs'
      await settle()

      const buttons = wrapper.findAll('.m-sidebar-menu-btn')

      expect(buttons[1].classes()).toContain('--pill')
      expect(buttons[0].classes()).not.toContain('--pill')
    })
  })
})

describe('given a button outside of a menu', () => {
  describe('when it is active', () => {
    it('then it keeps its own background', async () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true, persist: false },
        slots: {
          default: {
            components: { MazSidebarMenuButton },
            template: '<MazSidebarMenuButton label="Home" active />',
          },
        },
      })

      await settle()

      expect(wrapper.get('.m-sidebar-menu-btn').classes()).not.toContain('--pill')
      expect(wrapper.get('.m-sidebar-menu-btn').classes()).toContain('maz:bg-primary/10')
    })
  })
})

describe('given a sidebar trigger', () => {
  describe('when the sidebar is open', () => {
    it('then the icon is the closed state of the morph', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true, persist: false },
        slots: { default: { components: { MazSidebarTrigger }, template: '<MazSidebarTrigger />' } },
      })

      const icon = wrapper.findComponent(MazMorphIcon)

      expect(icon.props('name')).toBe('menu-close')
      expect(icon.props('active')).toBe(true)
    })
  })

  describe('when the sidebar is closed', () => {
    it('then the icon is the menu', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, persist: false },
        slots: { default: { components: { MazSidebarTrigger }, template: '<MazSidebarTrigger />' } },
      })

      expect(wrapper.findComponent(MazMorphIcon).props('active')).toBe(false)
    })
  })
})

describe('given a sidebar with animated false', () => {
  describe('when it is rendered in push mode', () => {
    it('then it has no width transition', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, persist: false, animated: false } })

      expect(wrapper.classes()).not.toContain('maz:transition-[width,padding,border-width]')
    })
  })

  describe('when animated is not set', () => {
    it('then the width of the sidebar transitions with the slow token', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, persist: false } })

      expect(wrapper.classes()).toContain('maz:duration-(--duration-slow)')
    })
  })
})
