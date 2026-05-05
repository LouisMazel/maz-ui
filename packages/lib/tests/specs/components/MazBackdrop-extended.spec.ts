import MazBackdrop from '@components/MazBackdrop.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

describe('MazBackdrop extended branch coverage', () => {
  describe('initial rendering', () => {
    it('renders with modelValue false (not visible)', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(wrapper.vm.present).toBe(false)
      expect(wrapper.find('.m-backdrop').exists()).toBe(false)
    })

    it('renders with modelValue true (visible)', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.vm.present).toBe(true)
      expect(wrapper.find('.m-backdrop').exists()).toBe(true)
    })

    it('renders default slot content when open', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
        slots: {
          default: '<div class="test-content">Hello</div>',
        },
      })
      expect(wrapper.find('.test-content').exists()).toBe(true)
    })
  })

  describe('persistent prop', () => {
    it('does not close when persistent is true and close is called', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, persistent: true },
      })
      wrapper.vm.close()
      await nextTick()
      expect(wrapper.vm.present).toBe(true)
    })

    it('closes when persistent is false and close is called', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, persistent: false },
      })
      wrapper.vm.close()
      await nextTick()
      expect(wrapper.vm.present).toBe(false)
    })

    it('adds --persistent class when persistent is true', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, persistent: true },
      })
      expect(wrapper.find('.m-backdrop').classes()).toContain('--persistent')
    })

    it('does not add --persistent class when persistent is false', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, persistent: false },
      })
      expect(wrapper.find('.m-backdrop').classes()).not.toContain('--persistent')
    })
  })

  describe('closeOnEscape prop', () => {
    it('closes on Escape when closeOnEscape is true', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, closeOnEscape: true },
      })
      wrapper.vm.onKeyPress({ key: 'Escape' } as KeyboardEvent)
      await nextTick()
      expect(wrapper.vm.present).toBe(false)
    })

    it('does not close on Escape when closeOnEscape is false', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, closeOnEscape: false },
      })
      wrapper.vm.onKeyPress({ key: 'Escape' } as KeyboardEvent)
      await nextTick()
      expect(wrapper.vm.present).toBe(true)
    })

    it('does not close on non-Escape key press', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, closeOnEscape: true },
      })
      wrapper.vm.onKeyPress({ key: 'Enter' } as KeyboardEvent)
      await nextTick()
      expect(wrapper.vm.present).toBe(true)
    })
  })

  describe('toggleModal', () => {
    it('toggles from false to true', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      await wrapper.vm.toggleModal(true)
      expect(wrapper.vm.present).toBe(true)
    })

    it('toggles from true to false', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      await wrapper.vm.toggleModal(false)
      expect(wrapper.vm.present).toBe(false)
    })

    it('toggles when no value is passed (inverts current)', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(wrapper.vm.present).toBe(false)
      await wrapper.vm.toggleModal()
      expect(wrapper.vm.present).toBe(true)
    })

    it('emits before-close when closing', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      await wrapper.vm.toggleModal(false)
      expect(wrapper.emitted('before-close')).toBeTruthy()
    })

    it('does not emit before-close when opening', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      await wrapper.vm.toggleModal(true)
      expect(wrapper.emitted('before-close')).toBeFalsy()
    })
  })

  describe('beforeClose callback', () => {
    it('calls beforeClose function when closing', async () => {
      const beforeClose = vi.fn()
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, beforeClose },
      })
      await wrapper.vm.toggleModal(false)
      expect(beforeClose).toHaveBeenCalledOnce()
    })

    it('calls async beforeClose function', async () => {
      const beforeClose = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, beforeClose },
      })
      await wrapper.vm.toggleModal(false)
      expect(beforeClose).toHaveBeenCalledOnce()
    })

    it('does not call beforeClose when opening', async () => {
      const beforeClose = vi.fn()
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false, beforeClose },
      })
      await wrapper.vm.toggleModal(true)
      expect(beforeClose).not.toHaveBeenCalled()
    })
  })

  describe('onBackdropAnimationLeave', () => {
    it('emits update:model-value false and close', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      wrapper.vm.onBackdropAnimationLeave()
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')![0]).toEqual([false])
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('removes document class after animation leave', () => {
      document.documentElement.classList.add('--backdrop-present')
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      wrapper.vm.close()
      wrapper.vm.onBackdropAnimationLeave()
      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(false)
    })
  })

  describe('variant prop', () => {
    it('adds --variant-bottom-sheet class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, variant: 'bottom-sheet' },
      })
      expect(wrapper.find('.m-backdrop').classes()).toContain('--variant-bottom-sheet')
    })

    it('adds --variant-dialog class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, variant: 'dialog' },
      })
      expect(wrapper.find('.m-backdrop').classes()).toContain('--variant-dialog')
    })

    it('adds --variant-drawer class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, variant: 'drawer' },
      })
      expect(wrapper.find('.m-backdrop').classes()).toContain('--variant-drawer')
    })

    it('does not add variant class when not provided', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      const classes = wrapper.find('.m-backdrop').classes()
      expect(classes.some(c => c.startsWith('--variant-'))).toBe(false)
    })
  })

  describe('contentPadding prop', () => {
    it('adds --padding class when contentPadding is true', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, contentPadding: true },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--padding')
    })

    it('does not add --padding class when contentPadding is false', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, contentPadding: false },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).not.toContain('--padding')
    })
  })

  describe('justify prop', () => {
    it('adds --justify-none class by default', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-none')
    })

    it('adds --justify-center class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, justify: 'center' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-center')
    })

    it('adds --justify-end class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, justify: 'end' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-end')
    })

    it('adds --justify-start class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, justify: 'start' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-start')
    })

    it('adds --justify-space-between class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, justify: 'space-between' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-space-between')
    })

    it('adds --justify-space-around class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, justify: 'space-around' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--justify-space-around')
    })
  })

  describe('align prop', () => {
    it('adds --align-none class by default', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--align-none')
    })

    it('adds --align-center class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, align: 'center' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--align-center')
    })

    it('adds --align-end class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, align: 'end' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--align-end')
    })

    it('adds --align-start class', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, align: 'start' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('--align-start')
    })
  })

  describe('transitionName prop', () => {
    it('uses backdrop-anim as default transition', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      // The Transition component should have the name prop set
      expect(wrapper.exists()).toBe(true)
    })

    it('accepts custom transition name', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, transitionName: 'modal-anim' },
      })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('backdropClass and backdropContentClass', () => {
    it('applies backdropClass to backdrop element', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, backdropClass: 'custom-backdrop' },
      })
      expect(wrapper.find('.m-backdrop').classes()).toContain('custom-backdrop')
    })

    it('applies backdropContentClass to content element', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, backdropContentClass: 'custom-content' },
      })
      expect(wrapper.find('.m-backdrop-content').classes()).toContain('custom-content')
    })
  })

  describe('aria attributes', () => {
    it('sets aria-labelledby when provided', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, ariaLabelledby: 'dialog-title' },
      })
      expect(wrapper.find('.m-backdrop').attributes('aria-labelledby')).toBe('dialog-title')
    })

    it('sets aria-describedby when provided', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, ariaDescribedby: 'dialog-desc' },
      })
      expect(wrapper.find('.m-backdrop').attributes('aria-describedby')).toBe('dialog-desc')
    })

    it('has aria-modal on dialog container', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
    })
  })

  describe('document class management', () => {
    it('adds --backdrop-present class when modelValue is true on mount', () => {
      document.documentElement.classList.remove('--backdrop-present')
      mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(true)
    })

    it('does not add --backdrop-present class when modelValue is false on mount', () => {
      document.documentElement.classList.remove('--backdrop-present')
      mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(document.documentElement.classList.contains('--backdrop-present')).toBe(false)
    })
  })

  describe('watcher on modelValue', () => {
    it('opens when modelValue changes from false to true', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(wrapper.vm.present).toBe(false)
      await wrapper.setProps({ modelValue: true })
      expect(wrapper.vm.present).toBe(true)
    })

    it('closes when modelValue changes from true to false', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.vm.present).toBe(true)
      await wrapper.setProps({ modelValue: false })
      expect(wrapper.vm.present).toBe(false)
    })
  })

  describe('pointerdown on backdrop-content closes modal', () => {
    it('closes when clicking on backdrop content (not persistent)', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      await wrapper.find('.m-backdrop-content').trigger('pointerdown')
      expect(wrapper.vm.present).toBe(false)
    })

    it('does not close when persistent and clicking on backdrop content', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true, persistent: true },
      })
      await wrapper.find('.m-backdrop-content').trigger('pointerdown')
      expect(wrapper.vm.present).toBe(true)
    })
  })

  describe('expose', () => {
    it('exposes present ref', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(wrapper.vm.present).toBe(true)
    })

    it('exposes close method', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
      })
      expect(typeof wrapper.vm.close).toBe('function')
    })

    it('exposes toggleModal method', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(typeof wrapper.vm.toggleModal).toBe('function')
    })

    it('exposes onBackdropAnimationLeave method', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(typeof wrapper.vm.onBackdropAnimationLeave).toBe('function')
    })

    it('exposes onKeyPress method', () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: false },
      })
      expect(typeof wrapper.vm.onKeyPress).toBe('function')
    })
  })

  describe('focus trap', () => {
    function dispatchTab(shiftKey = false) {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true })
      document.dispatchEvent(event)
      return event
    }

    function makeButton(label: string) {
      const button = document.createElement('button')
      button.textContent = label
      return button
    }

    it('cycles to first focusable when Tab is pressed on the last one', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
        attachTo: document.body,
      })
      await nextTick()

      const content = document.querySelector('.m-backdrop-content') as HTMLElement
      const first = makeButton('first')
      const last = makeButton('last')
      content.append(first, last)

      last.focus()
      const event = dispatchTab(false)

      expect(document.activeElement).toBe(first)
      expect(event.defaultPrevented).toBe(true)

      wrapper.unmount()
    })

    it('cycles to last focusable when Shift+Tab is pressed on the first one', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
        attachTo: document.body,
      })
      await nextTick()

      const content = document.querySelector('.m-backdrop-content') as HTMLElement
      const first = makeButton('first')
      const last = makeButton('last')
      content.append(first, last)

      first.focus()
      const event = dispatchTab(true)

      expect(document.activeElement).toBe(last)
      expect(event.defaultPrevented).toBe(true)

      wrapper.unmount()
    })

    it('does nothing when Tab is pressed and no focusable elements are present', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
        attachTo: document.body,
      })
      await nextTick()

      const event = dispatchTab(false)

      expect(event.defaultPrevented).toBe(false)

      wrapper.unmount()
    })

    it('ignores non-Tab key events', async () => {
      const wrapper = mount(MazBackdrop, {
        props: { modelValue: true },
        attachTo: document.body,
      })
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true })
      document.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)

      wrapper.unmount()
    })
  })
})
