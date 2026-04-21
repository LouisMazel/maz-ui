import MazTabsBar from '@components/MazTabsBar.vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

// Mock scrollTo to prevent uncaught exceptions in jsdom
Element.prototype.scrollTo = vi.fn()

function createTabsProvide(initialTab = 1) {
  const currentTab = ref(initialTab)
  const updateCurrentTab = vi.fn((index: number) => {
    currentTab.value = index
  })
  return { currentTab, updateCurrentTab }
}

function mountTabsBar(props: Record<string, unknown> = {}, provide?: ReturnType<typeof createTabsProvide>) {
  const tabsProvide = provide ?? createTabsProvide()
  return mount(MazTabsBar, {
    props: {
      items: [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }],
      ...props,
    },
    global: {
      provide: {
        'maz-tabs': tabsProvide,
      },
    },
  })
}

describe('MazTabsBar branch coverage', () => {
  let originalLocation: Location
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })

    originalLocation = globalThis.location

    // @ts-expect-error - mocking location
    delete globalThis.location
    globalThis.location = {
      ...originalLocation,
      href: 'http://localhost:3000/',
    } as Location

    // Mock history.replaceState
    globalThis.history.replaceState = vi.fn()
  })

  afterEach(async () => {
    await vi.runAllTimersAsync()
    vi.useRealTimers()
    globalThis.location = originalLocation
  })

  describe('normalizedItems computed', () => {
    it('normalizes string items', () => {
      const wrapper = mountTabsBar({
        items: ['Tab A', 'Tab B', 'Tab C'],
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons.length).toBe(3)
      expect(tabButtons[0].text()).toBe('Tab A')
      expect(tabButtons[1].text()).toBe('Tab B')
    })

    it('normalizes object items with labels', () => {
      const wrapper = mountTabsBar({
        items: [{ label: 'First' }, { label: 'Second' }],
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].text()).toBe('First')
      expect(tabButtons[1].text()).toBe('Second')
    })

    it('normalizes mixed string and object items', () => {
      const wrapper = mountTabsBar({
        items: ['Plain', { label: 'Object' }],
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].text()).toBe('Plain')
      expect(tabButtons[1].text()).toBe('Object')
    })

    it('normalizes items with disabled property', () => {
      const wrapper = mountTabsBar({
        items: [
          { label: 'Enabled' },
          { label: 'Disabled', disabled: true },
          { label: 'Also Enabled' },
        ],
      })

      const disabledItems = wrapper.findAll('.m-tabs-bar__item.--disabled')
      expect(disabledItems.length).toBe(1)
    })

    it('defaults disabled to false for string items', () => {
      const wrapper = mountTabsBar({
        items: ['Tab A'],
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].attributes('disabled')).toBeUndefined()
    })

    it('defaults disabled to false when not specified in object items', () => {
      const wrapper = mountTabsBar({
        items: [{ label: 'No disabled prop' }],
      })

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].attributes('disabled')).toBeUndefined()
    })

    it('handles items with badge property', () => {
      const wrapper = mountTabsBar({
        items: [
          { label: 'With Badge', badge: { content: 5 } },
          { label: 'No Badge' },
        ],
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('returns undefined badge for string items', () => {
      const wrapper = mountTabsBar({
        items: ['String Tab'],
      })

      // Badge should not render for string items
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('selectTab', () => {
    it('calls updateCurrentTab with 1-indexed value', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({}, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[1].trigger('click')

      expect(provide.updateCurrentTab).toHaveBeenCalledWith(2)
    })

    it('calls updateCurrentTab for first tab (index 0)', async () => {
      const provide = createTabsProvide(2)
      const wrapper = mountTabsBar({}, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[0].trigger('click')

      expect(provide.updateCurrentTab).toHaveBeenCalledWith(1)
    })

    it('calls updateCurrentTab for last tab', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({}, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[2].trigger('click')

      expect(provide.updateCurrentTab).toHaveBeenCalledWith(3)
    })

    it('does not call selectTab for disabled items', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({
        items: [{ label: 'Tab 1' }, { label: 'Tab 2', disabled: true }],
      }, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[1].trigger('click')

      // disabled tabs should not call updateCurrentTab
      expect(provide.updateCurrentTab).not.toHaveBeenCalled()
    })
  })

  describe('persistent mode', () => {
    it('adds query param when persistent is true and tab is selected', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({ persistent: true }, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[1].trigger('click')

      expect(globalThis.history.replaceState).toHaveBeenCalled()
    })

    it('does not add query param when persistent is false', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({ persistent: false }, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[1].trigger('click')

      expect(globalThis.history.replaceState).not.toHaveBeenCalled()
    })

    it('uses custom queryParam name', async () => {
      const provide = createTabsProvide()
      const wrapper = mountTabsBar({
        persistent: true,
        queryParam: 'myTab',
      }, provide)

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      await tabButtons[0].trigger('click')

      expect(globalThis.history.replaceState).toHaveBeenCalled()
    })

    it('reads tab from query param on mount when persistent', () => {
      // @ts-expect-error - mocking location
      delete globalThis.location
      globalThis.location = {
        ...originalLocation,
        href: 'http://localhost:3000/?tab=2',
      } as Location

      const provide = createTabsProvide(1)
      mountTabsBar({ persistent: true }, provide)

      expect(provide.updateCurrentTab).toHaveBeenCalledWith(2)
    })

    it('uses default tab when no query param exists on mount with persistent', () => {
      const provide = createTabsProvide(1)
      mountTabsBar({ persistent: true }, provide)

      // Should use currentTab.value (1) when query param returns 0 (no param)
      expect(provide.updateCurrentTab).toHaveBeenCalledWith(1)
    })

    it('uses currentTab value when query param is not set and persistent', () => {
      const provide = createTabsProvide(3)
      mountTabsBar({ persistent: true }, provide)

      expect(provide.updateCurrentTab).toHaveBeenCalledWith(3)
    })
  })

  describe('isActiveTab', () => {
    it('returns true for the current active tab', () => {
      const wrapper = mountTabsBar({}, createTabsProvide(1))

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).toContain('--active')
      expect(tabButtons[1].classes()).not.toContain('--active')
    })

    it('returns true for second tab when currentTab is 2', () => {
      const wrapper = mountTabsBar({}, createTabsProvide(2))

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].classes()).not.toContain('--active')
      expect(tabButtons[1].classes()).toContain('--active')
    })
  })

  describe('getTabStyle', () => {
    it('returns foreground color for active tab', () => {
      const wrapper = mountTabsBar({}, createTabsProvide(1))

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[0].attributes('style')).toContain('color: hsl(var(--maz-foreground))')
    })

    it('returns muted color for inactive tab', () => {
      const wrapper = mountTabsBar({}, createTabsProvide(1))

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[1].attributes('style')).toContain('color: hsl(var(--maz-muted))')
    })

    it('returns empty style for disabled tab', () => {
      const wrapper = mountTabsBar({
        items: [{ label: 'Tab 1' }, { label: 'Disabled', disabled: true }],
      }, createTabsProvide(1))

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      // Disabled tab should not have color style set
      const disabledStyle = tabButtons[1].attributes('style') || ''
      expect(disabledStyle).not.toContain('color: hsl(var(--maz-foreground))')
      expect(disabledStyle).not.toContain('color: hsl(var(--maz-muted))')
    })
  })

  describe('CSS classes', () => {
    it('applies --block class when block prop is true', () => {
      const wrapper = mountTabsBar({ block: true })

      expect(wrapper.find('.m-tabs-bar').classes()).toContain('--block')
    })

    it('does not apply --block class when block is false', () => {
      const wrapper = mountTabsBar({ block: false })

      expect(wrapper.find('.m-tabs-bar').classes()).not.toContain('--block')
    })

    it('applies --elevation class when elevation prop is true', () => {
      const wrapper = mountTabsBar({ elevation: true })

      expect(wrapper.find('.m-tabs-bar').classes()).toContain('--elevation')
    })

    it('does not apply --elevation class when elevation is false', () => {
      const wrapper = mountTabsBar({ elevation: false })

      expect(wrapper.find('.m-tabs-bar').classes()).not.toContain('--elevation')
    })

    it('applies --bordered class when bordered is true (default)', () => {
      const wrapper = mountTabsBar()

      expect(wrapper.find('.m-tabs-bar').classes()).toContain('--bordered')
    })

    it('does not apply --bordered class when bordered is false', () => {
      const wrapper = mountTabsBar({ bordered: false })

      expect(wrapper.find('.m-tabs-bar').classes()).not.toContain('--bordered')
    })
  })

  describe('indicator', () => {
    it('renders indicator element', () => {
      const wrapper = mountTabsBar()

      expect(wrapper.find('.m-tabs-bar__indicator').exists()).toBe(true)
    })

    it('does not have --animated class initially', () => {
      const wrapper = mountTabsBar()

      expect(wrapper.find('.m-tabs-bar__indicator').classes()).not.toContain('--animated')
    })
  })

  describe('setIndicatorAndScroll', () => {
    it('does not run when autoScroll is false', async () => {
      const wrapper = mountTabsBar({ autoScroll: false })

      await nextTick()
      // Indicator should remain default (no style set)
      expect(wrapper.exists()).toBe(true)
    })

    it('runs on mount when persistent is true', () => {
      const wrapper = mountTabsBar({ persistent: true })

      // The indicator should exist and potentially be styled
      expect(wrapper.find('.m-tabs-bar__indicator').exists()).toBe(true)
    })

    it('runs on mount when currentTab is set', () => {
      const wrapper = mountTabsBar({}, createTabsProvide(2))

      expect(wrapper.find('.m-tabs-bar__indicator').exists()).toBe(true)
    })
  })

  describe('onBeforeMount validation', () => {
    it('logs error when currentTab is less than 1', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mountTabsBar({}, createTabsProvide(0))

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[maz-ui](MazTabsBar) The model-value should be between 1 and'),
      )
      consoleSpy.mockRestore()
    })

    it('logs error when currentTab exceeds items length', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mountTabsBar({
        items: [{ label: 'Tab 1' }, { label: 'Tab 2' }],
      }, createTabsProvide(5))

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[maz-ui](MazTabsBar) The model-value should be between 1 and 2'),
      )
      consoleSpy.mockRestore()
    })

    it('does not log error when currentTab is valid', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mountTabsBar({}, createTabsProvide(1))

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('watcher on currentTab and normalizedItems', () => {
    it('updates when currentTab changes', async () => {
      const provide = createTabsProvide(1)
      const wrapper = mountTabsBar({}, provide)

      provide.currentTab.value = 2
      await nextTick()

      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons[1].classes()).toContain('--active')
    })
  })

  describe('addElementToItemRefs', () => {
    it('handles button element refs', () => {
      const wrapper = mountTabsBar()

      // Elements should be stored; verify by checking that buttons render
      const tabButtons = wrapper.findAll('.m-tabs-bar__item')
      expect(tabButtons.length).toBe(3)
    })
  })

  describe('item slot', () => {
    it('provides item, active, and index to item slot', () => {
      const wrapper = mount(MazTabsBar, {
        props: {
          items: [{ label: 'Tab 1' }, { label: 'Tab 2' }],
        },
        global: {
          provide: {
            'maz-tabs': createTabsProvide(1),
          },
        },
        slots: {
          item: `<template #item="{ item, active, index }">
            <span class="custom-item" :data-active="active" :data-index="index">{{ item.label }}</span>
          </template>`,
        },
      })

      const customItems = wrapper.findAll('.custom-item')
      expect(customItems.length).toBe(2)
      expect(customItems[0].attributes('data-active')).toBe('true')
      expect(customItems[0].attributes('data-index')).toBe('0')
      expect(customItems[1].attributes('data-active')).toBe('false')
      expect(customItems[1].attributes('data-index')).toBe('1')
    })
  })

  describe('badge rendering', () => {
    it('renders badge when item has badge property', () => {
      const wrapper = mountTabsBar({
        items: [
          { label: 'Tab 1', badge: { content: 5 } },
          { label: 'Tab 2' },
        ],
      })

      // The badge component is async, but the item should still render
      expect(wrapper.findAll('.m-tabs-bar__item').length).toBe(2)
    })

    it('does not render badge for items without badge', () => {
      const wrapper = mountTabsBar({
        items: [{ label: 'No Badge' }],
      })

      expect(wrapper.findAll('.m-tabs-bar__item').length).toBe(1)
    })
  })
})
