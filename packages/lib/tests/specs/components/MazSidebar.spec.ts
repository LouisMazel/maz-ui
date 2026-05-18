import MazSidebar from '@components/MazSidebar.vue'
import { useSidebar } from '@composables/useSidebar'
import { mount } from '@vue/test-utils'

describe('given MazSidebar component', () => {
  describe('when rendered in push mode (default)', () => {
    it('then it renders an aside element', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside.m-sidebar').exists()).toBe(true)
    })

    it('then the aside has the --push modifier class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--push')
    })

    it('then the aside has m-reset-css class on root', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('m-reset-css')
    })

    it('then the aside has aria-label="Sidebar"', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').attributes('aria-label')).toBe('Sidebar')
    })
  })

  describe('when no side prop is provided', () => {
    it('then it applies --side-start class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--side-start')
    })

    it('then it applies the inline-end border class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('maz:border-e')
      expect(wrapper.find('aside').classes()).toContain('maz:border-divider')
    })
  })

  describe('when side is "end"', () => {
    it('then it applies --side-end class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, side: 'end' } })
      expect(wrapper.find('aside').classes()).toContain('--side-end')
    })

    it('then it applies the inline-start border class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, side: 'end' } })
      expect(wrapper.find('aside').classes()).toContain('maz:border-s')
    })
  })

  describe('when the sidebar is open (expanded)', () => {
    it('then it applies --expanded class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--expanded')
    })

    it('then it applies the expanded width class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('maz:w-(--maz-sidebar-width)')
    })
  })

  describe('when the sidebar is closed in offcanvas mode (default collapsible)', () => {
    it('then it applies --collapsed class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })

    it('then it applies the zero-width class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      expect(wrapper.find('aside').classes()).toContain('maz:w-0')
    })

    it('then it does NOT apply a border class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      const classes = wrapper.find('aside').classes()
      expect(classes).not.toContain('maz:border-e')
      expect(classes).not.toContain('maz:border-s')
    })
  })

  describe('when collapsible is "icon" and the sidebar is closed', () => {
    it('then it applies the icon-width class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false, collapsible: 'icon' } })
      expect(wrapper.find('aside').classes()).toContain('maz:w-(--maz-sidebar-icon-width)')
    })

    it('then it still applies the border class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false, collapsible: 'icon' } })
      expect(wrapper.find('aside').classes()).toContain('maz:border-e')
    })

    it('then it applies --collapsible-icon class', () => {
      const wrapper = mount(MazSidebar, { props: { open: false, collapsible: 'icon' } })
      expect(wrapper.find('aside').classes()).toContain('--collapsible-icon')
    })
  })

  describe('when collapsible is "none"', () => {
    it('then it always applies the expanded width class regardless of open state', () => {
      const wrapper = mount(MazSidebar, { props: { open: false, collapsible: 'none' } })
      expect(wrapper.find('aside').classes()).toContain('maz:w-(--maz-sidebar-width)')
    })

    it('then it applies --collapsible-none class', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, collapsible: 'none' } })
      expect(wrapper.find('aside').classes()).toContain('--collapsible-none')
    })
  })

  describe('when width and iconWidth props are set', () => {
    it('then the CSS custom properties are bound on the style attribute', () => {
      const wrapper = mount(MazSidebar, {
        props: { open: true, width: '20rem', iconWidth: '4rem' },
      })
      const style = wrapper.find('aside').attributes('style') ?? ''
      expect(style).toContain('--maz-sidebar-width: 20rem')
      expect(style).toContain('--maz-sidebar-icon-width: 4rem')
    })
  })

  describe('when an id prop is provided', () => {
    it('then the aside uses that id', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, id: 'my-sidebar' } })
      expect(wrapper.find('aside').attributes('id')).toBe('my-sidebar')
    })
  })

  describe('when no id is provided', () => {
    it('then a unique id is auto-generated', () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      const id = wrapper.find('aside').attributes('id')
      expect(id).toBeTruthy()
      expect(id?.length).toBeGreaterThan(0)
    })
  })

  describe('when toggle is called via exposed API', () => {
    it('then it emits update:open with the inverted value', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.vm.toggle()
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })
  })

  describe('when setOpen(true) is called via exposed API', () => {
    it('then it emits update:open with true', async () => {
      const wrapper = mount(MazSidebar, { props: { open: false } })
      await wrapper.vm.setOpen(true)
      expect(wrapper.emitted('update:open')).toEqual([[true]])
    })
  })

  describe('when the open prop changes externally', () => {
    it('then the internal state reacts and updates classes', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.setProps({ open: false })
      expect(wrapper.find('aside').classes()).toContain('--collapsed')
    })
  })

  describe('when rendered in overlay mode with open=true', () => {
    it('then it does not render the push aside', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true, mode: 'overlay' } })
      await vi.dynamicImportSettled()
      expect(wrapper.find('aside.--push').exists()).toBe(false)
    })
  })

  describe('when rendered in overlay mode with open=false', () => {
    it('then the overlay aside is not in the DOM', async () => {
      const wrapper = mount(MazSidebar, {
        props: { open: false, mode: 'overlay' },
        attachTo: document.body,
      })
      await vi.dynamicImportSettled()
      expect(wrapper.find('aside.m-sidebar').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when rendered in overlay mode with side end', () => {
    it('then it mounts without error', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true, mode: 'overlay', side: 'end' } })
      await vi.dynamicImportSettled()
      expect(wrapper.find('aside.--push').exists()).toBe(false)
    })
  })

  describe('when a descendant calls useSidebar()', () => {
    it('then the context exposes mode, side, collapsible, state and open', () => {
      const captured: Record<string, unknown> = {}
      const Child = {
        setup() {
          const sidebar = useSidebar()
          captured.mode = sidebar.mode.value
          captured.side = sidebar.side.value
          captured.collapsible = sidebar.collapsible.value
          captured.state = sidebar.state.value
          captured.open = sidebar.open.value
          captured.id = sidebar.id.value
          return () => null
        },
      }
      mount(MazSidebar, {
        props: { open: true, mode: 'push', side: 'end', collapsible: 'icon', id: 'sb-1' },
        slots: { default: Child },
      })
      expect(captured.mode).toBe('push')
      expect(captured.side).toBe('end')
      expect(captured.collapsible).toBe('icon')
      expect(captured.state).toBe('expanded')
      expect(captured.open).toBe(true)
      expect(captured.id).toBe('sb-1')
    })

    it('then toggle() inverts the open state through the context', async () => {
      let sidebarCtx: ReturnType<typeof useSidebar> | undefined
      const Child = {
        setup() {
          sidebarCtx = useSidebar()
          return () => null
        },
      }
      const wrapper = mount(MazSidebar, {
        props: { open: true },
        slots: { default: Child },
      })
      sidebarCtx!.toggle()
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })
  })

  describe('when persist is enabled (default)', () => {
    it('then state changes are written to the maz-sidebar-open cookie', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      ;(wrapper.vm as unknown as { setOpen: (v: boolean) => void }).setOpen(false)
      await wrapper.vm.$nextTick()
      expect(document.cookie).toContain('maz-sidebar-open=false')
    })

    it('then a persisted false value overrides the prop default on mount', async () => {
      document.cookie = 'maz-sidebar-open=false; path=/'
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')).toEqual([[false]])
    })

    it('then the persisted value is applied during setup, before mount', () => {
      document.cookie = 'maz-sidebar-open=false; path=/'
      const wrapper = mount(MazSidebar, { props: { open: true } })
      expect(wrapper.find('aside').classes()).toContain('--collapsed')
      expect(wrapper.find('aside').classes()).not.toContain('--expanded')
    })

    it('then a missing cookie keeps the prop default', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')).toBeUndefined()
    })

    it('then a cookie value matching the prop does not emit on mount', async () => {
      document.cookie = 'maz-sidebar-open=true; path=/'
      const wrapper = mount(MazSidebar, { props: { open: true } })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')).toBeUndefined()
    })
  })

  describe('when rendered with side end', () => {
    it('then the border class is on the inline-start side', () => {
      const wrapper = mount(MazSidebar, { props: { open: true, side: 'end' } })
      expect(wrapper.find('aside').classes()).toContain('maz:border-s')
    })
  })

  describe('when persist is disabled', () => {
    it('then no cookie is written when state changes', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true, persist: false } })
      ;(wrapper.vm as unknown as { setOpen: (v: boolean) => void }).setOpen(false)
      await wrapper.vm.$nextTick()
      expect(document.cookie).not.toContain('maz-sidebar-open')
    })

    it('then an existing cookie does not override the prop on mount', async () => {
      document.cookie = 'maz-sidebar-open=false; path=/'
      const wrapper = mount(MazSidebar, { props: { open: true, persist: false } })
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:open')).toBeUndefined()
    })
  })

  describe('when a custom persistKey is provided', () => {
    it('then the custom cookie name is used', async () => {
      const wrapper = mount(MazSidebar, { props: { open: true, persistKey: 'my-sidebar' } })
      ;(wrapper.vm as unknown as { setOpen: (v: boolean) => void }).setOpen(false)
      await wrapper.vm.$nextTick()
      expect(document.cookie).toContain('my-sidebar=false')
    })
  })
})
