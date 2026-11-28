import { vTooltip } from '@directives/vTooltip.ts'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function settle() {
  await nextTick()
  await nextTick()
}

const panels = () => document.querySelectorAll('.m-tooltip-panel')

describe('given the v-tooltip directive lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
    vi.resetModules()
  })

  describe('when the binding changes while the tooltip is open', () => {
    it('then the tooltip is closed and removed after its close animation', async () => {
      const wrapper = mount({
        template: `<button class="target" v-tooltip="{ text: label, delay: 0 }">Target</button>`,
        directives: { tooltip: vTooltip },
        data: () => ({ label: 'Hello' }),
      }, { attachTo: document.body })
      await settle()

      wrapper.find('.target').element.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(50)
      await settle()

      expect(panels()).toHaveLength(1)

      await wrapper.setData({ label: 'Changed' })
      await vi.advanceTimersByTimeAsync(1000)
      await settle()

      expect(panels()).toHaveLength(0)

      wrapper.unmount()
    })
  })

  describe('when a tooltip is already open', () => {
    it('then the next one opens without its delay', async () => {
      const wrapper = mount({
        template: `<div><button class="first" v-tooltip="{ text: 'One', delay: 5000 }">1</button><button class="second" v-tooltip="{ text: 'Two', delay: 5000 }">2</button></div>`,
        directives: { tooltip: vTooltip },
      }, { attachTo: document.body })
      await settle()

      wrapper.find('.first').element.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(5100)
      await settle()

      expect(panels()).toHaveLength(1)

      wrapper.find('.second').element.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(50)
      await settle()

      expect(panels()).toHaveLength(2)

      wrapper.unmount()
    })
  })

  describe('when the directive is updated before it was ever mounted', () => {
    it('then it creates its handler and mounts the tooltip', async () => {
      vi.resetModules()
      const fresh = await import('@directives/vTooltip.ts')
      const element = document.createElement('div')
      document.body.append(element)

      fresh.vTooltip.updated?.(element, { value: 'Late', modifiers: {} } as never, null as never, null as never)
      await vi.advanceTimersByTimeAsync(10)
      await settle()

      element.dispatchEvent(new Event('mouseenter'))
      await vi.advanceTimersByTimeAsync(1000)
      await settle()

      expect(panels()).toHaveLength(1)
    })
  })
})
