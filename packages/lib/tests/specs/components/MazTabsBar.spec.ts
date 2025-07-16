import MazTabsBar from '@components/MazTabsBar.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('mazTabsBar.vue', () => {
  it('correctly displays tabs', () => {
    const items = [{ label: 'Tab 1' }, { label: 'Tab 2', disabled: true }, { label: 'Tab 3' }]
    const wrapper = mount(MazTabsBar, {
      props: { items },
      global: {
        provide: {
          'maz-tabs': {
            currentTab: ref(1),
            updateCurrentTab: vi.fn(),
          },
        },
      },
    })

    const tabLabels = wrapper.findAll('.m-tabs-bar__item')

    expect(tabLabels.length).toBe(3)

    expect(tabLabels[0].text()).toBe('Tab 1')
    expect(tabLabels[1].text()).toBe('Tab 2')
    expect(tabLabels[2].text()).toBe('Tab 3')

    const disabledTabs = wrapper.findAll('.m-tabs-bar__item.--disabled')

    expect(disabledTabs.length).toBe(1)
  })

  it('correctly initializes the model value', () => {
    const items = [{ label: 'Tab 1' }, { label: 'Tab 2', disabled: true }, { label: 'Tab 3' }]
    const wrapper = mount(MazTabsBar, {
      props: { items },
      global: {
        provide: {
          'maz-tabs': {
            currentTab: ref(1),
            updateCurrentTab: vi.fn(),
          },
        },
      },
    })

    // @ts-expect-error - currentTab is private
    expect(wrapper.vm.currentTab).toBe(1)
  })

  it('updates the model value when a tab is clicked', async () => {
    const items = [{ label: 'Tab 1' }, { label: 'Tab 2', disabled: true }, { label: 'Tab 3' }]
    const currentTab = ref(1)
    const wrapper = mount(MazTabsBar, {
      props: { items },
      global: {
        provide: {
          'maz-tabs': {
            currentTab,
            updateCurrentTab: (index: number) => (currentTab.value = index),
          },
        },
      },
    })

    await wrapper.find('.m-tabs-bar__item:nth-child(4)').trigger('click')

    // @ts-expect-error - currentTab is private
    expect(wrapper.vm.currentTab).toBe(3)
  })
})
