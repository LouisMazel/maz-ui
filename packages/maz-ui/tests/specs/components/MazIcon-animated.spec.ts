import MazIcon from '@components/MazIcon.vue'
import { registerIcon } from '@maz-ui/icons/registry'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

enableAutoUnmount(afterEach)

function named(name: string) {
  return defineComponent({ name, render: () => h('svg') })
}

describe('given a MazIcon with the animated prop', () => {
  describe('when the icon is not animated', () => {
    it('then the root has no animation attribute', () => {
      const wrapper = mount(MazIcon, { props: { icon: named('MazBell') } })

      expect(wrapper.classes()).not.toContain('m-icon--animated')
      expect(wrapper.attributes('data-animation')).toBeUndefined()
    })
  })

  describe('when the icon is animated and its name is known', () => {
    it.each([
      ['MazBell', 'ring'],
      ['MazBellAlert', 'ring'],
      ['MazTrash', 'lift'],
      ['MazCog', 'spin'],
      ['MazCog6Tooth', 'spin'],
      ['MazPaperAirplane', 'takeoff'],
      ['MazHeart', 'beat'],
      ['MazArrowRight', 'nudge'],
    ])('then %s plays %s', (name, animation) => {
      const wrapper = mount(MazIcon, { props: { icon: named(name), animated: true } })

      expect(wrapper.classes()).toContain('m-icon--animated')
      expect(wrapper.attributes('data-animation')).toBe(animation)
    })

    it.each([
      ['MazArrowLeft', 'left'],
      ['MazArrowUp', 'up'],
      ['MazArrowLongDown', 'down'],
      ['MazArrowSmallRight', 'right'],
    ])('then %s nudges toward %s', (name, direction) => {
      const wrapper = mount(MazIcon, { props: { icon: named(name), animated: true } })

      expect(wrapper.attributes('data-direction')).toBe(direction)
    })

    it('then a registered icon name works', async () => {
      registerIcon('heart', '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>')

      const wrapper = mount(MazIcon, { props: { icon: 'heart', animated: true } })

      await flushPromises()

      expect(wrapper.attributes('data-animation')).toBe('beat')
    })
  })

  describe('when the icon is unknown', () => {
    it('then nothing is animated', () => {
      const wrapper = mount(MazIcon, { props: { icon: named('MazStar'), animated: true } })

      expect(wrapper.classes()).not.toContain('m-icon--animated')
    })

    it('then a raw svg is not animated', () => {
      const wrapper = mount(MazIcon, { props: { icon: '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>', animated: true } })

      expect(wrapper.attributes('data-animation')).toBeUndefined()
    })

    it('then the animation prop forces one', () => {
      const wrapper = mount(MazIcon, { props: { icon: named('MazStar'), animated: true, animation: 'beat' } })

      expect(wrapper.attributes('data-animation')).toBe('beat')
      expect(wrapper.classes()).toContain('m-icon--animated')
    })

    it('then the animation prop alone does nothing without animated', () => {
      const wrapper = mount(MazIcon, { props: { icon: named('MazStar'), animation: 'beat' } })

      expect(wrapper.attributes('data-animation')).toBeUndefined()
    })
  })
})
