import type { MazBadgeColor, MazBadgeRoundedSize, MazBadgeSize } from '@components/MazBadge.vue'
import MazBadge from '@components/MazBadge.vue'
import { mount } from '@vue/test-utils'
import { getColor } from '@/components/types'

describe('given MazBadge component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with primary color, md size and md radius', () => {
      const wrapper = mount(MazBadge, {
        slots: {
          default: 'Badge content',
        },
      })

      expect(wrapper.classes()).toContain('--primary')
      expect(wrapper.classes()).toContain('--md')
      expect(wrapper.classes()).toContain('--rounded-md')
      expect(wrapper.classes()).toContain('maz:text-sm')
      expect(wrapper.text()).toBe('Badge content')
    })
  })

  describe('when rendered with different colors', () => {
    it.each(
      ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'background'] as MazBadgeColor[],
    )('then it applies the %s color classes', (color) => {
      const wrapper = mount(MazBadge, {
        props: { color },
      })

      expect(wrapper.classes()).toContain(`--${getColor(color)}`)
    })
  })

  describe('when rendered with outlined prop', () => {
    it('then it applies the outlined class', () => {
      const wrapper = mount(MazBadge, {
        props: { outlined: true },
      })

      expect(wrapper.classes()).toContain('--outlined')
    })
  })

  describe('when rendered with pastel prop', () => {
    it('then it applies the pastel class', () => {
      const wrapper = mount(MazBadge, {
        props: { pastel: true },
      })

      expect(wrapper.classes()).toContain('--pastel')
    })
  })

  describe('when rendered with nowrap prop', () => {
    it('then it applies the nowrap class', () => {
      const wrapper = mount(MazBadge, {
        props: { nowrap: true },
      })

      expect(wrapper.classes()).toContain('--nowrap')
    })
  })

  describe('when rendered with different rounded sizes', () => {
    it.each(['none', 'sm', 'md', 'lg', 'xl', 'full'] as MazBadgeRoundedSize[])('then it applies the --rounded-%s class', (size) => {
      const wrapper = mount(MazBadge, {
        props: { roundedSize: size },
      })

      expect(wrapper.classes()).toContain(`--rounded-${size}`)
    })
  })

  describe('when rendered with different sizes', () => {
    it.each([
      ['mini', 'maz:text-[0.625rem]'],
      ['xs', 'maz:text-[0.6875rem]'],
      ['sm', 'maz:text-xs'],
      ['md', 'maz:text-sm'],
      ['lg', 'maz:text-base'],
      ['xl', 'maz:text-lg'],
    ] as Array<[MazBadgeSize, string]>)('then it applies the --%s modifier and the matching text class', (size, textClass) => {
      const wrapper = mount(MazBadge, {
        props: { size },
      })

      expect(wrapper.classes()).toContain(`--${size}`)
      expect(wrapper.classes()).toContain(textClass)
    })
  })

  describe('when rendered with combined props', () => {
    it('then it applies all modifier classes', () => {
      const wrapper = mount(MazBadge, {
        props: {
          color: 'success',
          size: 'lg',
          outlined: true,
          pastel: true,
          nowrap: true,
          roundedSize: 'full',
        },
      })

      expect(wrapper.classes()).toContain('--success')
      expect(wrapper.classes()).toContain('--lg')
      expect(wrapper.classes()).toContain('--outlined')
      expect(wrapper.classes()).toContain('--pastel')
      expect(wrapper.classes()).toContain('--nowrap')
      expect(wrapper.classes()).toContain('--rounded-full')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it renders the slot content', () => {
      const wrapper = mount(MazBadge, {
        slots: {
          default: '<span>Custom HTML</span>',
        },
      })

      expect(wrapper.html()).toContain('<span>Custom HTML</span>')
    })
  })
})
