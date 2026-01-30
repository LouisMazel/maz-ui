import type { MazAlertColor, MazAlertRoundedSize } from '@components/MazAlert.vue'
import MazAlert from '@components/MazAlert.vue'
import { mount } from '@vue/test-utils'

describe('given MazAlert component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with info color, bordered, and base rounded', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Alert title',
        },
      })

      expect(wrapper.classes()).toContain('--rounded-base')
      expect(wrapper.classes()).toContain('--bordered')
      expect(wrapper.attributes('role')).toBe('alert')
    })

    it('then it applies color CSS variables for info', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Alert title',
        },
      })

      const style = wrapper.attributes('style')
      expect(style).toContain('--m-alert-color: var(--maz-info-700)')
      expect(style).toContain('--m-alert-color-dark: var(--maz-info-400)')
      expect(style).toContain('--m-alert-bg: var(--maz-info)')
    })

    it('then it applies soft variant by default', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Alert title',
        },
      })

      expect(wrapper.classes()).toContain('--soft')
    })
  })

  describe('when rendered with different colors', () => {
    it.each([
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'destructive',
      'contrast',
    ] as MazAlertColor[])('then it applies the %s color CSS variables', (color) => {
      const wrapper = mount(MazAlert, {
        props: { color, title: 'Test' },
      })

      const style = wrapper.attributes('style')
      expect(style).toContain(`--m-alert-color: var(--maz-${color}-700)`)
      expect(style).toContain(`--m-alert-color-dark: var(--maz-${color}-400)`)
      expect(style).toContain(`--m-alert-bg: var(--maz-${color})`)
      expect(style).toContain(`--m-alert-fg: var(--maz-${color}-foreground)`)
      expect(style).toContain(`--m-alert-border: var(--maz-${color}-600)`)
    })
  })

  describe('when rendered with variant prop', () => {
    it('then it applies soft variant class', () => {
      const wrapper = mount(MazAlert, {
        props: {
          variant: 'soft',
          title: 'Test',
        },
      })

      expect(wrapper.classes()).toContain('--soft')
      expect(wrapper.classes()).not.toContain('--solid')
    })

    it('then it applies solid variant class', () => {
      const wrapper = mount(MazAlert, {
        props: {
          variant: 'solid',
          title: 'Test',
        },
      })

      expect(wrapper.classes()).toContain('--solid')
      expect(wrapper.classes()).not.toContain('--soft')
    })
  })

  describe('when rendered with title prop', () => {
    it('then it renders the title text', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Alert Title',
        },
      })

      expect(wrapper.find('.m-alert-title').text()).toBe('Alert Title')
    })

    it('then it sets aria-labelledby attribute', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Alert Title',
        },
      })

      const titleId = wrapper.find('.m-alert-title').attributes('id')
      expect(wrapper.attributes('aria-labelledby')).toBe(titleId)
    })
  })

  describe('when rendered with content prop', () => {
    it('then it renders the content text', () => {
      const wrapper = mount(MazAlert, {
        props: {
          content: 'Alert content text',
        },
      })

      expect(wrapper.find('.m-alert-content').text()).toBe('Alert content text')
    })

    it('then it sets aria-describedby attribute', () => {
      const wrapper = mount(MazAlert, {
        props: {
          content: 'Alert content',
        },
      })

      const contentId = wrapper.find('.m-alert-content').attributes('id')
      expect(wrapper.attributes('aria-describedby')).toBe(contentId)
    })
  })

  describe('when rendered with title slot', () => {
    it('then it renders the slot content instead of prop', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Prop title',
        },
        slots: {
          title: 'Slot title',
        },
      })

      expect(wrapper.find('.m-alert-title').text()).toBe('Slot title')
    })
  })

  describe('when rendered with default slot', () => {
    it('then it renders the slot content', () => {
      const wrapper = mount(MazAlert, {
        slots: {
          default: '<span class="custom-content">Custom HTML content</span>',
        },
      })

      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.find('.custom-content').text()).toBe('Custom HTML content')
    })
  })

  describe('when rendered with bordered prop set to false', () => {
    it('then it does not apply the bordered class', () => {
      const wrapper = mount(MazAlert, {
        props: {
          bordered: false,
          title: 'Test',
        },
      })

      expect(wrapper.classes()).not.toContain('--bordered')
    })
  })

  describe('when rendered with different rounded sizes', () => {
    it.each([
      'none',
      'sm',
      'md',
      'base',
      'lg',
      'xl',
      '2xl',
      '3xl',
    ] as MazAlertRoundedSize[])('then it applies the --rounded-%s class', (size) => {
      const wrapper = mount(MazAlert, {
        props: {
          roundedSize: size,
          title: 'Test',
        },
      })

      expect(wrapper.classes()).toContain(`--rounded-${size}`)
    })
  })

  describe('when rendered with hideIcon prop', () => {
    it('then it does not render the icon container', () => {
      const wrapper = mount(MazAlert, {
        props: {
          hideIcon: true,
          title: 'Test',
        },
      })

      expect(wrapper.find('.m-alert-icon').exists()).toBe(false)
    })
  })

  describe('when rendered without hideIcon prop', () => {
    it('then it renders the icon container with aria-hidden', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Test',
        },
      })

      const iconContainer = wrapper.find('.m-alert-icon')
      expect(iconContainer.exists()).toBe(true)
      expect(iconContainer.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when rendered without title and content', () => {
    it('then it does not set aria-labelledby', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
    })

    it('then it does not set aria-describedby', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    })

    it('then it does not render title element', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.find('.m-alert-title').exists()).toBe(false)
    })

    it('then it does not render content element', () => {
      const wrapper = mount(MazAlert)

      expect(wrapper.find('.m-alert-content').exists()).toBe(false)
    })
  })

  describe('when rendered with all props combined', () => {
    it('then it applies all configurations correctly', () => {
      const wrapper = mount(MazAlert, {
        props: {
          title: 'Combined Title',
          content: 'Combined content',
          color: 'success',
          roundedSize: 'xl',
          bordered: true,
          variant: 'solid',
        },
      })

      expect(wrapper.find('.m-alert-title').text()).toBe('Combined Title')
      expect(wrapper.find('.m-alert-content').text()).toBe('Combined content')
      expect(wrapper.classes()).toContain('--rounded-xl')
      expect(wrapper.classes()).toContain('--bordered')
      expect(wrapper.classes()).toContain('--solid')
      expect(wrapper.attributes('style')).toContain('--m-alert-bg: var(--maz-success)')
    })
  })
})
