import MazLazyImg from '@components/MazLazyImg.vue'
import { mount } from '@vue/test-utils'

describe('given MazLazyImg placeholder', () => {
  describe('when the placeholder is blur', () => {
    it('then the blur effect replaces the spinner', async () => {
      const wrapper = mount(MazLazyImg, { props: { src: '/image.jpg', placeholder: 'blur' } })
      await vi.dynamicImportSettled()

      expect(wrapper.classes()).toContain('--blur')
      expect(wrapper.classes()).not.toContain('--use-loader')
      expect(wrapper.find('.m-lazy-img-component-loader').exists()).toBe(false)
    })
  })

  describe('when there is no placeholder', () => {
    it('then the spinner is kept', async () => {
      const wrapper = mount(MazLazyImg, { props: { src: '/image.jpg' } })
      await vi.dynamicImportSettled()

      expect(wrapper.classes()).toContain('--use-loader')
      expect(wrapper.classes()).not.toContain('--blur')
      expect(wrapper.find('.m-lazy-img-component-loader').exists()).toBe(true)
    })
  })
})
