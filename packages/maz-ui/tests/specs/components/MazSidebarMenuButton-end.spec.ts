import MazSidebar from '@components/MazSidebar.vue'
import MazSidebarMenuButton from '@components/MazSidebarMenuButton.vue'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

function mountButton(props: Record<string, unknown>, slots?: Record<string, () => unknown>) {
  return mount(MazSidebar, {
    props: { open: true },
    slots: {
      default: () => h(MazSidebarMenuButton, props, slots),
    },
  })
}

describe('given MazSidebarMenuButton end content', () => {
  describe('when the end slot is provided', () => {
    it('then it is rendered after the label and the label keeps its truncation', () => {
      const wrapper = mountButton({ label: 'Docs' }, { end: () => h('i', { class: 'external' }) })
      const html = wrapper.find('.m-sidebar-menu-btn').html()

      expect(wrapper.find('.m-sidebar-menu-btn__end .external').exists()).toBe(true)
      expect(html.indexOf('m-sidebar-menu-btn__label')).toBeLessThan(html.indexOf('m-sidebar-menu-btn__end'))
      expect(wrapper.find('.m-sidebar-menu-btn__label').classes()).toContain('maz:truncate')
      expect(wrapper.find('.m-sidebar-menu-btn__end').classes()).toContain('maz:shrink-0')
    })
  })

  describe('when a badge and an end slot are provided', () => {
    it('then both are rendered', () => {
      const wrapper = mountButton({ label: 'Docs', badge: 3 }, { end: () => h('i', { class: 'external' }) })

      expect(wrapper.find('.m-sidebar-menu-btn__badge').exists()).toBe(true)
      expect(wrapper.find('.m-sidebar-menu-btn__end').exists()).toBe(true)
    })
  })

  describe('when no end content is provided', () => {
    it('then the end zone is not rendered', () => {
      const wrapper = mountButton({ label: 'Docs' })

      expect(wrapper.find('.m-sidebar-menu-btn__end').exists()).toBe(false)
    })
  })
})
