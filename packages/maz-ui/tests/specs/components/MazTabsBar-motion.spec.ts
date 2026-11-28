import MazTabsBar from '@components/MazTabsBar.vue'
import { mount } from '@vue/test-utils'

Element.prototype.scrollTo = vi.fn()

function mountBar(props: Record<string, unknown> = {}) {
  return mount(MazTabsBar, {
    props: {
      items: ['One', 'Two', { label: 'Three', disabled: true }, 'Four'],
      modelValue: 1,
      ...props,
    },
    attachTo: document.body,
  })
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(async () => {
  await vi.runAllTimersAsync()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('given a tabs bar', () => {
  describe('when it is mounted', () => {
    it('then the indicator is placed under the active tab and follows the start edge', async () => {
      const wrapper = mountBar()

      await vi.runAllTimersAsync()

      const indicator = wrapper.get<HTMLElement>('.m-tabs-bar__indicator')
      expect(indicator.element.style.transform).toBe('translateX(0px)')
      expect(indicator.classes()).toContain('maz:inset-s-0')
      expect(indicator.element.style.opacity).toBe('')
    })
  })

  describe('when the keyboard moves between tabs', () => {
    it('then End selects the last enabled tab and Home the first one', async () => {
      const wrapper = mountBar()
      const tabs = wrapper.findAll('[role="tab"]')

      await tabs[0].trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([4])

      await wrapper.setProps({ modelValue: 4 })
      await tabs[3].trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:model-value')?.[1]).toEqual([1])
    })

    it('then the arrows skip the disabled tab and loop', async () => {
      const wrapper = mountBar({ modelValue: 2 })
      const tabs = wrapper.findAll('[role="tab"]')

      await tabs[1].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([4])

      await tabs[3].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:model-value')?.[1]).toEqual([1])
    })

    it('then the arrows of the other axis do nothing', async () => {
      const wrapper = mountBar()

      await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowDown' })

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then the arrows of a vertical bar are up and down', async () => {
      const wrapper = mountBar({ orientation: 'vertical' })
      const tabs = wrapper.findAll('[role="tab"]')

      await tabs[0].trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:model-value')).toBeUndefined()

      await tabs[0].trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([2])
    })
  })

  describe('when the arrows move the focus', () => {
    it('then the focused tab is the one of the model', async () => {
      const wrapper = mountBar()
      const tabs = wrapper.findAll<HTMLElement>('[role="tab"]')

      await tabs[0].trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(tabs[1].element)
    })
  })

  describe('when the orientation changes', () => {
    it('then the indicator of the new orientation is the one displayed', async () => {
      const wrapper = mountBar()

      await vi.runAllTimersAsync()
      await wrapper.setProps({ orientation: 'vertical' })
      await vi.runAllTimersAsync()

      const indicator = wrapper.get<HTMLElement>('.m-tabs-bar__indicator')
      expect(indicator.classes()).toContain('maz:top-0')
      expect(indicator.element.style.transform).toBe('translate(0px)')
    })
  })
})
