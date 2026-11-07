import type { MazPopoverProps } from '@components/MazPopover.vue'
import MazPopover from '@components/MazPopover.vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

async function settle() {
  await nextTick()
  await nextTick()
}

function mountPopover(props: Partial<MazPopoverProps> = {}, content = '<p>Content</p>', trigger = '<button class="trigger">Open</button>') {
  return mount(MazPopover, {
    attachTo: document.body,
    props,
    slots: { trigger, default: content },
    global: {
      stubs: { teleport: false },
    },
  })
}

function mountNestedPopovers() {
  const isOuterOpen = ref(true)
  const isInnerOpen = ref(true)

  const wrapper = mount(defineComponent({
    setup: () => () => h(MazPopover, {
      'modelValue': isOuterOpen.value,
      'onUpdate:modelValue': (value: boolean) => (isOuterOpen.value = value),
    }, {
      trigger: () => h('button', 'Outer'),
      default: () => h(MazPopover, {
        'modelValue': isInnerOpen.value,
        'onUpdate:modelValue': (value: boolean) => (isInnerOpen.value = value),
      }, {
        trigger: () => h('button', 'Inner'),
        default: () => h('button', { class: 'inner-content' }, 'Option'),
      }),
    }),
  }), {
    attachTo: document.body,
    global: {
      stubs: { teleport: false },
    },
  })

  return { wrapper, isOuterOpen, isInnerOpen }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a closed MazPopover', () => {
  describe('when the trigger is clicked twice', () => {
    it('emits open and close once each', async () => {
      const wrapper = mountPopover()
      await settle()

      await wrapper.find('.trigger').trigger('click')
      await settle()
      await wrapper.find('.trigger').trigger('click')
      await settle()

      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(wrapper.emitted('close')).toHaveLength(1)
      expect(wrapper.emitted('toggle')).toEqual([
        [true],
        [false],
      ])
      wrapper.unmount()
    })
  })

  describe('when it is mounted', () => {
    it('listens to no key of the document', async () => {
      const addEventListener = vi.spyOn(document, 'addEventListener')
      const wrapper = mountPopover()
      await settle()

      expect(addEventListener.mock.calls.filter(([type]) => type === 'keydown')).toEqual([])
      addEventListener.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when it is opened then closed', () => {
    it('removes its listeners of the document', async () => {
      const removeEventListener = vi.spyOn(document, 'removeEventListener')
      const wrapper = mountPopover()
      await settle()

      await wrapper.find('.trigger').trigger('click')
      await settle()
      await wrapper.find('.trigger').trigger('click')
      await settle()

      expect(removeEventListener.mock.calls.map(([type]) => type)).toEqual(expect.arrayContaining(['keydown', 'pointerdown']))
      removeEventListener.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when it is opened and closed before the next tick', () => {
    it('adds no listener to the document', async () => {
      const wrapper = mountPopover()
      await settle()
      const addEventListener = vi.spyOn(document, 'addEventListener')

      wrapper.vm.open()
      wrapper.vm.close()
      await settle()

      expect(addEventListener.mock.calls.filter(([type]) => type === 'keydown' || type === 'pointerdown')).toEqual([])
      addEventListener.mockRestore()
      wrapper.unmount()
    })
  })
})

describe('given a popover opened from the panel of another one', () => {
  describe('when the panel of the inner popover is clicked', () => {
    it('keeps both popovers open', async () => {
      const { wrapper, isOuterOpen, isInnerOpen } = mountNestedPopovers()
      await settle()

      document.querySelector('.inner-content')?.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await settle()

      expect(isOuterOpen.value).toBe(true)
      expect(isInnerOpen.value).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when the page outside both popovers is clicked', () => {
    it('closes both popovers', async () => {
      const { wrapper, isOuterOpen, isInnerOpen } = mountNestedPopovers()
      await settle()
      const outside = document.createElement('div')
      document.body.append(outside)

      outside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      await settle()

      expect(isOuterOpen.value).toBe(false)
      expect(isInnerOpen.value).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when Escape is pressed', () => {
    it('closes only the inner popover', async () => {
      const { wrapper, isOuterOpen, isInnerOpen } = mountNestedPopovers()
      await settle()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()

      expect(isInnerOpen.value).toBe(false)
      expect(isOuterOpen.value).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when Escape is pressed twice', () => {
    it('closes the inner popover then the outer one', async () => {
      const { wrapper, isOuterOpen } = mountNestedPopovers()
      await settle()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await settle()

      expect(isOuterOpen.value).toBe(false)
      wrapper.unmount()
    })
  })
})

describe('given a panel whose first button is disabled', () => {
  describe('when the popover opens', () => {
    it('focuses the first enabled field, whatever its type', async () => {
      const wrapper = mountPopover({ modelValue: true }, '<button disabled>Disabled</button><input type="search" class="search">')
      await settle()

      expect(document.activeElement?.classList.contains('search')).toBe(true)
      wrapper.unmount()
    })
  })
})

describe('given a panel with an email field after a disabled button', () => {
  describe('when Tab is pressed on the last field', () => {
    it('moves the focus to the first enabled field', async () => {
      const wrapper = mountPopover({ modelValue: true }, '<button disabled>Disabled</button><input type="email" class="email"><button class="last">Last</button>')
      await settle()
      document.querySelector<HTMLElement>('.last')?.focus()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }))

      expect(document.activeElement?.classList.contains('email')).toBe(true)
      wrapper.unmount()
    })
  })
})

describe('given a hover tooltip', () => {
  describe('when its trigger gets the keyboard focus', () => {
    it('shows the tooltip', async () => {
      const wrapper = mountPopover({ trigger: 'hover', role: 'tooltip' })
      await settle()

      await wrapper.find('.trigger').trigger('focusin')
      await settle()

      expect(document.querySelector('.m-popover-panel')).not.toBeNull()
      wrapper.unmount()
    })
  })

  describe('when its trigger loses the focus', () => {
    it('hides the tooltip', async () => {
      const wrapper = mountPopover({ trigger: 'hover', role: 'tooltip' })
      await settle()

      await wrapper.find('.trigger').trigger('focusin')
      await settle()
      await wrapper.find('.trigger').trigger('focusout')
      await settle()

      expect(wrapper.emitted('update:modelValue')).toEqual([
        [true],
        [false],
      ])
      expect(wrapper.emitted('close')).toHaveLength(1)
      wrapper.unmount()
    })
  })
})

describe('given a hover popover with the dialog role', () => {
  describe('when its trigger gets the keyboard focus', () => {
    it('stays closed', async () => {
      const wrapper = mountPopover({ trigger: 'hover' })
      await settle()

      await wrapper.find('.trigger').trigger('focusin')
      await settle()

      expect(document.querySelector('.m-popover-panel')).toBeNull()
      wrapper.unmount()
    })
  })
})

describe('given a disabled popover with an open model', () => {
  describe('when it is mounted', () => {
    it('renders no panel', async () => {
      const wrapper = mountPopover({ modelValue: true, disabled: true })
      await settle()

      expect(document.querySelector('.m-popover-panel')).toBeNull()
      wrapper.unmount()
    })
  })
})

describe('given an open popover', () => {
  describe('when it becomes disabled', () => {
    it('closes', async () => {
      const wrapper = mountPopover({ modelValue: true })
      await settle()

      await wrapper.setProps({ disabled: true })
      await settle()

      expect(wrapper.emitted('update:modelValue')).toEqual([
        [false],
      ])
      expect(wrapper.emitted('close')).toHaveLength(1)
      wrapper.unmount()
    })
  })
})

describe('given a dialog popover without focus trap', () => {
  describe('when it opens', () => {
    it('is not announced as modal', async () => {
      const wrapper = mountPopover({ modelValue: true, trapFocus: false })
      await settle()

      expect(document.querySelector('.m-popover-panel')?.hasAttribute('aria-modal')).toBe(false)
      wrapper.unmount()
    })
  })
})

describe('given an adaptive popover on a touch device', () => {
  describe('when it is mounted', () => {
    it('switches its wrapper trigger to a click trigger', async () => {
      Object.defineProperty(globalThis, 'ontouchstart', { value: null, configurable: true })
      const wrapper = mountPopover({ trigger: 'adaptive' }, '<p>Content</p>', '<span>Info</span>')
      await settle()

      expect(wrapper.find('.m-popover-trigger').attributes('role')).toBe('button')
      Reflect.deleteProperty(globalThis, 'ontouchstart')
      wrapper.unmount()
    })
  })
})
