import MazBottomSheet from '@components/MazBottomSheet.vue'
import { mount } from '@vue/test-utils'

function firePointer(element: Element, type: string, clientY: number) {
  element.dispatchEvent(new MouseEvent(type, { clientY, bubbles: true }))
}

describe('given MazBottomSheet component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with the bottom-sheet backdrop variant', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('variant')).toBe('bottom-sheet')
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('transitionName')).toBe('bottom-sheet-anim')
      expect(wrapper.find('.m-bottom-sheet').exists()).toBe(true)
    })
  })

  describe('when the backdrop emits open', () => {
    it('then it forwards the open event', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      await wrapper.findComponent({ name: 'MazBackdrop' }).vm.$emit('open')

      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when the backdrop emits close', () => {
    it('then it forwards the close event', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      await wrapper.findComponent({ name: 'MazBackdrop' }).vm.$emit('close')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when rendered with title prop', () => {
    it('then it displays the title in the header', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, title: 'Sheet Title' },
      })

      expect(wrapper.find('.m-bottom-sheet__title').text()).toBe('Sheet Title')
      expect(wrapper.find('.m-bottom-sheet__header').classes()).toContain('maz:justify-between')
    })
  })

  describe('when rendered with title slot', () => {
    it('then it renders the title slot content', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        slots: { title: '<span>Custom Title</span>' },
      })

      expect(wrapper.find('.m-bottom-sheet__title').html()).toContain('<span>Custom Title</span>')
    })
  })

  describe('when rendered with icon prop', () => {
    it('then it renders the icon in the header', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, icon: '/star.svg' },
      })

      expect(wrapper.find('.m-bottom-sheet__icon').exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MazIcon' }).exists()).toBe(true)
    })
  })

  describe('when rendered with icon slot', () => {
    it('then it renders the icon slot content', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        slots: { icon: '<i class="custom-icon" />' },
      })

      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })
  })

  describe('when rendered without title and icon', () => {
    it('then it aligns the header content to the end', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      expect(wrapper.find('.m-bottom-sheet__header').classes()).toContain('maz:justify-end')
    })
  })

  describe('when rendered with footer slot', () => {
    it('then it renders the footer', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        slots: { footer: '<button>Confirm</button>' },
      })

      expect(wrapper.find('.m-bottom-sheet__footer').exists()).toBe(true)
      expect(wrapper.find('.m-bottom-sheet__footer').html()).toContain('<button>Confirm</button>')
    })
  })

  describe('when rendered without footer slot', () => {
    it('then it does not render the footer', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      expect(wrapper.find('.m-bottom-sheet__footer').exists()).toBe(false)
    })
  })

  describe('when rendered with header slot', () => {
    it('then it replaces the default header', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, title: 'Ignored' },
        slots: { header: '<header class="custom-header">Custom</header>' },
      })

      expect(wrapper.find('.custom-header').exists()).toBe(true)
      expect(wrapper.find('.m-bottom-sheet__header').exists()).toBe(false)
    })
  })

  describe('when rendered with hideHeader prop', () => {
    it('then it does not render the default header', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, title: 'Hidden', hideHeader: true },
      })

      expect(wrapper.find('.m-bottom-sheet__header').exists()).toBe(false)
    })
  })

  describe('when rendered with hideCloseButton prop', () => {
    it('then it does not render the close button', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, hideCloseButton: true },
      })

      expect(wrapper.find('.m-bottom-sheet__close').exists()).toBe(false)
    })
  })

  describe('when rendered with persistent prop', () => {
    it('then it does not render the close button', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, persistent: true },
      })

      expect(wrapper.find('.m-bottom-sheet__close').exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('persistent')).toBe(true)
    })
  })

  describe('when rendered with padding', () => {
    it('then it applies the padding class to the content', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, padding: true },
      })

      expect(wrapper.find('.m-bottom-sheet__content').classes()).toContain('maz:p-4')
    })
  })

  describe('when rendered without padding', () => {
    it('then it removes the padding class from the content', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, padding: false },
      })

      expect(wrapper.find('.m-bottom-sheet__content').classes()).not.toContain('maz:p-4')
    })
  })

  describe('when rendered with custom maxWidth', () => {
    it('then it applies the max-width custom property', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, maxWidth: '50rem' },
      })

      expect(wrapper.find('.m-bottom-sheet-wrapper').attributes('style')).toContain('--max-width: 50rem')
    })
  })

  describe('when the close method is called', () => {
    it('then it closes the underlying backdrop', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      wrapper.vm.close()
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)
    })
  })

  describe('when rendered with swipeToClose enabled by default', () => {
    it('then it renders the drag handle', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })

      expect(wrapper.find('.m-bottom-sheet__handle-zone').exists()).toBe(true)
      expect(wrapper.find('.m-bottom-sheet__handle').exists()).toBe(true)
    })
  })

  describe('when rendered with swipeToClose disabled', () => {
    it('then it does not render the drag handle', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, swipeToClose: false },
      })

      expect(wrapper.find('.m-bottom-sheet__handle-zone').exists()).toBe(false)
    })
  })

  describe('when rendered with handle slot', () => {
    it('then it renders the handle slot content', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        slots: { handle: '<span class="custom-handle" />' },
      })

      expect(wrapper.find('.custom-handle').exists()).toBe(true)
    })
  })

  describe('when the handle is dragged down', () => {
    it('then it translates the sheet following the pointer', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        attachTo: document.body,
      })

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element
      firePointer(handle, 'pointerdown', 0)
      firePointer(handle, 'pointermove', 200)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain('translateY(200px)')

      wrapper.unmount()
    })
  })

  describe('when the handle is released past the threshold', () => {
    it('then it closes the sheet', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        attachTo: document.body,
      })

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element
      firePointer(handle, 'pointerdown', 0)
      firePointer(handle, 'pointermove', 200)
      firePointer(handle, 'pointerup', 200)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the handle is released below the threshold', () => {
    it('then it snaps the sheet back without closing', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        attachTo: document.body,
      })

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element
      firePointer(handle, 'pointerdown', 0)
      firePointer(handle, 'pointermove', 40)
      firePointer(handle, 'pointerup', 40)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when a persistent sheet is dragged past the threshold', () => {
    it('then it snaps back instead of closing', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, persistent: true },
        attachTo: document.body,
      })

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element
      firePointer(handle, 'pointerdown', 0)
      firePointer(handle, 'pointermove', 200)
      firePointer(handle, 'pointerup', 200)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)

      wrapper.unmount()
    })
  })
})
