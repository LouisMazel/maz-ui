import MazBtnScroll from '@components/MazBtnScroll.vue'
import { mount } from '@vue/test-utils'

function takeoffEnd() {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: 'm-btn-scroll-takeoff' })

  return event
}

describe('given MazBtnScroll takeoff', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  describe('when the button is clicked', () => {
    it('then the arrow takes off until the animation ends', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true } })

      expect(wrapper.find('.m-btn-scroll').classes()).not.toContain('--launched')

      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.m-btn-scroll').classes()).toContain('--launched')

      wrapper.find('.m-btn-scroll').element.dispatchEvent(takeoffEnd())
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-btn-scroll').classes()).not.toContain('--launched')
    })

    it('then it goes up for the top and down for the bottom', () => {
      const top = mount(MazBtnScroll, { props: { visible: true, to: 'top' } })
      const bottom = mount(MazBtnScroll, { props: { visible: true, to: 'bottom' } })

      expect(top.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-dir: -1')
      expect(bottom.find('.m-btn-scroll').attributes('style')).toContain('--m-btn-scroll-dir: 1')
    })
  })

  describe('when another animation ends', () => {
    it('then the takeoff continues', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true } })

      await wrapper.find('button').trigger('click')

      const event = new Event('animationend', { bubbles: true })
      Object.defineProperty(event, 'animationName', { value: 'other' })
      wrapper.find('.m-btn-scroll').element.dispatchEvent(event)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-btn-scroll').classes()).toContain('--launched')
    })
  })

  describe('when animated is false', () => {
    it('then the arrow does not take off', async () => {
      const wrapper = mount(MazBtnScroll, { props: { visible: true, animated: false } })

      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.m-btn-scroll').classes()).not.toContain('--launched')
    })
  })
})
