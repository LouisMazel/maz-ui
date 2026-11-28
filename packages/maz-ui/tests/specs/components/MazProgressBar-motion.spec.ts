import MazProgressBar from '@components/MazProgressBar.vue'
import { mount } from '@vue/test-utils'

async function settle() {
  await vi.dynamicImportSettled()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('given MazProgressBar motion', () => {
  describe('when indeterminate', () => {
    it('then a segment slides and there is no current value', () => {
      const wrapper = mount(MazProgressBar, { props: { indeterminate: true, label: 'Loading' } })

      expect(wrapper.attributes('role')).toBe('progressbar')
      expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
      expect(wrapper.find('.m-progress-bar__indeterminate').exists()).toBe(true)
      expect(wrapper.find('.m-progress-bar__part').exists()).toBe(false)
    })

    it('then animated false stops the segment', () => {
      const wrapper = mount(MazProgressBar, { props: { indeterminate: true, animated: false } })

      expect(wrapper.classes()).toContain('--static')
    })
  })

  describe('when showValue is set', () => {
    it('then the percentage rolls after the bar, hidden from the screen reader', () => {
      const wrapper = mount(MazProgressBar, { props: { value: 40, showValue: true } })

      expect(wrapper.classes()).toContain('m-progress-bar-field')
      expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('40')
      expect(wrapper.find('.m-progress-bar__aside').attributes('aria-hidden')).toBe('true')
      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('40%')
    })

    it('then the percentage follows the segments and the max', () => {
      const wrapper = mount(MazProgressBar, { props: { value: 3, max: 4, showValue: true } })

      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('75%')
    })

    it('then the value is not displayed while indeterminate', () => {
      const wrapper = mount(MazProgressBar, { props: { indeterminate: true, showValue: true } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
    })
  })

  describe('when check is set', () => {
    it('then a check is drawn only once the bar is full', async () => {
      const wrapper = mount(MazProgressBar, { props: { value: 90, check: true } })
      await settle()

      expect(wrapper.find('.m-drawn-icon').exists()).toBe(false)

      await wrapper.setProps({ value: 100 })
      await settle()

      expect(wrapper.find('.m-drawn-icon').exists()).toBe(true)
    })

    it('then animated false draws it instantly', async () => {
      const wrapper = mount(MazProgressBar, { props: { value: 100, check: true, animated: false } })
      await settle()

      expect(wrapper.find('.m-drawn-icon').attributes('style')).toContain('--m-drawn-duration: 0s')
    })
  })

  describe('when neither showValue nor check is set', () => {
    it('then the bar is the root element with the same markup', () => {
      const wrapper = mount(MazProgressBar, { props: { value: 40 } })

      expect(wrapper.classes()).toContain('m-progress-bar')
      expect(wrapper.attributes('role')).toBe('progressbar')
      expect(wrapper.find('.m-progress-bar__aside').exists()).toBe(false)
    })
  })
})
