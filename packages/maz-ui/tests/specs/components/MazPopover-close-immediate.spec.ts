import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

function mountHoverPopover() {
  return mount(MazPopover, {
    props: { trigger: 'hover', delay: 500 },
    slots: { trigger: '<button>Trigger</button>', default: 'Content' },
    attachTo: document.body,
    global: { stubs: { teleport: true } },
  })
}

describe('given an open popover with a hover delay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  describe('when close is called with true', () => {
    it('then it closes without waiting for the delay', async () => {
      const wrapper = mountHoverPopover()
      wrapper.vm.open()
      await vi.advanceTimersByTimeAsync(600)
      await nextTick()

      wrapper.vm.close(true)
      await nextTick()

      expect(wrapper.vm.isOpen).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when close is called with an event object', () => {
    it('then it keeps the delay of the hover trigger', async () => {
      const wrapper = mountHoverPopover()
      wrapper.vm.open()
      await vi.advanceTimersByTimeAsync(600)
      await nextTick()

      wrapper.vm.close(new MouseEvent('mouseleave') as unknown as boolean)
      await nextTick()
      expect(wrapper.vm.isOpen).toBe(true)

      await vi.advanceTimersByTimeAsync(600)
      await nextTick()
      expect(wrapper.vm.isOpen).toBe(false)
      wrapper.unmount()
    })
  })
})
