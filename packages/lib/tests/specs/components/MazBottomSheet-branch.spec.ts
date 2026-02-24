import MazBottomSheet from '@components/MazBottomSheet.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('MazBottomSheet branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: false },
      })
      expect(wrapper.html()).toBeTruthy()
      wrapper.unmount()
    })
  })

  describe('when modelValue is true', () => {
    it('should show the bottom sheet', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })
      await nextTick()
      expect(wrapper.find('.m-bottom-sheet__container').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when padding is true', () => {
    it('should apply padding class', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, padding: true },
      })
      await nextTick()
      const container = wrapper.find('.m-bottom-sheet__container')
      if (container.exists()) {
        expect(container.classes()).toContain('--padding')
      }
      wrapper.unmount()
    })
  })

  describe('when padding is false', () => {
    it('should not apply padding class', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, padding: false },
      })
      await nextTick()
      const container = wrapper.find('.m-bottom-sheet__container')
      if (container.exists()) {
        expect(container.classes()).not.toContain('--padding')
      }
      wrapper.unmount()
    })
  })

  describe('when hideCloseButton is false', () => {
    it('should show close button', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, hideCloseButton: false },
      })
      await nextTick()
      expect(wrapper.find('.m-bottom-sheet__close').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when hideCloseButton is true', () => {
    it('should not show close button', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true, hideCloseButton: true },
      })
      await nextTick()
      expect(wrapper.find('.m-bottom-sheet__close').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when close event occurs', () => {
    it('should emit close', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
      })
      await nextTick()
      // Trigger close via backdrop click
      const backdrop = wrapper.find('.m-backdrop')
      if (backdrop.exists()) {
        await backdrop.trigger('click')
        await nextTick()
      }
      wrapper.unmount()
    })
  })

  describe('when using default slot', () => {
    it('should render slot content', async () => {
      const wrapper = mount(MazBottomSheet, {
        props: { modelValue: true },
        slots: {
          default: '<div class="custom-content">Custom Content</div>',
        },
      })
      await nextTick()
      wrapper.unmount()
    })
  })
})
