import MazTabsBar from '@components/MazTabsBar.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

function mountTabsBar(autoScroll: boolean) {
  return mount(MazTabsBar, {
    props: {
      autoScroll,
      items: [{ label: 'Tab 1' }, { label: 'Tab 2' }],
    },
    global: {
      provide: {
        'maz-tabs': { currentTab: ref(1), updateCurrentTab: vi.fn() },
      },
    },
  })
}

describe('given a tabs bar with autoScroll disabled', () => {
  let scrollTo: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    scrollTo = vi.fn()
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it is mounted', () => {
    it('then the indicator is placed under the active tab without scrolling the bar', async () => {
      const wrapper = mountTabsBar(false)

      await vi.runAllTimersAsync()

      const indicator = wrapper.find<HTMLElement>('.m-tabs-bar__indicator').element
      expect(indicator.style.width).toBe('0px')
      expect(indicator.style.transform).toBe('translateX(0px)')
      expect(scrollTo).not.toHaveBeenCalled()
    })
  })
})
