import type { VueWrapper } from '@vue/test-utils'
import MazTabs from '@components/MazTabs.vue'
import MazTabsBar from '@components/MazTabsBar.vue'
import MazTabsContent from '@components/MazTabsContent.vue'
import MazTabsContentItem from '@components/MazTabsContentItem.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

Element.prototype.scrollTo ??= vi.fn()

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

const items = [
  { label: 'General' },
  { label: 'Billing', badge: { content: 3 } },
  { label: 'Members', disabled: true },
  { label: 'Security', badge: { content: 12 } },
]

function mountTabs(orientation?: 'horizontal' | 'vertical') {
  const wrapper = mount({
    components: { MazTabs, MazTabsBar, MazTabsContent, MazTabsContentItem },
    setup: () => ({ items, orientation }),
    template: `
      <MazTabs :orientation="orientation">
        <MazTabsBar :items="items" aria-label="Sections" />
        <MazTabsContent>
          <MazTabsContentItem :tab="1">Panel 1</MazTabsContentItem>
          <MazTabsContentItem :tab="2">Panel 2</MazTabsContentItem>
          <MazTabsContentItem :tab="4">Panel 4</MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    `,
  }, { attachTo: document.body })

  mountedWrappers.push(wrapper)

  return wrapper
}

describe('given MazTabs with the vertical orientation', () => {
  describe('when rendered', () => {
    it('then the bar is a vertical tablist beside the content', async () => {
      const wrapper = mountTabs('vertical')
      await flushPromises()

      expect(wrapper.find('.m-tabs').classes()).toContain('--vertical')
      expect(wrapper.find('[role="tablist"]').attributes('aria-orientation')).toBe('vertical')
      expect(wrapper.find('.m-tabs-bar').classes()).toContain('--vertical')
      expect(wrapper.find('.m-tabs-content').classes()).toContain('maz:flex-1')
    })

    it('then the counters of the tabs are rendered', async () => {
      const wrapper = mountTabs('vertical')
      await flushPromises()

      const badges = wrapper.findAll('.m-tabs-bar__item__badge')

      expect(badges.map(badge => badge.text())).toEqual(['3', '12'])
      expect(badges[0].classes()).toContain('maz:ms-auto')
    })
  })

  describe('when the arrows up and down are pressed', () => {
    it('then the next enabled tab is selected and the horizontal arrows do nothing', async () => {
      const wrapper = mountTabs('vertical')
      const tabs = wrapper.findAll('[role="tab"]')

      await tabs[0].trigger('keydown', { key: 'ArrowRight' })
      expect(tabs[0].attributes('aria-selected')).toBe('true')

      await tabs[0].trigger('keydown', { key: 'ArrowDown' })
      expect(tabs[1].attributes('aria-selected')).toBe('true')

      await tabs[1].trigger('keydown', { key: 'ArrowDown' })
      expect(tabs[3].attributes('aria-selected')).toBe('true')

      await tabs[3].trigger('keydown', { key: 'ArrowUp' })
      expect(tabs[1].attributes('aria-selected')).toBe('true')
    })
  })
})

describe('given MazTabs without orientation', () => {
  describe('when rendered', () => {
    it('then the bar is horizontal and uses the horizontal arrows', async () => {
      const wrapper = mountTabs()
      const tabs = wrapper.findAll('[role="tab"]')

      expect(wrapper.find('[role="tablist"]').attributes('aria-orientation')).toBe('horizontal')
      expect(wrapper.find('.m-tabs').classes()).not.toContain('--vertical')

      await tabs[0].trigger('keydown', { key: 'ArrowDown' })
      expect(tabs[0].attributes('aria-selected')).toBe('true')

      await tabs[0].trigger('keydown', { key: 'ArrowRight' })
      expect(tabs[1].attributes('aria-selected')).toBe('true')
    })
  })
})

describe('given a standalone MazTabsBar', () => {
  describe('when the orientation is vertical', () => {
    it('then the bar is vertical without MazTabs', () => {
      const wrapper = mount(MazTabsBar, { props: { items: ['A', 'B'], orientation: 'vertical' } })

      expect(wrapper.attributes('aria-orientation')).toBe('vertical')
      expect(wrapper.classes()).toContain('--vertical')
    })
  })
})

describe('given a MazTabsContentItem in a vertical MazTabs', () => {
  describe('when the current tab changes', () => {
    it('then the transition is vertical and follows the tab order', async () => {
      const currentTab = ref(1)
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: { 'maz-tabs': { currentTab, orientation: ref('vertical') } },
          stubs: { Transition: true },
        },
      })
      const transition = wrapper.findComponent({ name: 'Transition' })

      currentTab.value = 2
      await nextTick()
      expect(transition.props('name')).toBe('maz-tab-vertical-transition')

      currentTab.value = 1
      await nextTick()
      expect(transition.props('name')).toBe('maz-tab-vertical-reverse-transition')
    })
  })
})
