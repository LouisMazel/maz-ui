import { vTooltip } from '@directives/vTooltip.ts'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function settle() {
  await nextTick()
  await nextTick()
}

describe('given an open v-tooltip on hover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  describe('when the pointer leaves the element', () => {
    it('then the tooltip closes', async () => {
      const wrapper = mount({
        template: `<button class="target" v-tooltip="{ text: 'Hello', delay: 0 }">Target</button>`,
        directives: { tooltip: vTooltip },
      }, { attachTo: document.body })
      await settle()

      const target = wrapper.find('.target').element
      target.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(50)
      await settle()

      expect(document.querySelector('.m-tooltip-panel')?.getAttribute('data-state')).toBe('open')

      target.dispatchEvent(new Event('mouseleave'))
      await vi.advanceTimersByTimeAsync(1000)
      await settle()

      const panel = document.querySelector('.m-tooltip-panel')
      expect(panel === null || panel.getAttribute('data-state') === 'closed').toBe(true)

      wrapper.unmount()
    })
  })
})

describe('given an open v-tooltip with an open delay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  describe('when the pointer leaves the element', () => {
    it('then the tooltip closes without waiting for the delay', async () => {
      const wrapper = mount({
        template: `<button class="target" v-tooltip="{ text: 'Hello', delay: 800 }">Target</button>`,
        directives: { tooltip: vTooltip },
      }, { attachTo: document.body })
      await settle()

      const target = wrapper.find('.target').element
      target.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(900)
      await settle()

      target.dispatchEvent(new Event('mouseleave'))
      await vi.advanceTimersByTimeAsync(10)
      await settle()

      const panel = document.querySelector('.m-tooltip-panel')
      expect(panel === null || panel.getAttribute('data-state') === 'closed').toBe(true)

      wrapper.unmount()
    })
  })
})
