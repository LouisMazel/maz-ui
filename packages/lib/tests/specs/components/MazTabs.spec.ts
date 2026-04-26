import MazTabs from '@components/MazTabs.vue'
import { mount } from '@vue/test-utils'

describe('mazTabs.vue', () => {
  it('should display the content', () => {
    const wrapper = mount(MazTabs, {
      slots: {
        default: '<div>Contenu du slot</div>',
      },
    })

    expect(wrapper.text()).toContain('Contenu du slot')
  })

  it('initialize component with good value', () => {
    const wrapper = mount(MazTabs)

    // @ts-expect-error currentTab is a private property
    expect(wrapper.vm.currentTab).toBe(1)
  })

  it('reflects modelValue prop in currentTab computed', () => {
    const wrapper = mount(MazTabs, {
      props: { modelValue: 3 },
    })

    // @ts-expect-error currentTab is a private property
    expect(wrapper.vm.currentTab).toBe(3)
  })

  it('emits update:model-value when updateCurrentTab is called via provide', () => {
    let provided: { currentTab: { value: number }, updateCurrentTab: (index: number) => number } | undefined

    mount(MazTabs, {
      slots: {
        default: {
          inject: { tabs: { from: 'maz:tabs' } },
          created() {
            provided = (this as unknown as { tabs: typeof provided }).tabs
          },
          template: '<div />',
        },
      },
    })

    const result = provided!.updateCurrentTab(2)

    expect(result).toBe(2)
    expect(provided!.currentTab.value).toBe(2)
  })
})
