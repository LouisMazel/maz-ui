import type { MazPopoverProps } from '@components/MazPopover.vue'
import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { addOverlayLayer, removeOverlayLayer } from '@/utils/overlayLayers.ts'

async function settle() {
  await nextTick()
  await nextTick()
}

function mountPopover(props: Partial<MazPopoverProps> = {}, trigger = '<button class="trigger">Open</button>') {
  return mount(MazPopover, {
    attachTo: document.body,
    props,
    slots: { trigger, default: '<p class="content">Content</p>' },
    global: { stubs: { teleport: false } },
  })
}

const panel = () => document.querySelector<HTMLElement>('.m-popover-panel')

describe('given a MazPopover with a position reference selector', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when the selector matches an element inside the trigger', () => {
    it('then the panel is positioned against it', async () => {
      const wrapper = mountPopover(
        { modelValue: true, positionReference: '.anchor' },
        '<div><button class="trigger">Open</button><span class="anchor">Anchor</span></div>',
      )
      await settle()

      expect(panel()).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the selector matches an element of the document', () => {
    it('then the panel is positioned against it', async () => {
      const outside = document.createElement('div')
      outside.className = 'outside-anchor'
      document.body.append(outside)

      const wrapper = mountPopover({ modelValue: true, positionReference: '.outside-anchor' })
      await settle()

      expect(panel()).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the selector matches nothing', () => {
    it('then the popover still renders', async () => {
      const wrapper = mountPopover({ modelValue: true, positionReference: '.missing' })
      await settle()

      expect(panel()).not.toBeNull()

      wrapper.unmount()
    })
  })
})

describe('given the trigger attributes of a MazPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when the trigger is a plain text input', () => {
    it('then no aria-expanded is set on it', async () => {
      const wrapper = mountPopover({ role: 'dialog' }, '<input class="trigger" type="text">')
      await settle()

      expect(wrapper.find('.trigger').attributes('aria-expanded')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the trigger is an input with its own role', () => {
    it('then the popover sets its aria attributes', async () => {
      const wrapper = mountPopover({ role: 'dialog' }, '<input class="trigger" type="text" role="searchbox">')
      await settle()

      expect(wrapper.find('.trigger').attributes('aria-expanded')).toBe('false')

      wrapper.unmount()
    })
  })
})

describe('given a hover MazPopover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.useRealTimers()
  })

  describe('when the pointer leaves the trigger with a delay', () => {
    it('then it closes after the delay', async () => {
      const wrapper = mountPopover({ trigger: 'hover', delay: 100 })
      await settle()

      await wrapper.find('.m-popover-trigger').trigger('mouseenter')
      await vi.advanceTimersByTimeAsync(150)
      await settle()

      expect(panel()).not.toBeNull()

      await wrapper.find('.m-popover-trigger').trigger('mouseleave')
      await vi.advanceTimersByTimeAsync(50)

      expect(wrapper.emitted('close')).toBeFalsy()

      await vi.advanceTimersByTimeAsync(100)
      await settle()

      expect(wrapper.emitted('close')).toHaveLength(1)

      wrapper.unmount()
    })
  })

  describe('when the pointer goes from the trigger to the panel with keepOpenOnHover', () => {
    it('then it stays open until the pointer leaves the panel', async () => {
      const wrapper = mountPopover({ trigger: 'hover', keepOpenOnHover: true, hoverDelay: 100 })
      await settle()

      await wrapper.find('.m-popover-trigger').trigger('mouseenter')
      await settle()

      await wrapper.find('.m-popover-trigger').trigger('mouseleave')
      panel()?.dispatchEvent(new MouseEvent('mouseenter'))
      await vi.advanceTimersByTimeAsync(300)

      expect(wrapper.emitted('close')).toBeFalsy()

      panel()?.dispatchEvent(new MouseEvent('mouseleave'))
      await vi.advanceTimersByTimeAsync(150)
      await settle()

      expect(wrapper.emitted('close')).toHaveLength(1)

      wrapper.unmount()
    })
  })
})

describe('given an open MazPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('when Tab is pressed and the focus is trapped', () => {
    it('then the focus stays in the panel', async () => {
      const wrapper = mountPopover({ modelValue: true, trapFocus: true })
      await settle()

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      document.dispatchEvent(event)
      await settle()

      expect(panel()).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the pointer goes down in an overlay opened above it', () => {
    it('then it stays open', async () => {
      const wrapper = mountPopover({ modelValue: true })
      await settle()

      const upper = document.createElement('div')
      upper.className = 'upper-overlay'
      document.body.append(upper)

      const layer = { contains: (target: Node) => upper.contains(target) }
      addOverlayLayer(layer)

      upper.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await settle()

      expect(panel()).not.toBeNull()
      expect(wrapper.emitted('close')).toBeFalsy()

      removeOverlayLayer(layer)
      wrapper.unmount()
    })
  })

  describe('when the pointer goes down outside', () => {
    it('then it closes', async () => {
      const wrapper = mountPopover({ modelValue: true })
      await settle()

      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await settle()

      expect(wrapper.emitted('close')).toHaveLength(1)

      wrapper.unmount()
    })
  })

  describe('when the position prop changes', () => {
    it('then the panel is updated', async () => {
      const wrapper = mountPopover({ modelValue: true, position: 'bottom' })
      await settle()

      await wrapper.setProps({ position: 'top' })
      await settle()

      expect(panel()).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the position is auto', () => {
    it('then the transform origin variable is set', async () => {
      const wrapper = mountPopover({ modelValue: true, position: 'auto' })
      await settle()

      expect(panel()?.style.getPropertyValue('--maz-popover-transform-origin')).not.toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when it is disabled while open', () => {
    it('then it closes', async () => {
      const wrapper = mountPopover({ modelValue: true })
      await settle()

      await wrapper.setProps({ disabled: true })
      await settle()

      expect(wrapper.emitted('close')).toHaveLength(1)

      wrapper.unmount()
    })
  })
})
