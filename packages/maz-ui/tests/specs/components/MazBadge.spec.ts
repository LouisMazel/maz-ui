import type { MazBadgeColor, MazBadgeRoundedSize, MazBadgeSize } from '@components/MazBadge.vue'
import MazBadge from '@components/MazBadge.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
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
      [
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'destructive',
        'contrast',
        'surface',
        'container',
      ] as MazBadgeColor[],
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

      expect(wrapper.classes()).toContain('maz:text-nowrap')
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
      ['xl', 'maz:text-xl'],
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
      expect(wrapper.classes()).toContain('maz:text-nowrap')
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

function mountBadgeWithGlobalConfig(config: unknown, props: Record<string, unknown> = {}) {
  return mount(MazBadge, {
    props,
    global: {
      provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config },
    },
  })
}

describe('given a MazUi global default for size', () => {
  describe('when no size prop is passed', () => {
    it('then it applies the global default size class', () => {
      const wrapper = mountBadgeWithGlobalConfig({
        global: { size: 'xl' },
      })

      expect(wrapper.classes()).toContain('--xl')
      expect(wrapper.classes()).toContain('maz:text-xl')
    })
  })

  describe('when a size prop is passed', () => {
    it('then the instance prop wins over the global default', () => {
      const wrapper = mountBadgeWithGlobalConfig({
        global: { size: 'xl' },
      }, { size: 'sm' })

      expect(wrapper.classes()).toContain('--sm')
      expect(wrapper.classes()).not.toContain('--xl')
    })
  })
})

describe('given MazBadge with the removable prop', () => {
  describe('when removable is not set', () => {
    it('then no remove button is rendered', () => {
      const wrapper = mount(MazBadge, {
        slots: { default: 'Tag' },
      })

      expect(wrapper.find('.m-badge__remove').exists()).toBe(false)
    })
  })

  describe('when removable is set', () => {
    it('then a labelled remove button with a hidden icon is rendered', () => {
      const wrapper = mount(MazBadge, {
        props: { removable: true },
        slots: { default: 'Tag' },
      })
      const button = wrapper.find('.m-badge__remove')

      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
      expect(button.attributes('aria-label')).toBeTruthy()
      expect(button.find('svg').exists()).toBe(true)
      expect(wrapper.text()).toBe('Tag')
    })

    it('then the remove button emits remove with the click event', async () => {
      const wrapper = mount(MazBadge, {
        props: { removable: true },
      })

      await wrapper.find('.m-badge__remove').trigger('click')

      const emitted = wrapper.emitted('remove')

      expect(emitted).toHaveLength(1)
      expect(emitted?.[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('when removeLabel is set', () => {
    it('then it is the aria-label of the remove button', () => {
      const wrapper = mount(MazBadge, {
        props: { removable: true, removeLabel: 'Delete tag' },
      })

      expect(wrapper.find('.m-badge__remove').attributes('aria-label')).toBe('Delete tag')
    })
  })
})

describe('given a MazUi global default for roundedSize', () => {
  describe('when no roundedSize prop is passed', () => {
    it('then it applies the global default rounded class', () => {
      const wrapper = mountBadgeWithGlobalConfig({
        global: { roundedSize: 'full' },
      })

      expect(wrapper.classes()).toContain('maz:rounded-full')
    })
  })

  describe('when a component-scoped default differs from the global default', () => {
    it('then the component-scoped default wins over the global default', () => {
      const wrapper = mountBadgeWithGlobalConfig({
        global: { roundedSize: 'full' },
        MazBadge: { roundedSize: 'sm' },
      })

      expect(wrapper.classes()).toContain('maz:rounded-xs')
      expect(wrapper.classes()).not.toContain('maz:rounded-full')
    })
  })
})
