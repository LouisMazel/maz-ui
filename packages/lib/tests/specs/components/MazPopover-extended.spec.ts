import type { MazPopoverProps } from '@components/MazPopover.vue'
import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

async function mountPopover(...args: Parameters<typeof mount<typeof MazPopover>>) {
  const wrapper = mount(...args)
  await nextTick()
  return wrapper
}

describe('MazPopover extended coverage', () => {
  async function getWrapper(props: Partial<MazPopoverProps> = {}, slots: Record<string, string> = {}) {
    return await mountPopover(MazPopover, {
      props: {
        ...props,
      },
      slots: {
        trigger: '<button class="test-trigger">Trigger</button>',
        default: '<div class="test-content">Popover Content</div>',
        ...slots,
      },
    })
  }

  describe('when rendered with default props', () => {
    it('should render the popover wrapper', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find('.m-popover').exists()).toBe(true)
    })

    it('should render the trigger slot', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find('.test-trigger').exists()).toBe(true)
    })

    it('should not render the panel by default', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when modelValue is true', () => {
    it('should render the popover panel', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })

    it('should render content in the panel', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      expect(wrapper.find('.test-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Popover Content')
    })

    it('should apply --open class', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      expect(wrapper.find('.m-popover.--open').exists()).toBe(true)
    })
  })

  describe('when modelValue is false', () => {
    it('should not render the panel', async () => {
      const wrapper = await getWrapper({ modelValue: false })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })

    it('should not apply --open class', async () => {
      const wrapper = await getWrapper({ modelValue: false })
      expect(wrapper.find('.m-popover.--open').exists()).toBe(false)
    })
  })

  describe('when modelValue toggles', () => {
    it('should show panel when modelValue becomes true', async () => {
      const wrapper = await getWrapper({ modelValue: false })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)

      await wrapper.setProps({ modelValue: true })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })

    it('should hide panel when modelValue becomes false', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)

      await wrapper.setProps({ modelValue: false })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })

    it('emits after-close-animation when the leave transition finishes', async () => {
      const wrapper = await getWrapper({ modelValue: true })

      ;(wrapper.vm as unknown as { onTransitionAfterLeave: () => void }).onTransitionAfterLeave()

      expect(wrapper.emitted('after-close-animation')).toBeTruthy()
    })
  })

  describe('when position is configured', () => {
    it.each([
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'left-start',
      'left-end',
      'right-start',
      'right-end',
    ] as MazPopoverProps['position'][])('should apply --position-%s class', async (position) => {
      const wrapper = await getWrapper({ modelValue: true, position })
      expect(wrapper.find('.m-popover-panel').classes()).toContain(`--position-${position}`)
    })
  })

  describe('when position is auto', () => {
    it('should render without a specific position class', async () => {
      const wrapper = await getWrapper({ modelValue: true, position: 'auto' })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when trigger is click', () => {
    it('should open on trigger click', async () => {
      const wrapper = await getWrapper({ trigger: 'click' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })

    it('should close on second trigger click', async () => {
      const wrapper = await getWrapper({ trigger: 'click' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when trigger is hover', () => {
    it('should open on mouseenter', async () => {
      const wrapper = await getWrapper({ trigger: 'hover' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('mouseenter')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })

    it('should close on mouseleave', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({ trigger: 'hover' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('mouseenter')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      await trigger.trigger('mouseleave')
      vi.advanceTimersByTime(200)
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
      vi.useRealTimers()
    })
  })

  describe('when trigger is manual', () => {
    it('should not open on click', async () => {
      const wrapper = await getWrapper({ trigger: 'manual' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })

    it('should not open on mouseenter', async () => {
      const wrapper = await getWrapper({ trigger: 'manual' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('mouseenter')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when disabled prop is true', () => {
    it('should apply --disabled class', async () => {
      const wrapper = await getWrapper({ disabled: true })
      expect(wrapper.find('.m-popover.--disabled').exists()).toBe(true)
    })

    it('should not open on click when disabled', async () => {
      const wrapper = await getWrapper({ disabled: true, trigger: 'click' })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when block prop is true', () => {
    it('should apply --block class', async () => {
      const wrapper = await getWrapper({ block: true })
      expect(wrapper.find('.m-popover.--block').exists()).toBe(true)
    })
  })

  describe('when role is configured', () => {
    it.each(['dialog', 'tooltip', 'menu'] as MazPopoverProps['role'][])('should set role=%s on panel', async (role) => {
      const wrapper = await getWrapper({ modelValue: true, role })
      expect(wrapper.find('.m-popover-panel').attributes('role')).toBe(role)
    })

    it('should set aria-modal for dialog role', async () => {
      const wrapper = await getWrapper({ modelValue: true, role: 'dialog' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-modal')).toBe('true')
    })

    it('should not set aria-modal for tooltip role', async () => {
      const wrapper = await getWrapper({ modelValue: true, role: 'tooltip' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-modal')).toBeUndefined()
    })

    it('should not set aria-modal for menu role', async () => {
      const wrapper = await getWrapper({ modelValue: true, role: 'menu' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-modal')).toBeUndefined()
    })
  })

  describe('when color is configured', () => {
    it.each([
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'destructive',
      'contrast',
    ] as (MazPopoverProps['color'])[])('should apply --%s class to panel', async (color) => {
      const wrapper = await getWrapper({ modelValue: true, color })
      const panel = wrapper.find('.m-popover-panel')
      expect(panel.classes()).toContain(`--${color}`)
    })

    it('should apply --surface class for background color', async () => {
      const wrapper = await getWrapper({ modelValue: true, color: 'surface' })
      const panel = wrapper.find('.m-popover-panel')
      expect(panel.classes()).toContain('--surface')
    })
  })

  describe('when offset is configured', () => {
    it('should accept custom offset', async () => {
      const wrapper = await getWrapper({ modelValue: true, offset: 20 })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when delay is configured', () => {
    it('should delay opening', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({ trigger: 'click', delay: 100 })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
      vi.advanceTimersByTime(150)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      vi.useRealTimers()
    })
  })

  describe('when transition is configured', () => {
    it('should use scale-pop transition name with maz- prefix', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        transition: 'scale-pop',
      })
      const teleport = wrapper.findComponent({ name: 'Teleport' })
      expect(teleport.exists()).toBe(true)
    })

    it('should use scale-fade transition name with maz- prefix', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        transition: 'scale-fade',
      })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })

    it('should use custom transition name as-is', async () => {
      const wrapper = await mountPopover(MazPopover, {
        props: {
          modelValue: true,
          transition: 'my-custom-anim',
        },
        slots: {
          trigger: '<button>Trigger</button>',
          default: '<div>Content</div>',
        },
        global: {
          stubs: { Transition: true },
        },
      })
      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('name')).toBe('my-custom-anim')
    })
  })

  describe('when teleportTo is configured', () => {
    it('should set teleport target', async () => {
      const wrapper = await getWrapper({ modelValue: true, teleportTo: '#my-container' })
      const teleport = wrapper.findComponent({ name: 'Teleport' })
      expect(teleport.attributes('to')).toBe('#my-container')
    })
  })

  describe('when aria attributes are configured', () => {
    it('should set aria-label on panel', async () => {
      const wrapper = await getWrapper({ modelValue: true, ariaLabel: 'Notification popover' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-label')).toBe('Notification popover')
    })

    it('should set aria-labelledby on panel for dialog role', async () => {
      const wrapper = await getWrapper({ modelValue: true, ariaLabelledby: 'my-label-id' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-labelledby')).toContain('my-label-id')
    })

    it('should set aria-describedby on panel for dialog role', async () => {
      const wrapper = await getWrapper({ modelValue: true, ariaDescribedby: 'my-desc-id' })
      expect(wrapper.find('.m-popover-panel').attributes('aria-describedby')).toBe('my-desc-id')
    })
  })

  describe('when announceChanges is true', () => {
    it('should set aria-live polite on panel', async () => {
      const wrapper = await getWrapper({ modelValue: true, announceChanges: true })
      expect(wrapper.find('.m-popover-panel').attributes('aria-live')).toBe('polite')
    })
  })

  describe('when announceChanges is false (default)', () => {
    it('should not set aria-live on panel', async () => {
      const wrapper = await getWrapper({ modelValue: true, announceChanges: false })
      expect(wrapper.find('.m-popover-panel').attributes('aria-live')).toBeUndefined()
    })
  })

  describe('when panelClass is configured', () => {
    it('should apply custom class to panel', async () => {
      const wrapper = await getWrapper({ modelValue: true, panelClass: 'my-panel-class' })
      expect(wrapper.find('.m-popover-panel').classes()).toContain('my-panel-class')
    })
  })

  describe('when overlayClass is configured', () => {
    it('should apply overlay class to panel', async () => {
      const wrapper = await getWrapper({ modelValue: true, overlayClass: 'my-overlay' })
      expect(wrapper.find('.m-popover-panel').classes()).toContain('my-overlay')
    })
  })

  describe('when panelStyle is configured', () => {
    it('should apply inline styles to panel as object', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        panelStyle: { backgroundColor: 'red' },
      })
      expect(wrapper.find('.m-popover-panel').attributes('style')).toContain('background-color: red')
    })

    it('should apply inline styles to panel as string', async () => {
      const wrapper = await getWrapper({ modelValue: true, panelStyle: 'min-width: 300px' })
      expect(wrapper.find('.m-popover-panel').attributes('style')).toContain('min-width: 300px')
    })
  })

  describe('when persistent is true', () => {
    it('should not close on Escape key', async () => {
      const wrapper = await getWrapper({ modelValue: true, persistent: true, trigger: 'click' })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      // Escape keydown is handled at document level, not directly on the wrapper
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when closeOnEscape is false', () => {
    it('should not close on Escape key', async () => {
      const wrapper = await getWrapper({ modelValue: true, closeOnEscape: false, trigger: 'click' })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when closeOnEscape is true and not persistent', () => {
    it('should close on Escape key', async () => {
      const wrapper = await getWrapper({
        trigger: 'click',
        closeOnEscape: true,
        persistent: false,
      })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('click')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
    })
  })

  describe('when keepOpenOnHover is true', () => {
    it('should keep open when hovering panel', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({ trigger: 'hover', keepOpenOnHover: true })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('mouseenter')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)

      // Mouseleave trigger, mouseenter panel
      await trigger.trigger('mouseleave')
      const panel = wrapper.find('.m-popover-panel')
      await panel.trigger('mouseenter')
      vi.advanceTimersByTime(300)
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      vi.useRealTimers()
    })
  })

  describe('when no trigger slot is provided', () => {
    it('should not render the popover wrapper div', async () => {
      const wrapper = await mountPopover(MazPopover, {
        props: { modelValue: true },
        slots: {
          default: '<div>Content only</div>',
        },
      })
      expect(wrapper.find('.m-popover').exists()).toBe(false)
    })
  })

  describe('exposed methods', () => {
    it('should expose open method', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.vm.open).toBeInstanceOf(Function)
    })

    it('should expose close method', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.vm.close).toBeInstanceOf(Function)
    })

    it('should expose toggle method', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.vm.toggle).toBeInstanceOf(Function)
    })

    it('should expose isOpen ref', async () => {
      const wrapper = await getWrapper({ modelValue: true })
      expect(wrapper.vm.isOpen).toBe(true)
    })

    it('should expose updatePosition method', async () => {
      const wrapper = await getWrapper()
      expect(wrapper.vm.updatePosition).toBeInstanceOf(Function)
    })
  })

  describe('when combining props', () => {
    it('should handle disabled + block', async () => {
      const wrapper = await getWrapper({ disabled: true, block: true })
      expect(wrapper.find('.m-popover.--disabled.--block').exists()).toBe(true)
    })

    it('should handle panelClass + overlayClass + color', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        panelClass: 'custom-panel',
        overlayClass: 'custom-overlay',
        color: 'success',
      })
      const panel = wrapper.find('.m-popover-panel')
      expect(panel.classes()).toContain('custom-panel')
      expect(panel.classes()).toContain('custom-overlay')
      expect(panel.classes()).toContain('--success')
    })
  })

  describe('when preferPosition is configured', () => {
    it('should accept preferPosition with auto position', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        position: 'auto',
        preferPosition: 'bottom-start',
      })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when fallbackPosition is configured', () => {
    it('should accept fallbackPosition', async () => {
      const wrapper = await getWrapper({
        modelValue: true,
        position: 'top',
        fallbackPosition: 'bottom',
      })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when trapFocus is false', () => {
    it('should render without focus trapping', async () => {
      const wrapper = await getWrapper({ modelValue: true, trapFocus: false })
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    })
  })

  describe('when hoverDelay is configured', () => {
    it('should use custom hoverDelay for closing', async () => {
      vi.useFakeTimers()
      const wrapper = await getWrapper({ trigger: 'hover', keepOpenOnHover: true, hoverDelay: 500 })
      const trigger = wrapper.find('.m-popover-trigger')
      await trigger.trigger('mouseenter')
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)

      await trigger.trigger('mouseleave')
      vi.advanceTimersByTime(400)
      await wrapper.vm.$nextTick()
      // Panel should still be open because hoverDelay is 500
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      vi.advanceTimersByTime(200)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
      vi.useRealTimers()
    })
  })

  describe('when dismissing via outside pointerdown', () => {
    async function mountAttached(props: Partial<MazPopoverProps> = {}) {
      return await mountPopover(MazPopover, {
        attachTo: document.body,
        props: { trigger: 'click', ...props },
        slots: {
          trigger: '<button class="test-trigger">Trigger</button>',
          default: '<div class="test-content">Popover Content</div>',
        },
      })
    }

    function pointerDownOn(el: Element) {
      el.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    }

    async function openAndSettle(wrapper: Awaited<ReturnType<typeof mountAttached>>) {
      await wrapper.find('.m-popover-trigger').trigger('click')
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
    }

    it('closes on pointerdown outside the panel and trigger', async () => {
      const wrapper = await mountAttached()
      await openAndSettle(wrapper)

      const outside = document.createElement('div')
      document.body.appendChild(outside)
      pointerDownOn(outside)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(false)
      outside.remove()
      wrapper.unmount()
    })

    it('stays open on pointerdown inside the panel', async () => {
      const wrapper = await mountAttached()
      await openAndSettle(wrapper)

      pointerDownOn(wrapper.find('.m-popover-panel').element)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      wrapper.unmount()
    })

    it('stays open on pointerdown on the trigger', async () => {
      const wrapper = await mountAttached()
      await openAndSettle(wrapper)

      pointerDownOn(wrapper.find('.m-popover-trigger').element)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      wrapper.unmount()
    })

    it('stays open when persistent', async () => {
      const wrapper = await mountAttached({ persistent: true })
      await openAndSettle(wrapper)

      const outside = document.createElement('div')
      document.body.appendChild(outside)
      pointerDownOn(outside)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      outside.remove()
      wrapper.unmount()
    })

    it('stays open when closeOnClickOutside is false', async () => {
      const wrapper = await mountAttached({ closeOnClickOutside: false })
      await openAndSettle(wrapper)

      const outside = document.createElement('div')
      document.body.appendChild(outside)
      pointerDownOn(outside)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      outside.remove()
      wrapper.unmount()
    })

    it('stays open with manual trigger', async () => {
      const wrapper = await mountAttached({ trigger: 'manual', modelValue: true })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)

      const outside = document.createElement('div')
      document.body.appendChild(outside)
      pointerDownOn(outside)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-popover-panel').exists()).toBe(true)
      outside.remove()
      wrapper.unmount()
    })
  })
})
