import MazAvatar from '@components/MazAvatar.vue'
import MazBtn from '@components/MazBtn.vue'
import MazCard from '@components/MazCard.vue'
import MazLink from '@components/MazLink.vue'
import MazListItem from '@components/MazListItem.vue'
import MazMarkdown from '@components/MazMarkdown.vue'
import { mazSidebarKey } from '@components/MazSidebar.vue'
import MazSidebarMenuButton from '@components/MazSidebarMenuButton.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'
import { EXTERNAL_LINKS_INJECTION_KEY } from '@/utils/externalLinks.ts'

const URL_EXTERNAL = 'https://example.com/page'

function globalWith(openExternal?: (href: string, event: MouseEvent) => void) {
  return {
    provide: {
      [EXTERNAL_LINKS_INJECTION_KEY as symbol]: { openExternal },
      [mazSidebarKey as symbol]: {
        collapsible: ref('none'),
        state: ref('expanded'),
        variant: ref('sidebar'),
        isMobile: ref(false),
      },
    },
  }
}

const cases: [string, () => any, string][] = [
  ['MazLink', () => ({ component: MazLink, props: { href: URL_EXTERNAL }, slots: { default: 'Link' } }), 'a'],
  ['MazBtn', () => ({ component: MazBtn, attrs: { href: URL_EXTERNAL }, slots: { default: 'Btn' } }), 'a'],
  ['MazAvatar', () => ({ component: MazAvatar, props: { href: URL_EXTERNAL, alt: 'a' } }), 'a'],
  ['MazCard', () => ({ component: MazCard, props: { href: URL_EXTERNAL }, slots: { default: 'Card' } }), 'a.m-card__wrapper'],
  ['MazListItem', () => ({ component: MazListItem, props: { href: URL_EXTERNAL, title: 'Item' } }), 'a'],
  ['MazSidebarMenuButton', () => ({ component: MazSidebarMenuButton, props: { href: URL_EXTERNAL, label: 'Item' } }), 'a'],
]

describe.each(cases)('given %s with an href and the openExternal option', (_name, factory, selector) => {
  describe('when an external link is clicked', () => {
    it('then the navigation is prevented and the callback receives the href', () => {
      const openExternal = vi.fn()
      const { component, ...options } = factory()
      const wrapper = mount(component, { ...options, global: globalWith(openExternal) })
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })

      wrapper.find(selector).element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
      expect(openExternal).toHaveBeenCalledWith(URL_EXTERNAL, event)
    })
  })

  describe('when the option is not set', () => {
    it('then the click is untouched', () => {
      const { component, ...options } = factory()
      const wrapper = mount(component, { ...options, global: globalWith() })
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })

      wrapper.find(selector).element.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })
  })
})

describe('given MazLink with the openExternal option', () => {
  describe('when the href leaves the app', () => {
    it('then the external icon is displayed without target _blank', () => {
      const wrapper = mount(MazLink, {
        props: { href: URL_EXTERNAL },
        slots: { 'default': 'Link', 'external-icon': '<i class="ext" />' },
        global: globalWith(vi.fn()),
      })

      expect(wrapper.find('.ext').exists()).toBe(true)
    })
  })

  describe('when the href is internal', () => {
    it('then no external icon is displayed', () => {
      const wrapper = mount(MazLink, {
        props: { href: '/docs' },
        slots: { 'default': 'Link', 'external-icon': '<i class="ext" />' },
        global: globalWith(vi.fn()),
      })

      expect(wrapper.find('.ext').exists()).toBe(false)
    })
  })

  describe('when the link is a button with a click handler', () => {
    it('then nothing is prevented', async () => {
      const openExternal = vi.fn()
      const wrapper = mount(MazLink, { props: { as: 'button' }, slots: { default: 'Link' }, global: globalWith(openExternal) })

      await wrapper.trigger('click')

      expect(openExternal).not.toHaveBeenCalled()
    })
  })
})

describe('given MazMarkdown with the openExternal option', () => {
  describe('when an external link of the content is clicked', () => {
    it('then the callback is called after link-click', async () => {
      const openExternal = vi.fn()
      const wrapper = mount(MazMarkdown, {
        props: { content: `[site](${URL_EXTERNAL})` },
        global: globalWith(openExternal),
      })
      await flushPromises()
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })

      wrapper.find('a').element.dispatchEvent(event)

      expect(wrapper.emitted('link-click')).toHaveLength(1)
      expect(event.defaultPrevented).toBe(true)
      expect(openExternal).toHaveBeenCalledWith(URL_EXTERNAL, event)
    })
  })
})
