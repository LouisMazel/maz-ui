import type { MazBadgeColor, MazBadgeRoundedSize } from '@components/MazBadge.vue'
import MazBadge from '@components/MazBadge.vue'
import { mount } from '@vue/test-utils'
import { getColor } from '@/components/types'

describe('given MazBadge component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with primary color and default size', () => {
      const wrapper = mount(MazBadge, {
        slots: {
          default: 'Badge content',
        },
      })

      expect(wrapper.classes()).toContain('--primary')
      expect(wrapper.classes()).toContain('--rounded-md')
      expect(wrapper.attributes('style')).toContain('font-size: 0.8em')
      expect(wrapper.text()).toBe('Badge content')
    })
  })

  describe('when rendered with different colors', () => {
    it.each(
      ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'background'] as MazBadgeColor[],
    )('then it should apply the %s color classes', (color) => {
      const wrapper = mount(MazBadge, {
        props: { color },
      })

      expect(wrapper.classes()).toContain(`--${getColor(color)}`)
    })
  })

  describe('when rendered with outlined prop', () => {
    it('then it should apply the outlined class', () => {
      const wrapper = mount(MazBadge, {
        props: { outlined: true },
      })

      expect(wrapper.classes()).toContain('--outlined')
    })
  })

  describe('when rendered with pastel prop', () => {
    it('then it should apply the pastel class', () => {
      const wrapper = mount(MazBadge, {
        props: { pastel: true },
      })

      expect(wrapper.classes()).toContain('--pastel')
    })
  })

  describe('when rendered with nowrap prop', () => {
    it('then it should apply the nowrap class', () => {
      const wrapper = mount(MazBadge, {
        props: { nowrap: true },
      })

      expect(wrapper.classes()).toContain('--nowrap')
    })
  })

  describe('when rendered with different rounded sizes', () => {
    it('then it should apply the correct rounded classes', () => {
      const sizes: MazBadgeRoundedSize[] = ['none', 'sm', 'md', 'lg', 'xl', 'full']

      sizes.forEach((size) => {
        const wrapper = mount(MazBadge, {
          props: { roundedSize: size },
        })
        expect(wrapper.classes()).toContain(`--rounded-${size}`)
      })
    })
  })

  describe('when rendered with custom size', () => {
    it('then it should apply the custom font size', () => {
      const wrapper = mount(MazBadge, {
        props: { size: '1.5em' },
      })

      expect(wrapper.attributes('style')).toContain('font-size: 1.5em')
    })
  })

  describe('when rendered with combined props', () => {
    it('then it should apply all modifier classes', () => {
      const wrapper = mount(MazBadge, {
        props: {
          color: 'success',
          outlined: true,
          pastel: true,
          nowrap: true,
          roundedSize: 'full',
        },
      })

      expect(wrapper.classes()).toContain('--success')
      expect(wrapper.classes()).toContain('--outlined')
      expect(wrapper.classes()).toContain('--pastel')
      expect(wrapper.classes()).toContain('--nowrap')
      expect(wrapper.classes()).toContain('--rounded-full')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazBadge, {
        slots: {
          default: '<span>Custom HTML</span>',
        },
      })

      expect(wrapper.html()).toContain('<span>Custom HTML</span>')
    })
  })
})
