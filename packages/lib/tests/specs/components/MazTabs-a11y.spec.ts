import type { VueWrapper } from '@vue/test-utils'
import MazTabs from '@components/MazTabs.vue'
import MazTabsBar from '@components/MazTabsBar.vue'
import MazTabsContent from '@components/MazTabsContent.vue'
import MazTabsContentItem from '@components/MazTabsContentItem.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

function mountTabs(items: unknown[] = ['First', 'Second', 'Third']) {
  const wrapper = mount({
    components: { MazTabs, MazTabsBar, MazTabsContent, MazTabsContentItem },
    setup: () => ({ items }),
    template: `
      <MazTabs>
        <MazTabsBar :items="items" aria-label="Sections" />
        <MazTabsContent>
          <MazTabsContentItem :tab="1">Panel 1</MazTabsContentItem>
          <MazTabsContentItem :tab="2">Panel 2</MazTabsContentItem>
          <MazTabsContentItem :tab="3">Panel 3</MazTabsContentItem>
        </MazTabsContent>
      </MazTabs>
    `,
  }, { attachTo: document.body })

  mountedWrappers.push(wrapper)

  return wrapper
}

function getTabs(wrapper: VueWrapper) {
  return wrapper.findAll<HTMLElement>('[role="tab"]')
}

describe('given MazTabs with a bar and panels', () => {
  describe('when it is rendered', () => {
    it('then the bar is a labelled tablist of tabs with a hidden indicator', () => {
      const wrapper = mountTabs()
      const tablist = wrapper.find('[role="tablist"]')

      expect(tablist.attributes('aria-label')).toBe('Sections')
      expect(getTabs(wrapper)).toHaveLength(3)
      expect(wrapper.find('.m-tabs-bar__indicator').attributes('aria-hidden')).toBe('true')
    })

    it('then only the active tab is selected and in the tab sequence', () => {
      const wrapper = mountTabs()

      expect(getTabs(wrapper).map(tab => tab.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
      expect(getTabs(wrapper).map(tab => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    })

    it('then the active tab and its panel reference each other', () => {
      const wrapper = mountTabs()
      const tab = getTabs(wrapper)[0]
      const panel = wrapper.find('[role="tabpanel"]')

      expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
      expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
      expect(panel.attributes('tabindex')).toBe('0')
      expect(panel.text()).toBe('Panel 1')
    })
  })

  describe('when ArrowRight is pressed on the active tab', () => {
    it('then the next tab is focused and selected', async () => {
      const wrapper = mountTabs()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(document.activeElement).toBe(getTabs(wrapper)[1].element)
      expect(getTabs(wrapper)[1].attributes('aria-selected')).toBe('true')
      expect(getTabs(wrapper)[1].attributes('tabindex')).toBe('0')
      const panel = wrapper.find(`#${getTabs(wrapper)[1].attributes('aria-controls')}`)
      expect(panel.attributes('aria-labelledby')).toBe(getTabs(wrapper)[1].attributes('id'))
      expect(panel.text()).toBe('Panel 2')
    })
  })

  describe('when ArrowLeft is pressed on the first tab', () => {
    it('then the focus wraps to the last tab', async () => {
      const wrapper = mountTabs()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowLeft' })
      await nextTick()

      expect(document.activeElement).toBe(getTabs(wrapper)[2].element)
      expect(getTabs(wrapper)[2].attributes('aria-selected')).toBe('true')
    })
  })

  describe('when End then Home are pressed', () => {
    it('then the last then the first tab are selected', async () => {
      const wrapper = mountTabs()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'End' })
      await nextTick()
      expect(getTabs(wrapper)[2].attributes('aria-selected')).toBe('true')

      await getTabs(wrapper)[2].trigger('keydown', { key: 'Home' })
      await nextTick()
      expect(getTabs(wrapper)[0].attributes('aria-selected')).toBe('true')
    })
  })

  describe('when another key is pressed', () => {
    it('then the selection does not change', async () => {
      const wrapper = mountTabs()

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(getTabs(wrapper)[0].attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the next tab is disabled', () => {
    it('then the arrows skip it', async () => {
      const wrapper = mountTabs([{ label: 'First' }, { label: 'Second', disabled: true }, { label: 'Third' }])

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(getTabs(wrapper)[2].attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the active tab is disabled', () => {
    it('then the first enabled tab is in the tab sequence', () => {
      const wrapper = mountTabs([{ label: 'First', disabled: true }, { label: 'Second' }, { label: 'Third' }])

      expect(getTabs(wrapper).map(tab => tab.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    })
  })

  describe('when every tab is disabled', () => {
    it('then the arrows do nothing', async () => {
      const wrapper = mountTabs([{ label: 'First', disabled: true }, { label: 'Second', disabled: true }])

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(getTabs(wrapper)[0].attributes('aria-selected')).toBe('true')
    })
  })

  describe('when the direction is right-to-left', () => {
    it('then ArrowLeft moves to the next tab', async () => {
      const wrapper = mountTabs()
      wrapper.find<HTMLElement>('[role="tablist"]').element.style.direction = 'rtl'

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowLeft' })
      await nextTick()

      expect(getTabs(wrapper)[1].attributes('aria-selected')).toBe('true')
    })
  })
})

describe('given a standalone MazTabsBar', () => {
  describe('when it is rendered', () => {
    it('then the tabs have unique ids and no aria-controls', () => {
      const wrapper = mount(MazTabsBar, { props: { items: ['First', 'Second'], modelValue: 1 } })
      mountedWrappers.push(wrapper)

      const tabs = getTabs(wrapper)

      expect(tabs[0].attributes('id')).not.toBe(tabs[1].attributes('id'))
      expect(tabs.map(tab => tab.attributes('aria-controls'))).toEqual([undefined, undefined])
    })
  })

  describe('when ArrowRight is pressed', () => {
    it('then the model is updated with the next tab', async () => {
      const wrapper = mount(MazTabsBar, { props: { items: ['First', 'Second'], modelValue: 1 }, attachTo: document.body })
      mountedWrappers.push(wrapper)

      await getTabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([2])
    })
  })
})
