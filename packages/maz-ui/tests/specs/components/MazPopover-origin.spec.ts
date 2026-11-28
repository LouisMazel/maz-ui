import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function settle() {
  await nextTick()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

function mountPopover(props: Record<string, unknown> = {}) {
  return mount(MazPopover, {
    attachTo: document.body,
    props: { modelValue: true, position: 'bottom', ...props },
    slots: { trigger: '<button class="trigger">Open</button>', default: '<p>Content</p>' },
    global: { stubs: { teleport: false } },
  })
}

describe('given a MazPopover panel', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when it is open', () => {
    it('then it exposes data-state open and data-side', async () => {
      const wrapper = mountPopover()
      await settle()

      const panel = document.querySelector('.m-popover-panel') as HTMLElement

      expect(panel.dataset.state).toBe('open')
      expect(panel.dataset.side).toBe('bottom')

      wrapper.unmount()
    })

    it('then the transform origin follows the CSS variable', async () => {
      const wrapper = mountPopover()
      await settle()

      const panel = document.querySelector('.m-popover-panel') as HTMLElement

      expect(panel.style.transformOrigin).toContain('var(--maz-popover-transform-origin')
      expect(panel.style.getPropertyValue('--maz-popover-transform-origin')).toMatch(/px \d+(\.\d+)?px$/)

      wrapper.unmount()
    })
  })

  describe('when the position reference is a point', () => {
    it('then the panel opens and exposes its origin', async () => {
      const wrapper = mountPopover({ positionReference: { x: 120, y: 80 } })
      await settle()

      const panel = document.querySelector('.m-popover-panel') as HTMLElement

      expect(panel).not.toBeNull()
      expect(panel.style.getPropertyValue('--maz-popover-transform-origin')).not.toBe('')

      wrapper.unmount()
    })
  })

  describe('when it closes', () => {
    it('then data-state is closed during the leave', async () => {
      const wrapper = mountPopover()
      await settle()

      const panel = document.querySelector('.m-popover-panel') as HTMLElement
      await wrapper.setProps({ modelValue: false })
      await nextTick()

      expect(panel.dataset.state).toBe('closed')

      wrapper.unmount()
    })
  })
})
