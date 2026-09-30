import type { MazTabsBarItem } from '@components/MazTabsBar.vue'
import MazTabsBar from '@components/MazTabsBar.vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

Element.prototype.scrollTo = vi.fn()

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(async () => {
  await vi.runAllTimersAsync()
  vi.useRealTimers()
})

describe('given MazTabsBar used without MazTabs (standalone)', () => {
  describe('when no value is defined on items', () => {
    it('emits the 1-based index on selection', async () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2', 'Tab 3'] },
      })

      await wrapper.findAll('.m-tabs-bar__item')[1].trigger('click')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([2])
    })

    it('marks the first tab active by default', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'] },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).toContain('--is-active')
      expect(tabButtons[1].classes()).not.toContain('--is-active')
    })

    it('activates the tab matching the numeric model value', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2', 'Tab 3'], modelValue: 3 },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[2].classes()).toContain('--is-active')
    })
  })

  describe('when a value is defined on items', () => {
    const items: MazTabsBarItem[] = [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
      { label: 'Third', value: 'third' },
    ]

    it('emits the item value on selection', async () => {
      const wrapper = mount(MazTabsBar, {
        props: { items },
      })

      await wrapper.findAll('.m-tabs-bar__item')[1].trigger('click')

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['second'])
    })

    it('activates the tab matching the value model', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items, modelValue: 'third' },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[2].classes()).toContain('--is-active')
    })
  })
})

describe('given MazTabsBar size and roundedSize props', () => {
  describe('when size is set', () => {
    it('forwards the size class to each tab button', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'], size: 'sm' },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).toContain('--sm')
    })
  })

  describe('when roundedSize is set', () => {
    it('applies the rounded class to the root, the indicator and the buttons', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'], roundedSize: 'lg' },
      })

      expect(wrapper.find('.m-tabs-bar').classes()).toContain('maz:rounded-lg')
      expect(wrapper.find('.m-tabs-bar__indicator').classes()).toContain('maz:rounded-lg')
      expect(wrapper.find('.m-tabs-bar__item').classes()).toContain('--rounded-lg')
    })
  })

  describe('when an item overrides size and roundedSize', () => {
    it('uses the item values over the bar values', () => {
      const items: MazTabsBarItem[] = [
        { label: 'Default' },
        { label: 'Custom', size: 'xl', roundedSize: 'full' },
      ]
      const wrapper = mount(MazTabsBar, {
        props: { items, size: 'sm', roundedSize: 'none' },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).toContain('--sm')
      expect(tabButtons[1].classes()).toContain('--xl')
      expect(tabButtons[1].classes()).toContain('--rounded-full')
    })
  })
})

describe('given MazTabsBar color prop', () => {
  describe('when color is set', () => {
    it('colors the indicator background', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'], color: 'primary' },
      })

      expect(wrapper.find('.m-tabs-bar__indicator').attributes('style')).toContain('var(--maz-primary)')
    })

    it('colors the active tab text with the color foreground', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'], color: 'primary', modelValue: 1 },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].attributes('style')).toContain('color: var(--maz-primary-foreground)')
    })
  })

  describe('when color is not set', () => {
    it('keeps the default neutral indicator', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'] },
      })

      expect(wrapper.find('.m-tabs-bar__indicator').classes()).toContain('maz:bg-surface-600')
    })
  })
})

describe('given MazTabsBar items forwarding MazBtn props', () => {
  describe('when an item sets outlined', () => {
    it('forwards the prop to the tab button', () => {
      const items: MazTabsBarItem[] = [
        { label: 'Plain' },
        { label: 'Outlined', outlined: true },
      ]
      const wrapper = mount(MazTabsBar, {
        props: { items },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[1].classes()).toContain('--outlined')
    })
  })
})

describe('given MazTabsBar inside MazTabs providing size and roundedSize', () => {
  describe('when MazTabsBar has no own size', () => {
    it('uses the injected size from the provide', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'] },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
              updateCurrentTab: vi.fn(),
              size: ref('xs'),
              roundedSize: ref('xl'),
            },
          },
        },
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).toContain('--xs')
      expect(wrapper.find('.m-tabs-bar').classes()).toContain('maz:rounded-xl')
    })

    it('lets the own MazTabsBar size win over the injected one', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'], size: 'lg' },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
              updateCurrentTab: vi.fn(),
              size: ref('xs'),
              roundedSize: ref('xl'),
              color: ref(undefined),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-bar__item').classes()).toContain('--lg')
    })

    it('ignores the MazTabs context when standalone is set', async () => {
      const updateCurrentTab = vi.fn()
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2', 'Tab 3'], standalone: true },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
              updateCurrentTab,
              size: ref('xs'),
              roundedSize: ref('xl'),
              color: ref('primary'),
            },
          },
        },
      })

      await wrapper.findAll('.m-tabs-bar__item')[1].trigger('click')

      expect(updateCurrentTab).not.toHaveBeenCalled()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([2])
      expect(wrapper.find('.m-tabs-bar__item').classes()).not.toContain('--xs')
      expect(wrapper.find('.m-tabs-bar__indicator').classes()).toContain('maz:bg-surface-600')
    })

    it('uses the injected color for the indicator', () => {
      const wrapper = mount(MazTabsBar, {
        props: { items: ['Tab 1', 'Tab 2'] },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
              updateCurrentTab: vi.fn(),
              size: ref(undefined),
              roundedSize: ref(undefined),
              color: ref('primary'),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-bar__indicator').attributes('style')).toContain('var(--maz-primary)')
    })
  })
})
